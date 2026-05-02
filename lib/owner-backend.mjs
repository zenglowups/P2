import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { get as getBlob, put as putBlob } from "@vercel/blob";

export const DEFAULT_OWNER_USERNAME = "afroditi";
const DEFAULT_OWNER_PASSWORD = "change-this-password";
export const SESSION_COOKIE = "afroditi_owner_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const KNOWN_ACCOMMODATION_IDS = ["studio-double", "studio-deluxe"];
const KNOWN_ACCOMMODATION_ID_SET = new Set(KNOWN_ACCOMMODATION_IDS);
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const LOCAL_STATE_FILE = path.join(DATA_DIR, "owner-state.json");
const LEGACY_OVERRIDES_FILE = path.join(DATA_DIR, "calendar-overrides.json");
const BLOB_STATE_PATHNAME = "owner/owner-state.json";
const LOCAL_FALLBACK_SECRET = "afroditi-local-dev-secret";
const VERCEL_BLOB_REQUIRED_MESSAGE =
  "Panoul proprietar nu este configurat complet pe Vercel. Creeaza un Private Blob store, apoi fa Redeploy.";

function stripWrappingQuotes(value) {
  if (value.length >= 2) {
    const firstChar = value[0];
    const lastChar = value[value.length - 1];
    if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
      return value.slice(1, -1);
    }
  }

  return value;
}

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex <= 0) {
        return;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || Object.hasOwn(process.env, key)) {
        return;
      }

      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      process.env[key] = stripWrappingQuotes(rawValue);
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

loadEnvFile(path.join(ROOT_DIR, ".env"));

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getConfiguredOwnerUsername() {
  return String(process.env.OWNER_USERNAME || DEFAULT_OWNER_USERNAME).trim() || DEFAULT_OWNER_USERNAME;
}

function getConfiguredOwnerPasswordHash(username = getConfiguredOwnerUsername()) {
  const envPassword = String(process.env.OWNER_PASSWORD || "");
  if (envPassword) {
    return sha256Hex(`${username}:${envPassword}`);
  }

  const envHash = String(process.env.OWNER_PASSWORD_HASH || "").trim();
  if (envHash) {
    return envHash;
  }

  return sha256Hex(`${username}:${DEFAULT_OWNER_PASSWORD}`);
}

function sanitizeWhatsappNumber(value) {
  return String(value || "").replace(/\D+/g, "");
}

function getConfiguredWhatsappNumber() {
  return sanitizeWhatsappNumber(process.env.PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || "");
}

function getSessionSecret() {
  return String(
    process.env.OWNER_SESSION_SECRET ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.OWNER_PASSWORD_HASH ||
      process.env.OWNER_PASSWORD ||
      sha256Hex(`${ROOT_DIR}:${LOCAL_FALLBACK_SECRET}`),
  ).trim();
}

export function getStorageMode() {
  if (String(process.env.BLOB_READ_WRITE_TOKEN || "").trim()) {
    return "vercel-blob";
  }

  if (String(process.env.VERCEL || "").trim() || String(process.env.VERCEL_ENV || "").trim()) {
    return "storage-unconfigured";
  }

  return "local-file";
}

function normalizeOverrideList(values) {
  return Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => String(value || "").trim())
        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)),
    ),
  ).sort();
}

export function normalizeOverrides(raw) {
  const base = Object.fromEntries(
    KNOWN_ACCOMMODATION_IDS.map((accommodationId) => [accommodationId, { occupied: [], free: [] }]),
  );

  if (!raw || typeof raw !== "object") {
    return base;
  }

  for (const [accommodationId, value] of Object.entries(raw)) {
    if (!KNOWN_ACCOMMODATION_ID_SET.has(accommodationId)) {
      continue;
    }

    base[accommodationId] = {
      occupied: normalizeOverrideList(value?.occupied),
      free: normalizeOverrideList(value?.free),
    };
  }

  return base;
}

function normalizeOwnerState(raw, fallbackState = null) {
  const fallbackUsername = fallbackState?.ownerUsername || getConfiguredOwnerUsername();
  const ownerUsername = String(raw?.ownerUsername || fallbackUsername).trim() || DEFAULT_OWNER_USERNAME;
  const ownerPasswordHash =
    String(raw?.ownerPasswordHash || "").trim() || getConfiguredOwnerPasswordHash(ownerUsername);
  const fallbackWhatsappNumber =
    fallbackState?.contactSettings?.whatsappNumber || raw?.contactSettings?.whatsappNumber || getConfiguredWhatsappNumber();

  return {
    version: 2,
    ownerUsername,
    ownerPasswordHash,
    contactSettings: {
      whatsappNumber: sanitizeWhatsappNumber(fallbackWhatsappNumber),
    },
    overrides: normalizeOverrides(raw?.overrides),
    updatedAt: new Date().toISOString(),
  };
}

function createInitialOwnerState(overrides = {}) {
  const ownerUsername = getConfiguredOwnerUsername();
  return normalizeOwnerState({
    ownerUsername,
    ownerPasswordHash: getConfiguredOwnerPasswordHash(ownerUsername),
    overrides,
  });
}

async function ensureLocalDataDir() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
}

async function readLegacyOverrides() {
  try {
    const raw = await fsp.readFile(LEGACY_OVERRIDES_FILE, "utf8");
    return normalizeOverrides(JSON.parse(raw));
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof SyntaxError) {
      return normalizeOverrides({});
    }

    throw error;
  }
}

async function readLocalState() {
  await ensureLocalDataDir();

  try {
    const raw = await fsp.readFile(LOCAL_STATE_FILE, "utf8");
    return normalizeOwnerState(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const initialState = createInitialOwnerState(await readLegacyOverrides());
  await writeLocalState(initialState);
  return initialState;
}

async function writeLocalState(state) {
  await ensureLocalDataDir();
  const normalized = normalizeOwnerState(state);
  await fsp.writeFile(LOCAL_STATE_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function readBlobState() {
  const result = await getBlob(BLOB_STATE_PATHNAME, {
    access: "private",
    useCache: false,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    const initialState = createInitialOwnerState(await readLegacyOverrides());
    await writeBlobState(initialState);
    return initialState;
  }

  const text = await new Response(result.stream).text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new HttpError(500, "Datele salvate pentru panoul proprietar sunt invalide.");
  }

  return normalizeOwnerState(parsed);
}

async function writeBlobState(state) {
  const normalized = normalizeOwnerState(state);
  await putBlob(BLOB_STATE_PATHNAME, `${JSON.stringify(normalized, null, 2)}\n`, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json; charset=utf-8",
  });

  return normalized;
}

async function readOwnerState() {
  const storageMode = getStorageMode();

  if (storageMode === "vercel-blob") {
    return readBlobState();
  }

  if (storageMode === "storage-unconfigured") {
    throw new HttpError(503, VERCEL_BLOB_REQUIRED_MESSAGE);
  }

  return readLocalState();
}

async function writeOwnerState(state) {
  const storageMode = getStorageMode();

  if (storageMode === "vercel-blob") {
    return writeBlobState(state);
  }

  if (storageMode === "storage-unconfigured") {
    throw new HttpError(503, VERCEL_BLOB_REQUIRED_MESSAGE);
  }

  return writeLocalState(state);
}

function getHeaderValue(headers, key) {
  if (!headers) {
    return "";
  }

  if (headers instanceof Headers || typeof headers.get === "function") {
    return String(headers.get(key) || headers.get(key.toLowerCase()) || "");
  }

  const directValue = headers[key] ?? headers[key.toLowerCase()];
  if (Array.isArray(directValue)) {
    return directValue.join("; ");
  }

  return String(directValue || "");
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    String(cookieHeader || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function signSessionPayload(payload) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function verifySignedValue(payload, signature) {
  const expectedSignature = signSessionPayload(payload);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(String(signature || ""));

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function readSessionPayload(headers) {
  const cookies = parseCookies(getHeaderValue(headers, "cookie"));
  const token = String(cookies[SESSION_COOKIE] || "");
  if (!token) {
    return null;
  }

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0) {
    return null;
  }

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (!verifySignedValue(payload, signature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session || typeof session !== "object") {
      return null;
    }

    if (Number(session.expiresAt || 0) <= Date.now()) {
      return null;
    }

    return {
      username: String(session.username || "").trim(),
      expiresAt: Number(session.expiresAt || 0),
    };
  } catch {
    return null;
  }
}

function shouldUseSecureCookies(headers) {
  return getHeaderValue(headers, "x-forwarded-proto").toLowerCase().includes("https");
}

export function createSessionCookie(headers, username) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + SESSION_TTL_MS,
    }),
  ).toString("base64url");
  const signature = signSessionPayload(payload);
  let cookie = `${SESSION_COOKIE}=${encodeURIComponent(`${payload}.${signature}`)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${
    SESSION_TTL_MS / 1000
  }`;

  if (shouldUseSecureCookies(headers)) {
    cookie += "; Secure";
  }

  return cookie;
}

export function clearSessionCookie(headers) {
  let cookie = `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;

  if (shouldUseSecureCookies(headers)) {
    cookie += "; Secure";
  }

  return cookie;
}

function isValidCredentialPair(state, username, password) {
  const cleanUsername = String(username || "").trim();
  const cleanPassword = String(password || "");
  return cleanUsername === state.ownerUsername && sha256Hex(`${cleanUsername}:${cleanPassword}`) === state.ownerPasswordHash;
}

function assertAuthenticated(headers, state) {
  const session = readSessionPayload(headers);
  if (!session || session.username !== state.ownerUsername) {
    throw new HttpError(401, "Trebuie sa fii autentificat.");
  }
}

function validateOwnerUsername(value) {
  const cleanValue = String(value || "").trim();
  if (cleanValue.length < 3) {
    throw new HttpError(400, "Userul trebuie sa aiba cel putin 3 caractere.");
  }

  if (cleanValue.length > 64) {
    throw new HttpError(400, "Userul este prea lung.");
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(cleanValue)) {
    throw new HttpError(400, "Userul poate contine doar litere, cifre, punct, underscore si minus.");
  }

  return cleanValue;
}

function validateOwnerPassword(value) {
  const cleanValue = String(value || "");
  if (cleanValue.length < 8) {
    throw new HttpError(400, "Parola noua trebuie sa aiba cel putin 8 caractere.");
  }

  if (cleanValue.length > 200) {
    throw new HttpError(400, "Parola noua este prea lunga.");
  }

  return cleanValue;
}

export async function getBootstrapPayload(headers) {
  const storageMode = getStorageMode();
  if (storageMode === "storage-unconfigured") {
    return {
      ownerEnabled: false,
      authenticated: false,
      ownerUsername: "",
      whatsappNumber: getConfiguredWhatsappNumber(),
      overrides: normalizeOverrides({}),
      storageMode,
      setupMessage: VERCEL_BLOB_REQUIRED_MESSAGE,
    };
  }

  const state = await readOwnerState();
  const session = readSessionPayload(headers);

  return {
    ownerEnabled: true,
    authenticated: !!session && session.username === state.ownerUsername,
    ownerUsername: session && session.username === state.ownerUsername ? state.ownerUsername : "",
    whatsappNumber: state.contactSettings?.whatsappNumber || "",
    overrides: state.overrides,
    storageMode,
  };
}

export async function loginOwner({ headers, username, password }) {
  const state = await readOwnerState();

  if (!isValidCredentialPair(state, username, password)) {
    throw new HttpError(401, "User sau parola invalida.");
  }

  return {
    payload: {
      authenticated: true,
      ownerUsername: state.ownerUsername,
      whatsappNumber: state.contactSettings?.whatsappNumber || "",
      overrides: state.overrides,
      storageMode: getStorageMode(),
    },
    setCookie: createSessionCookie(headers, state.ownerUsername),
  };
}

export async function logoutOwner({ headers }) {
  return {
    payload: { authenticated: false },
    setCookie: clearSessionCookie(headers),
  };
}

export async function toggleOwnerCalendar({ headers, accommodationId, date, mode }) {
  const state = await readOwnerState();
  assertAuthenticated(headers, state);

  const cleanAccommodationId = String(accommodationId || "").trim();
  const cleanDate = String(date || "").trim();
  const cleanMode = mode === "free" ? "free" : "occupied";

  if (!KNOWN_ACCOMMODATION_ID_SET.has(cleanAccommodationId)) {
    throw new HttpError(400, "Cazare invalida.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    throw new HttpError(400, "Data invalida.");
  }

  const overrides = normalizeOverrides(state.overrides);
  const bucket = overrides[cleanAccommodationId] || { occupied: [], free: [] };
  const currentList = cleanMode === "occupied" ? bucket.occupied : bucket.free;
  const alreadyApplied = currentList.includes(cleanDate);

  bucket.occupied = bucket.occupied.filter((day) => day !== cleanDate);
  bucket.free = bucket.free.filter((day) => day !== cleanDate);

  if (!alreadyApplied) {
    const targetList = cleanMode === "occupied" ? bucket.occupied : bucket.free;
    targetList.push(cleanDate);
    targetList.sort();
  }

  overrides[cleanAccommodationId] = {
    occupied: normalizeOverrideList(bucket.occupied),
    free: normalizeOverrideList(bucket.free),
  };

  const savedState = await writeOwnerState({
    ...state,
    overrides,
  });

  return {
    payload: {
      overrides: savedState.overrides,
    },
  };
}

export async function updateOwnerCredentials({ headers, currentPassword, nextUsername, nextPassword }) {
  const state = await readOwnerState();
  assertAuthenticated(headers, state);

  if (!isValidCredentialPair(state, state.ownerUsername, currentPassword)) {
    throw new HttpError(401, "Parola curenta nu este corecta.");
  }

  const cleanNextUsername = validateOwnerUsername(nextUsername);
  const cleanNextPassword = validateOwnerPassword(nextPassword);

  const savedState = await writeOwnerState({
    ...state,
    ownerUsername: cleanNextUsername,
    ownerPasswordHash: sha256Hex(`${cleanNextUsername}:${cleanNextPassword}`),
  });

  return {
    payload: {
      authenticated: true,
      ownerUsername: savedState.ownerUsername,
      whatsappNumber: savedState.contactSettings?.whatsappNumber || "",
      overrides: savedState.overrides,
      storageMode: getStorageMode(),
    },
    setCookie: createSessionCookie(headers, savedState.ownerUsername),
  };
}

function validateWhatsappNumber(value) {
  const cleanValue = sanitizeWhatsappNumber(value);
  if (!cleanValue) {
    return "";
  }

  if (cleanValue.length < 8) {
    throw new HttpError(400, "Numarul WhatsApp trebuie sa includa codul de tara si sa aiba cel putin 8 cifre.");
  }

  if (cleanValue.length > 18) {
    throw new HttpError(400, "Numarul WhatsApp este prea lung.");
  }

  return cleanValue;
}

export async function updatePublicContactSettings({ headers, whatsappNumber }) {
  const state = await readOwnerState();
  assertAuthenticated(headers, state);

  const cleanWhatsappNumber = validateWhatsappNumber(whatsappNumber);
  const savedState = await writeOwnerState({
    ...state,
    contactSettings: {
      ...(state.contactSettings || {}),
      whatsappNumber: cleanWhatsappNumber,
    },
  });

  return {
    payload: {
      whatsappNumber: savedState.contactSettings?.whatsappNumber || "",
    },
  };
}
