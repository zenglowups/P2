import { getBootstrapPayload } from "../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, requestHeadersFromRequest } from "./_utils.mjs";

export async function GET(request) {
  try {
    return jsonResponse(await getBootstrapPayload(requestHeadersFromRequest(request)));
  } catch (error) {
    return handleApiError(error);
  }
}
