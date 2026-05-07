import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      guestName,
      guestPhone,
      accommodationId,
      guestCount,
      adultCount,
      childCount,
      checkIn,
      checkOut,
      accommodationName,
      contactConsentAccepted,
      contactConsentAcceptedAt,
      contactConsentPolicyVersion,
    } = body ?? {};

    if (!guestName || !guestPhone || !accommodationId || !checkIn || !checkOut) {
      return Response.json(
        { error: "Date lipsa." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!contactConsentAccepted) {
      return Response.json(
        { error: "Consimtamantul pentru prelucrarea datelor este obligatoriu." },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedAdultCount = Number(adultCount ?? 0);
    const normalizedChildCount = Number(childCount ?? 0);

    if (
      !Number.isFinite(normalizedAdultCount) ||
      !Number.isFinite(normalizedChildCount) ||
      normalizedAdultCount < 0 ||
      normalizedChildCount < 0 ||
      (normalizedAdultCount + normalizedChildCount) <= 0
    ) {
      return Response.json(
        { error: "Numarul de oaspeti este invalid." },
        { status: 400, headers: corsHeaders }
      );
    }

    const whatsappNumber = Deno.env.get("WHATSAPP_NUMBER")?.replace(/\D+/g, "");
    const normalizedPolicyVersion = String(contactConsentPolicyVersion || "").trim() || "2026-05-07-privacy-consent";
    const parsedConsentAcceptedAt = new Date(String(contactConsentAcceptedAt || "").trim() || Date.now());
    const consentAcceptedAtIso = Number.isNaN(parsedConsentAcceptedAt.getTime())
      ? new Date().toISOString()
      : parsedConsentAcceptedAt.toISOString();

    if (!whatsappNumber) {
      return Response.json(
        { error: "Numar WhatsApp lipsa." },
        { status: 500, headers: corsHeaders }
      );
    }

    const text = [
      "Buna!",
      "Am o cerere noua pentru AFRODITI Studios Grigoriu Luxury Apartments.",
      "",
      `Nume client: ${guestName}`,
      `Telefon client: ${guestPhone}`,
      `Cazare dorita: ${accommodationName || accommodationId}`,
      `Numar oaspeti: ${guestCount}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      "",
      "Perioada dorita se verifica inainte de confirmare.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { error } = await admin.from("booking_requests").insert({
      guest_name: guestName,
      guest_phone: guestPhone,
      accommodation_id: accommodationId,
      guest_count: guestCount || "",
      adult_count: normalizedAdultCount,
      child_count: normalizedChildCount,
      check_in: checkIn,
      check_out: checkOut,
      whatsapp_url: whatsappUrl,
      consent_accepted: true,
      consent_accepted_at: consentAcceptedAtIso,
      consent_policy_version: normalizedPolicyVersion,
    });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      { whatsappUrl },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: String(error?.message || error) },
      { status: 500, headers: corsHeaders }
    );
  }
});
