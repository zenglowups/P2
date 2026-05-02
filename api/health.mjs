import { jsonResponse, handleApiError } from "./_utils.mjs";

export async function GET() {
  try {
    return jsonResponse({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
