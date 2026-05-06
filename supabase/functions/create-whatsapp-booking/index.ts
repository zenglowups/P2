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
    } = body ?? {};

    if (!guestName || !guestPhone || !accommodationId || !checkIn || !checkOut) {
      return Response.json(
        { error: "Date lipsa." },
        { status: 400, headers: corsHeaders }
      );
    }

    const whatsappNumber = Deno.env.get("WHATSAPP_NUMBER")?.replace(/\D+/g, "");

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
      adult_count: Number(adultCount ?? 0),
      child_count: Number(childCount ?? 0),
      check_in: checkIn,
      check_out: checkOut,
      whatsapp_url: whatsappUrl,
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