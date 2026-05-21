import { updatePublicPricingSettings } from "../lib/owner-backend.mjs";
import { handleApiError, jsonResponse, readRequestJson, requestHeadersFromRequest } from "./_utils.mjs";

export async function POST(request) {
  try {
    const payload = await readRequestJson(request);
    const result = await updatePublicPricingSettings({
      headers: requestHeadersFromRequest(request),
      ranges: payload?.ranges,
    });

    return jsonResponse(result.payload);
  } catch (error) {
    return handleApiError(error);
  }
}
