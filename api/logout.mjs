import { logoutOwner } from "../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, requestHeadersFromRequest } from "./_utils.mjs";

export async function POST(request) {
  try {
    const result = await logoutOwner({
      headers: requestHeadersFromRequest(request),
    });

    return jsonResponse(result.payload, 200, {
      "Set-Cookie": result.setCookie,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
