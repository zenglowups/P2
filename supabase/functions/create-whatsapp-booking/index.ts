const DEFAULT_ALLOWED_ORIGINS = new Set([
  "https://www.afroditistudiosgrigoriu.com",
  "https://afroditistudiosgrigoriu.com",
]);

function getAllowedOrigins() {
  const configured = (Deno.env.get("BOOKING_ALLOWED_ORIGINS") || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.has(origin) ? origin : "https://www.afroditistudiosgrigoriu.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function getHeader(req: Request, name: string) {
  return req.headers.get(name) || req.headers.get(name.toLowerCase()) || "";
}

function extractIp(req: Request) {
  return (
    getHeader(req, "cf-connecting-ip") ||
    getHeader(req, "x-real-ip") ||
    getHeader(req, "x-forwarded-for").split(",")[0]?.trim() ||
    "unknown"
  );
}

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function logDeprecatedHit(req: Request) {
  const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const secret = Deno.env.get("SECURITY_EVENT_HASH_SECRET") || serviceRoleKey || "edge-security-event-secret";

  if (!supabaseUrl || !serviceRoleKey) {
    return;
  }

  const ipHash = await sha256Hex(`${secret}:${extractIp(req).toLowerCase()}`);
  const userAgentHash = await sha256Hex(`${secret}:${getHeader(req, "user-agent").toLowerCase()}`);

  await fetch(`${supabaseUrl}/rest/v1/security_events`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      event_type: "direct_insert_attempt",
      form_id: "booking_request",
      ip_hash: ipHash,
      user_agent_hash: userAgentHash,
      metadata: {
        source: "deprecated_create_whatsapp_booking_function",
      },
    }),
  }).catch(() => null);
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json({ message: "Mesajul a fost primit." }, { status: 200, headers: corsHeaders });
  }

  await logDeprecatedHit(req);

  return Response.json(
    { message: "Mesajul a fost primit." },
    { status: 200, headers: corsHeaders },
  );
});
