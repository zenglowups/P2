const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT_DIR = __dirname;
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8787);
const ownerBackendPromise = import(pathToFileURL(path.join(ROOT_DIR, "lib", "owner-backend.mjs")).href);
const siteBackendPromise = import(pathToFileURL(path.join(ROOT_DIR, "lib", "site-backend.mjs")).href);
const bookingSecurityPromise = import(pathToFileURL(path.join(ROOT_DIR, "lib", "booking-security.mjs")).href);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const BLOCKED_STATIC_DIRECTORIES = new Set(["api", "data", "lib", "node_modules"]);
const BLOCKED_STATIC_FILES = new Set([
  "local-server.cjs",
  "server.js",
  "package.json",
  "package-lock.json",
  "start-server.bat",
  "DEPLOY.md",
  "vercel.json",
]);

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(message);
}

function redirect(response, location) {
  response.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store",
  });
  response.end();
}

async function readJsonBody(request, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > maxBytes) {
        reject(new Error("Cererea este prea mare."));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Payload JSON invalid."));
      }
    });

    request.on("error", reject);
  });
}

function resolveStaticPath(urlPathname) {
  const safePath = decodeURIComponent(urlPathname.split("?")[0]);
  const relativePath = safePath === "/" ? "index.html" : safePath.replace(/^\/+/, "");
  const absolutePath = path.resolve(ROOT_DIR, relativePath);
  const relativeFromRoot = path.relative(ROOT_DIR, absolutePath);

  if (relativeFromRoot.startsWith("..") || path.isAbsolute(relativeFromRoot)) {
    return null;
  }

  const pathSegments = relativeFromRoot.split(path.sep).filter(Boolean);
  if (!pathSegments.length) {
    return null;
  }

  if (pathSegments.some((segment) => segment.startsWith("."))) {
    return null;
  }

  if (BLOCKED_STATIC_DIRECTORIES.has(pathSegments[0])) {
    return null;
  }

  const basename = path.basename(relativeFromRoot);
  if (BLOCKED_STATIC_FILES.has(basename)) {
    return null;
  }

  if (/\.(mjs|cjs|md|bat)$/i.test(relativeFromRoot)) {
    return null;
  }

  return absolutePath;
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || `${HOST}:${PORT}`}`);
  if (url.pathname === "/owner" || url.pathname === "/owner/") {
    redirect(response, "/owner-login.html");
    return;
  }

  const filePath = resolveStaticPath(url.pathname);
  if (!filePath) {
    sendText(response, 404, "Not found");
    return;
  }

  try {
    const stats = await fsp.stat(filePath);
    if (!stats.isFile()) {
      sendText(response, 404, "Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": extension === ".html" ? "no-store" : "public, max-age=3600",
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  } catch {
    sendText(response, 404, "Not found");
  }
}

async function handleApi(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || `${HOST}:${PORT}`}`);
  const ownerBackend = await ownerBackendPromise;
  const siteBackend = await siteBackendPromise;
  const bookingSecurity = await bookingSecurityPromise;

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/bootstrap") {
    sendJson(response, 200, await ownerBackend.getBootstrapPayload(request.headers));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/visitor/bootstrap") {
    sendJson(
      response,
      200,
      await siteBackend.getVisitorBootstrap({
        headers: request.headers,
        socketAddress: request.socket?.remoteAddress,
        pathname: url.searchParams.get("path") || "/",
      }),
    );
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/security-config") {
    sendJson(response, 200, bookingSecurity.getPublicBookingSecurityConfig());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/booking-request") {
    const payload = await readJsonBody(request, 16 * 1024);
    const result = await bookingSecurity.handlePublicBookingRequest({
      payload,
      headers: request.headers,
      socketAddress: request.socket?.remoteAddress,
    });

    sendJson(response, result.statusCode, result.payload);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/visitor/preferences") {
    const payload = await readJsonBody(request);
    sendJson(
      response,
      200,
      await siteBackend.saveVisitorPreferences({
        headers: request.headers,
        socketAddress: request.socket?.remoteAddress,
        pathname: payload?.path,
        analyticsEnabled: !!payload?.analyticsEnabled,
        source: payload?.source,
      }),
    );
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/analytics/event") {
    const payload = await readJsonBody(request);
    sendJson(
      response,
      200,
      await siteBackend.trackVisitorEvent({
        headers: request.headers,
        socketAddress: request.socket?.remoteAddress,
        pathname: payload?.path,
        eventType: payload?.eventType,
      }),
    );
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/analytics/summary") {
    const bootstrap = await ownerBackend.getBootstrapPayload(request.headers);
    if (!bootstrap?.authenticated) {
      sendJson(response, 401, { message: "Trebuie sa fii autentificat pentru analytics." });
      return;
    }

    sendJson(response, 200, await siteBackend.getAnalyticsSummary());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const payload = await readJsonBody(request);
    const result = await ownerBackend.loginOwner({
      headers: request.headers,
      username: payload?.username,
      password: payload?.password,
    });

    sendJson(response, 200, result.payload, {
      "Set-Cookie": result.setCookie,
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/logout") {
    const result = await ownerBackend.logoutOwner({
      headers: request.headers,
    });

    sendJson(response, 200, result.payload, {
      "Set-Cookie": result.setCookie,
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/calendar/toggle") {
    const payload = await readJsonBody(request);
    const result = await ownerBackend.toggleOwnerCalendar({
      headers: request.headers,
      accommodationId: payload?.accommodationId,
      date: payload?.date,
      mode: payload?.mode,
    });

    sendJson(response, 200, result.payload);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/account/update") {
    const payload = await readJsonBody(request);
    const result = await ownerBackend.updateOwnerCredentials({
      headers: request.headers,
      currentPassword: payload?.currentPassword,
      nextUsername: payload?.nextUsername,
      nextPassword: payload?.nextPassword,
    });

    sendJson(response, 200, result.payload, {
      "Set-Cookie": result.setCookie,
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/contact-update") {
    const payload = await readJsonBody(request);
    const result = await ownerBackend.updatePublicContactSettings({
      headers: request.headers,
      whatsappNumber: payload?.whatsappNumber,
    });

    sendJson(response, 200, result.payload);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/pricing-update") {
    const payload = await readJsonBody(request);
    const result = await ownerBackend.updatePublicPricingSettings({
      headers: request.headers,
      ranges: payload?.ranges,
    });

    sendJson(response, 200, result.payload);
    return;
  }

  sendJson(response, 404, { message: "Endpoint inexistent." });
}

const server = http.createServer(async (request, response) => {
  try {
    if (String(request.url || "").startsWith("/api/")) {
      await handleApi(request, response);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      sendText(response, 405, "Method not allowed");
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    const statusCode = Number(error?.statusCode || 500);
    const message = error instanceof Error ? error.message : "Eroare interna de server.";
    sendJson(response, statusCode, { message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Afroditi Studio server ruleaza la http://127.0.0.1:${PORT}`);
  console.log(`Owner access: http://127.0.0.1:${PORT}/owner`);
});
