import { HttpError } from "../lib/owner-backend.mjs";

export function jsonResponse(payload, statusCode = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

export async function readRequestJson(request) {
  const rawText = await request.text();
  if (!rawText.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new HttpError(400, "Payload JSON invalid.");
  }
}

export function requestHeadersFromRequest(request) {
  return {
    cookie: request.headers.get("cookie") || "",
    "cf-connecting-ip": request.headers.get("cf-connecting-ip") || "",
    host: request.headers.get("host") || "",
    origin: request.headers.get("origin") || "",
    "user-agent": request.headers.get("user-agent") || "",
    "x-real-ip": request.headers.get("x-real-ip") || "",
    "x-vercel-forwarded-for": request.headers.get("x-vercel-forwarded-for") || "",
    "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
    "x-forwarded-proto": request.headers.get("x-forwarded-proto") || "",
  };
}

export function handleApiError(error) {
  const statusCode = Number(error?.statusCode || 500);
  const message = error instanceof Error ? error.message : "Eroare interna de server.";
  return jsonResponse({ message }, statusCode);
}
