import { updateOwnerCredentials } from "../../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, readRequestJson, requestHeadersFromRequest } from "../_utils.mjs";

export async function POST(request) {
  try {
    const payload = await readRequestJson(request);
    const result = await updateOwnerCredentials({
      headers: requestHeadersFromRequest(request),
      currentPassword: payload?.currentPassword,
      nextUsername: payload?.nextUsername,
      nextPassword: payload?.nextPassword,
    });

    return jsonResponse(result.payload, 200, {
      "Set-Cookie": result.setCookie,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
