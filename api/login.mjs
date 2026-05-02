import { loginOwner } from "../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, readRequestJson, requestHeadersFromRequest } from "./_utils.mjs";

export async function POST(request) {
  try {
    const payload = await readRequestJson(request);
    const result = await loginOwner({
      headers: requestHeadersFromRequest(request),
      username: payload?.username,
      password: payload?.password,
    });

    return jsonResponse(result.payload, 200, {
      "Set-Cookie": result.setCookie,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
