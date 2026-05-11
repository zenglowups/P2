import {
  handlePublicBookingRequest,
  readLimitedJsonRequest,
} from "../lib/booking-security.mjs";
import { handleApiError, jsonResponse, requestHeadersFromRequest } from "./_utils.mjs";

export async function POST(request) {
  try {
    const payload = await readLimitedJsonRequest(request);
    const result = await handlePublicBookingRequest({
      payload,
      headers: requestHeadersFromRequest(request),
    });

    return jsonResponse(result.payload, result.statusCode);
  } catch (error) {
    return handleApiError(error);
  }
}
