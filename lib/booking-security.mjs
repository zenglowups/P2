import crypto from "crypto";

import { HttpError, sha256Hex } from "./owner-backend.mjs";

const PROPERTY_NAME = "AFRODITI Studios Grigoriu Luxury Apartments";
const PROPERTY_LOCATION = "Paralia Katerinis, Grecia";
const FORM_ID = "booking_request";
const POLICY_VERSION = "2026-05-07-privacy-consent";
const MINIMUM_BOOKING_NIGHTS = 4;
const MAX_BODY_BYTES = 16 * 1024;
const TOO_FAST_MS = 2500;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const NEUTRAL_MESSAGE = "Mesajul a fost primit.";

const ACCOMMODATIONS = new Map([
  ["studio-double", "Apartament studio cu 1 pat dublu"],
  ["studio-deluxe", "Studio Deluxe"],
]);

const DEFAULT_BLOCKED_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "20minutemail.com",
  "anonaddy.com",
  "discard.email",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "moakt.com",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const SUSPICIOUS_USER_AGENT_PATTERN =
  /\b(curl|wget|python-requests|scrapy|httpclient|libwww|headlesschrome|phantomjs|go-http-client|java\/|nikto|sqlmap)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const REPEATED_CONTENT_PATTERN = /(.)\1{7,}/;

const dryRunEvents = [];

function nowIso() {
  return new Date().toISOString();
}

function getEnv(name) {
  return String(process.env[name] || "").trim();
}

function isDryRun() {
  return ["1", "true", "yes"].includes(getEnv("BOOKING_SECURITY_DRY_RUN").toLowerCase());
}

function getAllowedOrigins() {
  const configured = getEnv("BOOKING_ALLOWED_ORIGINS")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return new Set([
    "https://www.afroditistudiosgrigoriu.com",
    "https://afroditistudiosgrigoriu.com",
    "http://127.0.0.1:8787",
    "http://localhost:8787",
    ...configured,
  ]);
}

function getHeaderValue(headers, key) {
  if (!headers) {
    return "";
  }

  if (headers instanceof Headers || typeof headers.get === "function") {
    return String(headers.get(key) || headers.get(key.toLowerCase()) || "");
  }

  const value = headers[key] ?? headers[key.toLowerCase()];
  return Array.isArray(value) ? value.join(",") : String(value || "");
}

function extractClientIp(headers, socketAddress = "") {
  const candidate =
    getHeaderValue(headers, "cf-connecting-ip") ||
    getHeaderValue(headers, "x-real-ip") ||
    getHeaderValue(headers, "x-vercel-forwarded-for") ||
    getHeaderValue(headers, "x-forwarded-for").split(",")[0] ||
    socketAddress;

  return String(candidate || "unknown").replace(/^::ffff:/, "").trim() || "unknown";
}

function getHashSecret() {
  return (
    getEnv("SECURITY_EVENT_HASH_SECRET") ||
    getEnv("OWNER_SESSION_SECRET") ||
    getEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    "local-security-event-secret"
  );
}

function hashValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return "";
  }
  return crypto.createHmac("sha256", getHashSecret()).update(normalized).digest("hex");
}

function normalizeText(value, maxLength) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizePhone(value) {
  return String(value ?? "").replace(/[^\d+]/g, "").slice(0, 32);
}

function normalizeEmail(value) {
  const email = String(value ?? "").trim().toLowerCase().slice(0, 160);
  return email || "";
}

function parseInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDateOnly(value) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return null;
  }
  const parsed = new Date(`${text}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function countUrls(...values) {
  return values.reduce((total, value) => total + (String(value || "").match(URL_PATTERN) || []).length, 0);
}

function looksRepetitive(value) {
  const text = String(value || "").replace(/\s+/g, "");
  if (text.length < 12) {
    return false;
  }

  const uniqueChars = new Set(text.toLowerCase()).size;
  return REPEATED_CONTENT_PATTERN.test(text) || uniqueChars <= 3;
}

function getBlockedEmailDomains() {
  const blocked = new Set(DEFAULT_BLOCKED_EMAIL_DOMAINS);
  getEnv("BLOCKED_EMAIL_DOMAINS")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean)
    .forEach((domain) => blocked.add(domain));
  return blocked;
}

function getEmailDomain(email) {
  return String(email || "").split("@").pop()?.toLowerCase() || "";
}

function genericValidationError() {
  return new HttpError(400, "Verifica datele introduse si incearca din nou.");
}

function getTurnstileMode() {
  const mode = getEnv("BOOKING_CAPTCHA_MODE").toLowerCase();
  if (["off", "disabled", "false"].includes(mode)) {
    return "off";
  }
  if (mode === "adaptive") {
    return "adaptive";
  }
  return "always";
}

function shouldRequireCaptcha(suspicionScore = 0) {
  const hasSecret = !!getEnv("TURNSTILE_SECRET_KEY");
  const hasSiteKey = !!getEnv("TURNSTILE_SITE_KEY");
  if (!hasSecret || !hasSiteKey) {
    return false;
  }

  const mode = getTurnstileMode();
  if (mode === "off") {
    return false;
  }
  if (mode === "adaptive") {
    return suspicionScore > 0;
  }
  return true;
}

function buildWhatsappUrl(payload) {
  const whatsappNumber = (getEnv("WHATSAPP_NUMBER") || "40742721408").replace(/\D+/g, "");
  if (!whatsappNumber) {
    throw new HttpError(500, "Configuratia pentru WhatsApp lipseste.");
  }

  const lines = [
    "Buna!",
    `Am o cerere noua pentru ${PROPERTY_NAME}.`,
    "",
    `Nume client: ${payload.guestName}`,
    `Telefon client: ${payload.guestPhone}`,
    payload.guestEmail ? `Email client: ${payload.guestEmail}` : "",
    `Cazare dorita: ${payload.accommodationName}`,
    `Numar oaspeti: ${payload.guestCount}`,
    `Check-in: ${payload.checkIn}`,
    `Check-out: ${payload.checkOut}`,
    `Durata: ${payload.nights} nopti`,
    `Locatie: ${PROPERTY_LOCATION}`,
    "",
    "Perioada dorita se verifica inainte de confirmare.",
  ].filter(Boolean);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function parseSupabaseCount(response) {
  const contentRange = response.headers.get("content-range") || "";
  const total = Number.parseInt(contentRange.split("/").pop() || "", 10);
  return Number.isFinite(total) ? total : 0;
}

function getSupabaseConfig() {
  const url = getEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    if (isDryRun()) {
      return null;
    }
    throw new HttpError(503, "Serviciul de rezervari nu este disponibil momentan.");
  }

  return { url, serviceRoleKey };
}

async function supabaseRest(pathname, { method = "GET", body, prefer = "" } = {}) {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${pathname}`, {
    method,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Supabase request failed:", text || response.status);
    throw new HttpError(502, "Serviciul de rezervari nu este disponibil momentan.");
  }

  return response;
}

async function logSecurityEvent({ eventType, formId = FORM_ID, ipHash, emailHash = "", userAgentHash = "", metadata = {} }) {
  const payload = {
    event_type: eventType,
    form_id: formId,
    ip_hash: ipHash || "",
    email_hash: emailHash || "",
    user_agent_hash: userAgentHash || "",
    metadata,
  };

  if (isDryRun()) {
    dryRunEvents.push({ ...payload, created_at: nowIso() });
    return;
  }

  try {
    await supabaseRest("security_events", {
      method: "POST",
      body: payload,
      prefer: "return=minimal",
    });
  } catch (error) {
    console.error("security event logging failed", error);
  }
}

async function countEvents({ sinceIso, ipHash = "", emailHash = "", eventTypes = [] }) {
  if (isDryRun()) {
    return dryRunEvents.filter((event) => {
      if (event.form_id !== FORM_ID || event.created_at < sinceIso) {
        return false;
      }
      if (ipHash && event.ip_hash !== ipHash) {
        return false;
      }
      if (emailHash && event.email_hash !== emailHash) {
        return false;
      }
      if (eventTypes.length && !eventTypes.includes(event.event_type)) {
        return false;
      }
      return true;
    }).length;
  }

  const filters = new URLSearchParams({
    select: "id",
    form_id: `eq.${FORM_ID}`,
    created_at: `gte.${sinceIso}`,
  });
  if (ipHash) {
    filters.set("ip_hash", `eq.${ipHash}`);
  }
  if (emailHash) {
    filters.set("email_hash", `eq.${emailHash}`);
  }
  if (eventTypes.length) {
    filters.set("event_type", `in.(${eventTypes.join(",")})`);
  }

  const response = await supabaseRest(`security_events?${filters.toString()}`, {
    prefer: "count=exact",
  });

  return response ? parseSupabaseCount(response) : 0;
}

async function verifyTurnstile(token, ipAddress) {
  const secret = getEnv("TURNSTILE_SECRET_KEY");
  if (!secret) {
    return true;
  }
  if (!token || token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ipAddress === "unknown" ? undefined : ipAddress,
        idempotency_key: crypto.randomUUID(),
      }),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    return !!result?.success;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function validateBookingPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw genericValidationError();
  }

  const honeypotValue = normalizeText(payload.website ?? payload.company_url ?? payload.fax, 200);
  const guestName = normalizeText(payload.guestName, 80);
  const guestPhone = normalizePhone(payload.guestPhone);
  const guestEmail = normalizeEmail(payload.guestEmail);
  const accommodationId = normalizeText(payload.accommodationId, 40);
  const accommodationName = ACCOMMODATIONS.get(accommodationId);
  const adultCount = parseInteger(payload.adultCount, 0);
  const childCount = parseInteger(payload.childCount, 0);
  const checkInDate = parseDateOnly(payload.checkIn);
  const checkOutDate = parseDateOnly(payload.checkOut);
  const formRenderedAt = Number(payload.formRenderedAt || 0);
  const submittedAt = Number(payload.submittedAt || Date.now());
  const submitElapsedMs = Number(payload.submitElapsedMs || (formRenderedAt ? submittedAt - formRenderedAt : 0));
  const contactConsentAccepted = payload.contactConsentAccepted === true || payload.contactConsentAccepted === "true";
  const contactConsentAcceptedAt = new Date(String(payload.contactConsentAcceptedAt || "").trim() || Date.now());
  const contactConsentAcceptedAtIso = Number.isNaN(contactConsentAcceptedAt.getTime())
    ? nowIso()
    : contactConsentAcceptedAt.toISOString();
  const turnstileToken = String(payload.turnstileToken || payload["cf-turnstile-response"] || "").trim();

  if (honeypotValue) {
    return { honeypotValue };
  }

  if (guestName.length < 2 || guestName.length > 80 || looksRepetitive(guestName)) {
    throw genericValidationError();
  }
  if (guestPhone.replace(/\D/g, "").length < 7 || guestPhone.length > 32 || looksRepetitive(guestPhone)) {
    throw genericValidationError();
  }
  if (guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    throw genericValidationError();
  }
  if (!accommodationName) {
    throw genericValidationError();
  }
  if (!Number.isInteger(adultCount) || !Number.isInteger(childCount) || adultCount < 1 || adultCount > 4 || childCount < 0 || childCount > 4) {
    throw genericValidationError();
  }
  if (!checkInDate || !checkOutDate) {
    throw genericValidationError();
  }

  const nights = daysBetween(checkInDate, checkOutDate);
  if (nights < MINIMUM_BOOKING_NIGHTS || nights > 60) {
    throw genericValidationError();
  }
  if (!contactConsentAccepted) {
    throw new HttpError(400, "Acordul pentru contact este obligatoriu.");
  }
  if (countUrls(guestName, guestPhone, guestEmail) > 0) {
    const error = new HttpError(400, "Verifica datele introduse si incearca din nou.");
    error.securityEventType = "invalid_payload";
    throw error;
  }

  const emailDomain = getEmailDomain(guestEmail);
  if (emailDomain && getBlockedEmailDomains().has(emailDomain)) {
    const error = new HttpError(400, "Foloseste o adresa de email reala pentru rezervare.");
    error.securityEventType = "blocked_email_domain";
    throw error;
  }

  const guestCount = `${adultCount} ${adultCount === 1 ? "adult" : "adulti"}${childCount ? ` + ${childCount} ${childCount === 1 ? "copil" : "copii"}` : ""}`;

  return {
    guestName,
    guestPhone,
    guestEmail,
    accommodationId,
    accommodationName,
    adultCount,
    childCount,
    guestCount,
    checkIn: String(payload.checkIn),
    checkOut: String(payload.checkOut),
    nights,
    contactConsentAcceptedAtIso,
    contactConsentPolicyVersion: normalizeText(payload.contactConsentPolicyVersion, 60) || POLICY_VERSION,
    submitElapsedMs,
    turnstileToken,
  };
}

function neutralSuccess(metadata = {}) {
  return {
    statusCode: 200,
    payload: {
      ok: true,
      message: NEUTRAL_MESSAGE,
      ...metadata,
    },
  };
}

async function enforceRateLimits({ ipHash, emailHash, userAgentHash }) {
  const now = Date.now();
  const bookingEvents = [];
  const minuteCount = await countEvents({
    sinceIso: new Date(now - 60_000).toISOString(),
    ipHash,
    eventTypes: bookingEvents,
  });
  const hourIpCount = await countEvents({
    sinceIso: new Date(now - 60 * 60_000).toISOString(),
    ipHash,
    eventTypes: bookingEvents,
  });
  const dayIpCount = await countEvents({
    sinceIso: new Date(now - 24 * 60 * 60_000).toISOString(),
    ipHash,
    eventTypes: bookingEvents,
  });
  const hourEmailCount = emailHash
    ? await countEvents({
        sinceIso: new Date(now - 60 * 60_000).toISOString(),
        emailHash,
        eventTypes: bookingEvents,
      })
    : 0;

  const exceeded =
    minuteCount >= 3 ||
    hourIpCount >= 10 ||
    dayIpCount >= Number.parseInt(getEnv("BOOKING_DAILY_IP_LIMIT") || "50", 10) ||
    hourEmailCount >= 3;

  if (exceeded) {
    await logSecurityEvent({
      eventType: "rate_limited",
      ipHash,
      emailHash,
      userAgentHash,
      metadata: { minuteCount, hourIpCount, dayIpCount, hourEmailCount },
    });
  }

  return !exceeded;
}

async function insertBooking(payload, { ipHash, emailHash, phoneHash, userAgentHash, securityFlags, spamScore }) {
  const whatsappUrl = buildWhatsappUrl(payload);
  const row = {
    guest_name: payload.guestName,
    guest_phone: payload.guestPhone,
    guest_email: payload.guestEmail || null,
    accommodation_id: payload.accommodationId,
    guest_count: payload.guestCount,
    adult_count: payload.adultCount,
    child_count: payload.childCount,
    check_in: payload.checkIn,
    check_out: payload.checkOut,
    whatsapp_url: whatsappUrl,
    consent_accepted: true,
    consent_accepted_at: payload.contactConsentAcceptedAtIso,
    consent_policy_version: payload.contactConsentPolicyVersion,
    status: "pending",
    ip_hash: ipHash,
    email_hash: emailHash || null,
    phone_hash: phoneHash || null,
    user_agent_hash: userAgentHash || null,
    spam_score: spamScore,
    security_flags: securityFlags,
    request_source: "website_booking_form",
  };

  if (!isDryRun()) {
    await supabaseRest("booking_requests", {
      method: "POST",
      body: row,
      prefer: "return=minimal",
    });
  }

  return whatsappUrl;
}

export async function readLimitedJsonRequest(request) {
  const rawText = await request.text();
  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
    throw new HttpError(413, "Payload prea mare.");
  }
  if (!rawText.trim()) {
    throw genericValidationError();
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw genericValidationError();
  }
}

export function getPublicBookingSecurityConfig() {
  const siteKey = getEnv("TURNSTILE_SITE_KEY");
  const captchaEnabled = !!siteKey && !!getEnv("TURNSTILE_SECRET_KEY") && getTurnstileMode() !== "off";

  return {
    formId: FORM_ID,
    captchaEnabled,
    captchaProvider: captchaEnabled ? "turnstile" : "",
    captchaSiteKey: captchaEnabled ? siteKey : "",
    captchaMode: captchaEnabled ? getTurnstileMode() : "off",
    minimumSubmitDelayMs: TOO_FAST_MS,
  };
}

export async function handlePublicBookingRequest({ payload, headers, socketAddress = "" }) {
  const origin = getHeaderValue(headers, "origin");
  if (origin && !getAllowedOrigins().has(origin)) {
    throw new HttpError(403, "Origine nepermisa.");
  }

  const ipAddress = extractClientIp(headers, socketAddress);
  const userAgent = normalizeText(getHeaderValue(headers, "user-agent"), 300);
  const ipHash = hashValue(ipAddress);
  const userAgentHash = hashValue(userAgent);
  let emailHash = "";

  try {
    const bookingPayload = validateBookingPayload(payload);

    if (bookingPayload.honeypotValue) {
      await logSecurityEvent({
        eventType: "honeypot_triggered",
        ipHash,
        userAgentHash,
        metadata: { field: "website" },
      });
      return neutralSuccess();
    }

    emailHash = hashValue(bookingPayload.guestEmail);
    const phoneHash = hashValue(bookingPayload.guestPhone);
    const securityFlags = [];
    let spamScore = 0;

    if (!userAgent || SUSPICIOUS_USER_AGENT_PATTERN.test(userAgent)) {
      await logSecurityEvent({
        eventType: "suspicious_user_agent",
        ipHash,
        emailHash,
        userAgentHash,
        metadata: { missing: !userAgent },
      });
      return neutralSuccess();
    }

    if (!bookingPayload.submitElapsedMs || bookingPayload.submitElapsedMs < TOO_FAST_MS) {
      securityFlags.push("too_fast_submit");
      spamScore += 50;
      await logSecurityEvent({
        eventType: "too_fast_submit",
        ipHash,
        emailHash,
        userAgentHash,
        metadata: { submitElapsedMs: bookingPayload.submitElapsedMs || 0 },
      });
      return neutralSuccess();
    }

    if (shouldRequireCaptcha(spamScore)) {
      const captchaOk = await verifyTurnstile(bookingPayload.turnstileToken, ipAddress);
      if (!captchaOk) {
        await logSecurityEvent({
          eventType: "captcha_failed",
          ipHash,
          emailHash,
          userAgentHash,
          metadata: { provider: "turnstile" },
        });
        return neutralSuccess();
      }
    }

    const allowedByRateLimit = await enforceRateLimits({ ipHash, emailHash, userAgentHash });
    if (!allowedByRateLimit) {
      return neutralSuccess();
    }

    const whatsappUrl = await insertBooking(bookingPayload, {
      ipHash,
      emailHash,
      phoneHash,
      userAgentHash,
      securityFlags,
      spamScore,
    });

    await logSecurityEvent({
      eventType: "booking_received",
      ipHash,
      emailHash,
      userAgentHash,
      metadata: {
        accommodationId: bookingPayload.accommodationId,
        nights: bookingPayload.nights,
        hasEmail: !!bookingPayload.guestEmail,
      },
    });

    return {
      statusCode: 200,
      payload: {
        ok: true,
        message: "Cererea a fost validata.",
        whatsappUrl,
      },
    };
  } catch (error) {
    const eventType = error?.securityEventType || "invalid_payload";
    await logSecurityEvent({
      eventType,
      ipHash,
      emailHash,
      userAgentHash,
      metadata: { statusCode: Number(error?.statusCode || 400) },
    });
    throw error;
  }
}

export async function logDeprecatedSupabaseFunctionHit({ headers, socketAddress = "" }) {
  const ipAddress = extractClientIp(headers, socketAddress);
  const userAgent = normalizeText(getHeaderValue(headers, "user-agent"), 300);
  await logSecurityEvent({
    eventType: "direct_insert_attempt",
    ipHash: hashValue(ipAddress),
    userAgentHash: hashValue(userAgent),
    metadata: { source: "deprecated_create_whatsapp_booking_function" },
  });
}
