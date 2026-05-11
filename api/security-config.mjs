import { getPublicBookingSecurityConfig } from "../lib/booking-security.mjs";
import { handleApiError, jsonResponse } from "./_utils.mjs";

export async function GET() {
  try {
    return jsonResponse(getPublicBookingSecurityConfig());
  } catch (error) {
    return handleApiError(error);
  }
}
