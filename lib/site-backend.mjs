import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { get as getBlob, put as putBlob } from "@vercel/blob";

import { HttpError, getStorageMode, sha256Hex } from "./owner-backend.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const LOCAL_SITE_STATE_FILE = path.join(DATA_DIR, "site-state.json");
const BLOB_SITE_STATE_PATHNAME = "owner/site-state.json";
const SITE_POLICY_VERSION = "2026-05-04-mandatory-analytics";
const SESSION_GAP_MS = 1000 * 60 * 30;

const EVENT_TYPE_TO_BUCKET = {
  whatsapp_request: "whatsappRequests",
  social_click: "socialClicks",
  policy_open: "policyOpens",
};

let memoryState = null;

function getSiteStorageMode() {
  const ownerStorageMode = getStorageMode();
  if (ownerStorageMode === "vercel-blob") {
    return "vercel-blob";
  }
  if (ownerStorageMode === "local-file") {
    return "local-file";
  }
  return "memory";
}

function getAnalyticsSecret() {
  return String(
    process.env.SITE_ANALYTICS_SECRET ||
      process.env.OWNER_SESSION_SECRET ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      sha256Hex(`${ROOT_DIR}:afroditi-site-analytics`),
  ).trim();
}

function sanitizePathname(value) {
  const cleanValue = String(value || "/").trim();
  if (!cleanValue.startsWith("/")) {
    return "/";
  }
  return cleanValue.slice(0, 180);
}

function sanitizeSource(value) {
  return String(value || "").trim().slice(0, 40) || "manual";
}

function normalizeIsoDate(value, fallback) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function toPositiveInteger(value) {
  return Math.max(0, Number.parseInt(value, 10) || 0);
}

function getDateKey(isoDate = new Date().toISOString()) {
  return String(isoDate).slice(0, 10);
}

function createEmptyDayBucket() {
  return {
    entries: 0,
    newVisitors: 0,
    analyticsEntries: 0,
    preferenceSaves: 0,
    analyticsOptIns: 0,
    whatsappRequests: 0,
    socialClicks: 0,
    policyOpens: 0,
  };
}

function normalizeDayBucket(raw) {
  return {
    entries: toPositiveInteger(raw?.entries),
    newVisitors: toPositiveInteger(raw?.newVisitors),
    analyticsEntries: toPositiveInteger(raw?.analyticsEntries),
    preferenceSaves: toPositiveInteger(raw?.preferenceSaves),
    analyticsOptIns: toPositiveInteger(raw?.analyticsOptIns),
    whatsappRequests: toPositiveInteger(raw?.whatsappRequests),
    socialClicks: toPositiveInteger(raw?.socialClicks),
    policyOpens: toPositiveInteger(raw?.policyOpens),
  };
}

function normalizeDailyStats(raw) {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const normalized = {};
  for (const [dateKey, value] of Object.entries(raw)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      continue;
    }
    normalized[dateKey] = normalizeDayBucket(value);
  }

  return normalized;
}

function createDefaultPreferences() {
  return {
    analytics: false,
    savedAt: "",
    termsAcceptedAt: "",
    policyVersion: "",
    source: "",
  };
}

function normalizePreferences(raw) {
  const defaults = createDefaultPreferences();
  if (!raw || typeof raw !== "object") {
    return defaults;
  }

  const savedAt = String(raw.savedAt || "").trim();
  const termsAcceptedAt = String(raw.termsAcceptedAt || "").trim();

  return {
    analytics: !!raw.analytics,
    savedAt: savedAt ? normalizeIsoDate(savedAt, "") : "",
    termsAcceptedAt: termsAcceptedAt ? normalizeIsoDate(termsAcceptedAt, "") : "",
    policyVersion: String(raw.policyVersion || "").trim().slice(0, 40),
    source: sanitizeSource(raw.source),
  };
}

function createDefaultEventCounts() {
  return {
    whatsappRequests: 0,
    socialClicks: 0,
    policyOpens: 0,
  };
}

function normalizeEventCounts(raw) {
  return {
    whatsappRequests: toPositiveInteger(raw?.whatsappRequests),
    socialClicks: toPositiveInteger(raw?.socialClicks),
    policyOpens: toPositiveInteger(raw?.policyOpens),
  };
}

function createEmptyVisitor(nowIso = new Date().toISOString()) {
  return {
    firstSeenAt: nowIso,
    lastSeenAt: nowIso,
    lastEntryAt: "",
    lastAnalyticsEntryAt: "",
    lastPath: "/",
    visitCount: 0,
    analyticsVisitCount: 0,
    preferences: createDefaultPreferences(),
    eventCounts: createDefaultEventCounts(),
  };
}

function normalizeVisitor(raw, nowIso = new Date().toISOString()) {
  const base = createEmptyVisitor(nowIso);
  if (!raw || typeof raw !== "object") {
    return base;
  }

  return {
    firstSeenAt: normalizeIsoDate(raw.firstSeenAt, base.firstSeenAt),
    lastSeenAt: normalizeIsoDate(raw.lastSeenAt, base.lastSeenAt),
    lastEntryAt: String(raw.lastEntryAt || "").trim()
      ? normalizeIsoDate(raw.lastEntryAt, "")
      : "",
    lastAnalyticsEntryAt: String(raw.lastAnalyticsEntryAt || "").trim()
      ? normalizeIsoDate(raw.lastAnalyticsEntryAt, "")
      : "",
    lastPath: sanitizePathname(raw.lastPath),
    visitCount: toPositiveInteger(raw.visitCount),
    analyticsVisitCount: toPositiveInteger(raw.analyticsVisitCount),
    preferences: normalizePreferences(raw.preferences),
    eventCounts: normalizeEventCounts(raw.eventCounts),
  };
}

function normalizeVisitors(raw) {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const nowIso = new Date().toISOString();
  const normalized = {};
  for (const [visitorId, value] of Object.entries(raw)) {
    if (!/^[a-f0-9]{64}$/i.test(visitorId)) {
      continue;
    }
    normalized[visitorId] = normalizeVisitor(value, nowIso);
  }

  return normalized;
}

function normalizeSiteState(raw) {
  const nowIso = new Date().toISOString();
  return {
    version: 1,
    visitors: normalizeVisitors(raw?.visitors),
    dailyStats: normalizeDailyStats(raw?.dailyStats),
    updatedAt: normalizeIsoDate(raw?.updatedAt, nowIso),
  };
}

function createInitialSiteState() {
  return normalizeSiteState({});
}

async function ensureLocalDataDir() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
}

async function readLocalSiteState() {
  await ensureLocalDataDir();

  try {
    const raw = await fsp.readFile(LOCAL_SITE_STATE_FILE, "utf8");
    return normalizeSiteState(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const initialState = createInitialSiteState();
  await writeLocalSiteState(initialState);
  return initialState;
}

async function writeLocalSiteState(state) {
  await ensureLocalDataDir();
  const normalized = normalizeSiteState(state);
  await fsp.writeFile(LOCAL_SITE_STATE_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function readBlobSiteState() {
  const result = await getBlob(BLOB_SITE_STATE_PATHNAME, {
    access: "private",
    useCache: false,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    const initialState = createInitialSiteState();
    await writeBlobSiteState(initialState);
    return initialState;
  }

  const text = await new Response(result.stream).text();

  try {
    return normalizeSiteState(JSON.parse(text));
  } catch {
    throw new HttpError(500, "Datele analytics salvate sunt invalide.");
  }
}

async function writeBlobSiteState(state) {
  const normalized = normalizeSiteState(state);
  await putBlob(BLOB_SITE_STATE_PATHNAME, `${JSON.stringify(normalized, null, 2)}\n`, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json; charset=utf-8",
  });

  return normalized;
}

async function readSiteState() {
  const storageMode = getSiteStorageMode();

  if (storageMode === "vercel-blob") {
    return readBlobSiteState();
  }

  if (storageMode === "local-file") {
    return readLocalSiteState();
  }

  if (!memoryState) {
    memoryState = createInitialSiteState();
  }

  return normalizeSiteState(memoryState);
}

async function writeSiteState(state) {
  const storageMode = getSiteStorageMode();

  if (storageMode === "vercel-blob") {
    return writeBlobSiteState(state);
  }

  if (storageMode === "local-file") {
    return writeLocalSiteState(state);
  }

  memoryState = normalizeSiteState(state);
  return memoryState;
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

function extractClientIp(headers, socketAddress) {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)[0];

  const rawAddress = forwardedFor || String(socketAddress || "").trim();
  const normalizedAddress = rawAddress.replace(/^::ffff:/, "").trim();

  return normalizedAddress || "unknown";
}

function getVisitorId(headers, socketAddress) {
  return sha256Hex(`${getAnalyticsSecret()}:${extractClientIp(headers, socketAddress)}`);
}

function ensureDayBucket(state, dateKey) {
  if (!state.dailyStats[dateKey]) {
    state.dailyStats[dateKey] = createEmptyDayBucket();
  }

  return state.dailyStats[dateKey];
}

function bumpDayMetric(state, dateKey, metric, amount = 1) {
  const bucket = ensureDayBucket(state, dateKey);
  bucket[metric] = toPositiveInteger(bucket[metric]) + amount;
}

function incrementAnalyticsForCurrentEntry(visitor, state, dateKey) {
  if (!visitor.preferences.analytics || !visitor.lastEntryAt) {
    return false;
  }

  if (visitor.lastAnalyticsEntryAt === visitor.lastEntryAt) {
    return false;
  }

  visitor.analyticsVisitCount += 1;
  visitor.lastAnalyticsEntryAt = visitor.lastEntryAt;
  bumpDayMetric(state, dateKey, "analyticsEntries");
  return true;
}

function buildVisitorPayload(visitor, overrides = {}) {
  return {
    analyticsEnabled: !!visitor.preferences.analytics,
    preferencesSaved: !!visitor.preferences.savedAt,
    policyVersion: SITE_POLICY_VERSION,
    savedAt: visitor.preferences.savedAt || "",
    storageMode: getSiteStorageMode(),
    ...overrides,
  };
}

function syncMandatoryVisitorPreferences(visitor, nowIso, source = "mandatory-ip") {
  const previousPreferences = normalizePreferences(visitor.preferences);
  const nextSavedAt = previousPreferences.savedAt || nowIso;
  const nextSource = sanitizeSource(previousPreferences.source || source);

  visitor.preferences = {
    analytics: true,
    savedAt: nextSavedAt,
    termsAcceptedAt: previousPreferences.termsAcceptedAt || "",
    policyVersion: SITE_POLICY_VERSION,
    source: nextSource,
  };
}

export async function getVisitorBootstrap({ headers, socketAddress, pathname }) {
  const nowIso = new Date().toISOString();
  const dateKey = getDateKey(nowIso);
  const state = await readSiteState();
  const visitorId = getVisitorId(headers, socketAddress);
  const existingVisitor = state.visitors[visitorId];
  const visitor = normalizeVisitor(existingVisitor, nowIso);
  const isNewVisitor = !existingVisitor;
  const lastSeenMs = existingVisitor && visitor.lastSeenAt ? Date.parse(visitor.lastSeenAt) : 0;
  const isNewSession = isNewVisitor || !lastSeenMs || Date.now() - lastSeenMs > SESSION_GAP_MS;

  syncMandatoryVisitorPreferences(visitor, nowIso, isNewVisitor ? "first-visit" : "returning-ip");
  visitor.lastSeenAt = nowIso;
  visitor.lastPath = sanitizePathname(pathname);

  if (isNewSession) {
    visitor.visitCount += 1;
    visitor.lastEntryAt = nowIso;
    bumpDayMetric(state, dateKey, "entries");
    if (isNewVisitor) {
      bumpDayMetric(state, dateKey, "newVisitors");
    }
    incrementAnalyticsForCurrentEntry(visitor, state, dateKey);
  }

  state.visitors[visitorId] = visitor;
  state.updatedAt = nowIso;
  await writeSiteState(state);

  return {
    shouldShowWelcome: !visitor.preferences.termsAcceptedAt,
    isNewVisitor,
    visitor: buildVisitorPayload(visitor),
  };
}

export async function saveVisitorPreferences({ headers, socketAddress, pathname, source }) {
  const nowIso = new Date().toISOString();
  const dateKey = getDateKey(nowIso);
  const state = await readSiteState();
  const visitorId = getVisitorId(headers, socketAddress);
  const visitor = normalizeVisitor(state.visitors[visitorId], nowIso);
  const previousPreferences = normalizePreferences(visitor.preferences);
  const wasAnalyticsEnabled = !!previousPreferences.analytics;
  const hadSavedAt = !!previousPreferences.savedAt;
  const hadTermsAcceptedAt = !!previousPreferences.termsAcceptedAt;
  const hadCurrentPolicy = previousPreferences.policyVersion === SITE_POLICY_VERSION;

  syncMandatoryVisitorPreferences(visitor, nowIso, source || previousPreferences.source || "manual");
  visitor.lastSeenAt = nowIso;
  visitor.lastPath = sanitizePathname(pathname);

  if (!visitor.lastEntryAt) {
    visitor.visitCount += 1;
    visitor.lastEntryAt = nowIso;
    bumpDayMetric(state, dateKey, "entries");
    if (!state.visitors[visitorId]) {
      bumpDayMetric(state, dateKey, "newVisitors");
    }
  }

  visitor.preferences.savedAt = visitor.preferences.savedAt || nowIso;
  visitor.preferences.termsAcceptedAt = nowIso;
  visitor.preferences.policyVersion = SITE_POLICY_VERSION;
  visitor.preferences.source = sanitizeSource(source || previousPreferences.source || "manual");

  if (!hadSavedAt || !hadTermsAcceptedAt || !hadCurrentPolicy) {
    bumpDayMetric(state, dateKey, "preferenceSaves");
  }
  if (visitor.preferences.analytics && !wasAnalyticsEnabled) {
    bumpDayMetric(state, dateKey, "analyticsOptIns");
    incrementAnalyticsForCurrentEntry(visitor, state, dateKey);
  }

  state.visitors[visitorId] = visitor;
  state.updatedAt = nowIso;
  await writeSiteState(state);

  return {
    visitor: buildVisitorPayload(visitor, {
      shouldShowWelcome: false,
    }),
  };
}

export async function trackVisitorEvent({ headers, socketAddress, pathname, eventType }) {
  const metricKey = EVENT_TYPE_TO_BUCKET[String(eventType || "").trim()];
  if (!metricKey) {
    throw new HttpError(400, "Eveniment analytics invalid.");
  }

  const nowIso = new Date().toISOString();
  const dateKey = getDateKey(nowIso);
  const state = await readSiteState();
  const visitorId = getVisitorId(headers, socketAddress);
  const visitor = normalizeVisitor(state.visitors[visitorId], nowIso);

  visitor.lastSeenAt = nowIso;
  visitor.lastPath = sanitizePathname(pathname);

  state.visitors[visitorId] = visitor;
  state.updatedAt = nowIso;

  if (!visitor.preferences.analytics) {
    await writeSiteState(state);
    return { tracked: false, analyticsEnabled: false };
  }

  visitor.eventCounts[metricKey] += 1;
  bumpDayMetric(state, dateKey, metricKey);
  await writeSiteState(state);

  return { tracked: true, analyticsEnabled: true };
}

export async function getAnalyticsSummary() {
  const state = await readSiteState();
  const visitorEntries = Object.entries(state.visitors)
    .map(([visitorId, visitor]) => ({
      visitorId,
      ...normalizeVisitor(visitor),
    }))
    .sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt));

  const totals = visitorEntries.reduce(
    (summary, visitor) => {
      summary.uniqueVisitors += 1;
      summary.totalEntries += visitor.visitCount;
      summary.analyticsEntries += visitor.analyticsVisitCount;
      summary.whatsappRequests += visitor.eventCounts.whatsappRequests;
      summary.socialClicks += visitor.eventCounts.socialClicks;
      summary.policyOpens += visitor.eventCounts.policyOpens;
      summary.analyticsEnabledVisitors += visitor.preferences.analytics ? 1 : 0;
      summary.essentialOnlyVisitors += visitor.preferences.analytics ? 0 : 1;
      summary.preferenceSaves += visitor.preferences.savedAt ? 1 : 0;
      return summary;
    },
    {
      uniqueVisitors: 0,
      totalEntries: 0,
      analyticsEntries: 0,
      whatsappRequests: 0,
      socialClicks: 0,
      policyOpens: 0,
      analyticsEnabledVisitors: 0,
      essentialOnlyVisitors: 0,
      preferenceSaves: 0,
    },
  );

  const recentDays = Object.entries(state.dailyStats)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-14)
    .map(([date, value]) => ({
      date,
      ...normalizeDayBucket(value),
    }));

  const recentVisitors = visitorEntries.slice(0, 8).map((visitor) => ({
    id: visitor.visitorId.slice(0, 8),
    firstSeenAt: visitor.firstSeenAt,
    lastSeenAt: visitor.lastSeenAt,
    visitCount: visitor.visitCount,
    analyticsEnabled: !!visitor.preferences.analytics,
    whatsappRequests: visitor.eventCounts.whatsappRequests,
    socialClicks: visitor.eventCounts.socialClicks,
  }));

  return {
    storageMode: getSiteStorageMode(),
    policyVersion: SITE_POLICY_VERSION,
    totals,
    recentDays,
    recentVisitors,
  };
}
