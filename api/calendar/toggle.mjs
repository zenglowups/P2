import { toggleOwnerCalendar } from "../../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, readRequestJson, requestHeadersFromRequest } from "../_utils.mjs";

export async function POST(request) {
  try {
    const payload = await readRequestJson(request);
    const result = await toggleOwnerCalendar({
      headers: requestHeadersFromRequest(request),
      accommodationId: payload?.accommodationId,
      date: payload?.date,
      mode: payload?.mode,
    });

    return jsonResponse(result.payload);
  } catch (error) {
    return handleApiError(error);
  }
}
