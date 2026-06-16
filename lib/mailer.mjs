// Trimitere automata de emailuri pentru cererile de rezervare.
//
// Foloseste API-ul HTTP Resend (https://resend.com) prin fetch, fara dependinte noi.
// Daca RESEND_API_KEY nu este configurat, modulul nu trimite nimic si nu blocheaza
// niciodata rezervarea - astfel site-ul functioneaza si inainte de a finaliza setarea.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const PROPERTY_NAME = "AFRODITI Studios Grigoriu Luxury Apartments";
const PROPERTY_SHORT_NAME = "AFRODITI Studios Grigoriu";
const PROPERTY_LOCATION = "Paralia Katerinis, Grecia";
const WEBSITE_URL = "https://www.afroditistudiosgrigoriu.com";

const ROMANIAN_MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

function getEnv(name) {
  return String(process.env[name] || "").trim();
}

function getMailConfig() {
  const apiKey = getEnv("RESEND_API_KEY");
  if (!apiKey) {
    return null;
  }

  const fromAddress = getEnv("MAIL_FROM") || `${PROPERTY_SHORT_NAME} <contact@afroditistudiosgrigoriu.com>`;
  const replyTo = getEnv("MAIL_REPLY_TO") || "contact@afroditistudiosgrigoriu.com";
  const ownerRecipient = getEnv("OWNER_NOTIFICATION_EMAIL") || "contact@afroditistudiosgrigoriu.com";
  const contactPhone = getEnv("CONTACT_PHONE") || "+40 742 721 408";

  return { apiKey, fromAddress, replyTo, ownerRecipient, contactPhone };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatRomanianDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || "").trim());
  if (!match) {
    return String(isoDate || "");
  }
  const [, year, month, day] = match;
  const monthName = ROMANIAN_MONTHS[Number.parseInt(month, 10) - 1] || month;
  return `${Number.parseInt(day, 10)} ${monthName} ${year}`;
}

async function sendEmail(config, { to, subject, html, text, replyTo }) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromAddress,
      to: [to],
      subject,
      html,
      text,
      reply_to: replyTo || config.replyTo,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.json().catch(() => ({}));
}

function emailLayout({ heading, introHtml, detailRows, footerHtml }) {
  const rows = detailRows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:6px 0;color:#8a8175;font-size:13px;letter-spacing:.04em;text-transform:uppercase;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#1f2a37;font-size:15px;font-weight:600;text-align:right;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ro">
  <body style="margin:0;background:#f4f1ea;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#1f2a37;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#11203a;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
        <div style="color:#d8b46a;font-size:13px;letter-spacing:.32em;text-transform:uppercase;">${escapeHtml(PROPERTY_LOCATION)}</div>
        <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:8px;letter-spacing:.02em;">${escapeHtml(PROPERTY_SHORT_NAME)}</div>
      </div>
      <div style="background:#ffffff;border:1px solid #ece6da;border-top:none;border-radius:0 0 16px 16px;padding:32px;">
        <h1 style="margin:0 0 16px;font-size:20px;color:#11203a;">${escapeHtml(heading)}</h1>
        ${introHtml}
        <table style="width:100%;border-collapse:collapse;margin:24px 0;border-top:1px solid #ece6da;">
          ${rows}
        </table>
        ${footerHtml}
      </div>
      <p style="text-align:center;color:#9a9384;font-size:12px;margin:20px 0 0;">
        ${escapeHtml(PROPERTY_NAME)} · ${escapeHtml(PROPERTY_LOCATION)}<br>
        <a href="${WEBSITE_URL}" style="color:#9a9384;">www.afroditistudiosgrigoriu.com</a>
      </p>
    </div>
  </body>
</html>`;
}

function buildClientEmail(booking, config) {
  const checkIn = formatRomanianDate(booking.checkIn);
  const checkOut = formatRomanianDate(booking.checkOut);
  const subject = `Am primit solicitarea ta de rezervare · ${PROPERTY_SHORT_NAME}`;

  const detailRows = [
    { label: "Cazare", value: booking.accommodationName },
    { label: "Check-in", value: checkIn },
    { label: "Check-out", value: checkOut },
    { label: "Nopti", value: `${booking.nights}` },
    { label: "Oaspeti", value: booking.guestCount },
  ];

  const introHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">Buna ${escapeHtml(booking.guestName)},</p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#445;">
      Iti multumim ca ai ales <strong>${escapeHtml(PROPERTY_SHORT_NAME)}</strong>. Am primit solicitarea ta de rezervare
      si o vom verifica in cel mai scurt timp. Mai jos gasesti detaliile transmise:
    </p>`;

  const footerHtml = `
    <div style="background:#faf7f0;border:1px solid #efe7d6;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#5a513f;">
        <strong>Pasul urmator:</strong> echipa noastra te va contacta in curand pentru a confirma disponibilitatea
        si detaliile finale. Confirmarea telefonica este obligatorie pentru finalizarea rezervarii.
      </p>
    </div>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#445;">
      Daca ai intrebari, ne poti scrie raspunzand direct la acest email sau ne poti suna la
      <strong>${escapeHtml(config.contactPhone)}</strong>.
    </p>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">Cu drag,<br><strong>Echipa ${escapeHtml(PROPERTY_SHORT_NAME)}</strong></p>`;

  const html = emailLayout({ heading: "Solicitarea ta a fost inregistrata", introHtml, detailRows, footerHtml });

  const text = [
    `Buna ${booking.guestName},`,
    "",
    `Iti multumim ca ai ales ${PROPERTY_SHORT_NAME}. Am primit solicitarea ta de rezervare si o vom verifica in cel mai scurt timp.`,
    "",
    "Detaliile transmise:",
    `- Cazare: ${booking.accommodationName}`,
    `- Check-in: ${checkIn}`,
    `- Check-out: ${checkOut}`,
    `- Nopti: ${booking.nights}`,
    `- Oaspeti: ${booking.guestCount}`,
    "",
    "Pasul urmator: te vom contacta in curand pentru a confirma disponibilitatea. Confirmarea telefonica este obligatorie pentru finalizarea rezervarii.",
    "",
    `Pentru intrebari ne poti suna la ${config.contactPhone} sau poti raspunde la acest email.`,
    "",
    `Cu drag,`,
    `Echipa ${PROPERTY_SHORT_NAME}`,
    PROPERTY_LOCATION,
    WEBSITE_URL,
  ].join("\n");

  return { subject, html, text };
}

function buildOwnerEmail(booking) {
  const checkIn = formatRomanianDate(booking.checkIn);
  const checkOut = formatRomanianDate(booking.checkOut);
  const subject = `Cerere noua de rezervare · ${booking.guestName} · ${booking.checkIn} → ${booking.checkOut}`;

  const childAgeLabel =
    booking.childAge !== null && booking.childAge !== undefined
      ? `${booking.childAge} ${booking.childAge === 1 ? "an" : "ani"}`
      : "-";

  const detailRows = [
    { label: "Nume client", value: booking.guestName },
    { label: "Telefon", value: booking.guestPhone },
    { label: "Email", value: booking.guestEmail },
    { label: "Cazare", value: booking.accommodationName },
    { label: "Oaspeti", value: booking.guestCount },
    { label: "Varsta copil", value: childAgeLabel },
    { label: "Check-in", value: checkIn },
    { label: "Check-out", value: checkOut },
    { label: "Nopti", value: `${booking.nights}` },
  ];

  const introHtml = `
    <p style="margin:0;font-size:15px;line-height:1.6;color:#445;">
      Ai primit o cerere noua de rezervare prin formularul de pe site. Poti raspunde direct la acest email
      pentru a-i scrie clientului.
    </p>`;

  const footerHtml = `
    <a href="tel:${escapeHtml(booking.guestPhone)}"
       style="display:inline-block;background:#11203a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;">
      Suna clientul: ${escapeHtml(booking.guestPhone)}
    </a>`;

  const html = emailLayout({ heading: "Cerere noua de rezervare", introHtml, detailRows, footerHtml });

  const text = [
    "Ai primit o cerere noua de rezervare prin formularul de pe site.",
    "",
    `- Nume client: ${booking.guestName}`,
    `- Telefon: ${booking.guestPhone}`,
    `- Email: ${booking.guestEmail}`,
    `- Cazare: ${booking.accommodationName}`,
    `- Oaspeti: ${booking.guestCount}`,
    `- Varsta copil: ${childAgeLabel}`,
    `- Check-in: ${checkIn}`,
    `- Check-out: ${checkOut}`,
    `- Nopti: ${booking.nights}`,
  ].join("\n");

  return { subject, html, text };
}

// Trimite emailul de notificare catre proprietar si confirmarea catre client.
// Nu arunca niciodata erori in apelant: rezervarea ramane valida chiar daca emailul esueaza.
export async function sendBookingNotifications(booking) {
  const config = getMailConfig();
  if (!config) {
    return { skipped: true, reason: "missing_resend_api_key" };
  }

  const ownerEmail = buildOwnerEmail(booking);
  const clientEmail = buildClientEmail(booking, config);

  const results = await Promise.allSettled([
    sendEmail(config, {
      to: config.ownerRecipient,
      subject: ownerEmail.subject,
      html: ownerEmail.html,
      text: ownerEmail.text,
      replyTo: booking.guestEmail || config.replyTo,
    }),
    sendEmail(config, {
      to: booking.guestEmail,
      subject: clientEmail.subject,
      html: clientEmail.html,
      text: clientEmail.text,
      replyTo: config.replyTo,
    }),
  ]);

  const [ownerResult, clientResult] = results;
  if (ownerResult.status === "rejected") {
    console.error("owner notification email failed", ownerResult.reason);
  }
  if (clientResult.status === "rejected") {
    console.error("client confirmation email failed", clientResult.reason);
  }

  return {
    skipped: false,
    ownerSent: ownerResult.status === "fulfilled",
    clientSent: clientResult.status === "fulfilled",
  };
}
