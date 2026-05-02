const PROPERTY_NAME = "AFRODITI Studios Grigoriu Luxury Apartments";
const PROPERTY_LOCATION = "Paralia Katerinis, Grecia";
const DEFAULT_OWNER_USERNAME = "afroditi";
const LOCAL_OWNER_SERVER_URL = "http://127.0.0.1:8787/owner";
const DESKTOP_SPIRAL = window.matchMedia("(min-width: 1081px)");
const IS_OWNER_PAGE = document.body?.dataset.page === "owner";

document.documentElement.classList.add("js-ready");

const CONTACT_SETTINGS = {
  whatsappNumber: "",
  calendarMonth: "",
};

const DEFAULT_ACCOMMODATIONS = [
  {
    id: "studio-double",
    name: "Apartament studio cu 1 pat dublu",
    capacity: "2 adulti",
    summary: "Studio luminos cu pat dublu, baie privata, balcon si acces rapid spre plaja.",
    highlights: [
      "pat dublu si decor modern",
      "baie privata si aer conditionat",
      "balcon pentru cafeaua de dimineata",
    ],
  },
  {
    id: "studio-deluxe",
    name: "Studio Deluxe",
    capacity: "2 adulti + 1 copil",
    summary: "Unitate spatioasa cu pat dublu, canapea, chicineta si atmosfera premium.",
    highlights: [
      "chicineta utilata",
      "spatiu bun pentru familie mica",
      "look calm, nou si foarte curat",
    ],
  },
];

// Editezi doar aici intervalele blocate afisate in calendarul static.
// Exemplu:
// {
//   accommodationId: "studio-double",
//   guestName: "Booking",
//   checkIn: "2026-06-12",
//   checkOut: "2026-06-18",
//   source: "Booking.com",
// }
const SOURCE_RESERVATIONS = [];

const GALLERY_FILES = [
  "693837072.jpg",
  "694257536.jpg",
  "694258214.jpg",
  "694258265.jpg",
  "694796978.jpg",
  "694797110.jpg",
  "694797195.jpg",
  "694797315.jpg",
  "694797365.jpg",
  "694797456.jpg",
  "694797681.jpg",
  "696111317.jpg",
  "696118350.jpg",
  "696118666.jpg",
  "696119957.jpg",
  "696120235.jpg",
  "696793852.jpg",
  "696793921.jpg",
  "696793943.jpg",
  "696794119.jpg",
  "696795514.jpg",
  "698803324.jpg",
  "698803810.jpg",
  "698809319.jpg",
  "699517290.jpg",
  "701075281.jpg",
  "701075456.jpg",
  "718798500.jpg",
  "718807158.jpg",
  "821243420.jpg",
  "846839553.jpg",
  "846843696.jpg",
  "847487317.jpg",
];

const GALLERY_COPY = [
  {
    title: "Exterior luminos",
    note: "Fatada curata si intrare luminoasa, exact genul de prim cadru care inspira incredere.",
  },
  {
    title: "Camera pregatita pentru sejur",
    note: "Cadru aerisit, tonuri calme si senzatia de unitate noua, foarte bine intretinuta.",
  },
  {
    title: "Balcon pentru dimineti lente",
    note: "Zona buna pentru cafea, aer si ritmul acela relaxat de vacanta in Grecia.",
  },
  {
    title: "Detalii curate",
    note: "Textile, finisaje si lumina care sustin exact ce se repeta si in review-uri.",
  },
  {
    title: "Baie moderna",
    note: "Un punct vizual important, mai ales pentru partea de curatenie si confort.",
  },
  {
    title: "Terasa si spatiu exterior",
    note: "Ajuta mult senzatia de vacanta lejera, fara aglomeratie si fara grabire.",
  },
  {
    title: "Studio complet",
    note: "Pat, chicineta si zona functionala intr-o compozitie clara si usor de inteles.",
  },
  {
    title: "Cadru real al proprietatii",
    note: "Galeria ramane separata de review-uri, ca sa fie mai simplu de parcurs.",
  },
];

const AMENITIES = [
  ["Apartamente", "Unitati noi, bine luminate, potrivite pentru sejururi relaxate aproape de plaja."],
  ["Parcare gratuita", "Un plus important pentru oaspetii care vin cu masina."],
  ["WiFi gratuit inclus", "Conectivitate buna pentru sejururi lejere sau lucru remote."],
  ["Transfer de la si/sau la aeroport", "Optional, usor de mentionat si in comunicarea directa pe WhatsApp."],
  ["Gratar", "Facilitate notata in materialele Booking si utila pentru pozitionarea relaxata."],
  ["Camere pentru nefumatori", "Un standard cautat pentru familii, cupluri si oaspeti premium."],
  ["Balcon", "Cadru important pentru cafeaua de dimineata si aerul de vacanta."],
  ["Vedere la mare", "Foarte utila pentru copy-ul comercial si decizia de booking."],
  ["Aer conditionat", "Esential pentru sezonul cald si asteptarile unei proprietati premium."],
  ["Terasa", "Unul dintre punctele vizuale cele mai puternice din galeria reala."],
].map(([name, description]) => ({ name, description }));

const IMPORTANT_INFO = [
  ["Locatie foarte buna", "Capturile Booking indica proximitate buna fata de plaja Kolimvisis si pozitionare buna pentru cupluri."],
  ["Unitati bine dotate", "Balcon, terasa, baie privata, chicineta si aer conditionat apar constant in materialele primite."],
  ["Zona buna pentru explorare", "Muntele Olimp este mentionat la 27 km, Dion la 30 km, iar aeroportul la aproximativ 97 km."],
  ["Sejururi linistite", "Directia generala a proprietatii este relaxata, curata si foarte potrivita pentru vacante fara graba."],
].map(([title, text]) => ({ title, text }));

const LEGAL_INFO = [
  ["Disponibilitatea se actualizeaza manual", "Poti porni de la intervalele din app.js, iar apoi ajusta rapid zilele direct din panoul proprietar."],
  ["Calendar public pentru oaspeti", "Vizitatorii pot consulta disponibilitatea, iar panoul cu login ramane separat pentru proprietar."],
  ["Booking si WhatsApp trebuie sa spuna acelasi lucru", "Calendarul public trebuie sa ramana sincronizat cu ce comunici public."],
  ["Completare obligatorie inainte de publicare", "Adauga numarul real de WhatsApp direct in CONTACT_SETTINGS si pastreaza calendarul public sincronizat."],
].map(([title, text]) => ({ title, text }));

const SCORE_BARS = [
  ["Personal", 10],
  ["Facilitati", 9.8],
  ["Curatenie", 10],
  ["Confort", 9.7],
  ["Raport calitate-pret", 10],
  ["Locatie", 10],
].map(([label, value]) => ({ label, value }));

const EXTRACTED_REVIEWS = [
  {
    name: "Adrian",
    country: "Romania",
    date: "16 septembrie 2025",
    score: "10",
    title: "Un sejur perfect.",
    room: "Apartament studio cu 1 pat dublu",
    stay: "7 nopti | cuplu",
    quote: "Totul a fost perfect, de la cazare pana la gazda, totul!",
    tags: ["gazda", "curatenie", "experienta"],
  },
  {
    name: "Adela",
    country: "Romania",
    date: "1 august 2025",
    score: "10",
    title: "Excelent",
    room: "Apartament studio cu 1 pat dublu",
    stay: "5 nopti | cuplu",
    quote: "Totul. Camera curata, dotata cu cele necesare. Foarte aproape de plaja. Situat intr-o zona linistita. Aproape si de strada principala, totul a fost minunat.",
    tags: ["aproape de plaja", "zona linistita", "camera curata"],
  },
  {
    name: "Eva",
    country: "Ungaria",
    date: "31 august 2025",
    score: "10",
    title: "Our stay was wonderful.",
    room: "Apartament studio cu 1 pat dublu",
    stay: "7 nopti | familie",
    quote: "Everything was excellent. The apartment was comfortable, the atmosphere was wonderful, and we felt very welcome. The host was incredibly helpful throughout our stay, and his kindness truly made a difference. If we get the chance, we would love to come back again.",
    tags: ["comfort", "atmosfera", "host helpful"],
  },
  {
    name: "Polina",
    country: "Bulgaria",
    date: "27 iulie 2025",
    score: "10",
    title: "Exceptional",
    room: "Apartament studio cu 1 pat dublu",
    stay: "1 noapte | cuplu",
    quote: "The apartment is brand new and spotless clean, has all the necessities, and the host is very nice and welcoming.",
    tags: ["brand new", "spotless clean", "welcoming host"],
  },
  {
    name: "Mila",
    country: "Ungaria",
    date: "25 iunie 2025",
    score: "10",
    title: "Exceptional",
    room: "Apartament studio cu 1 pat dublu",
    stay: "7 nopti | cuplu",
    quote: "Everything was beautiful, the hotel, the atmosphere, the people. Special thanks to Grigoriu who listened to all our requests and was the most helpful person during the whole holiday. The accommodation is perfect, the terrace is cozy, and in the evenings it is best to sit outside and look at the stars or even the sea that is one street away.",
    tags: ["terasa", "atmosfera", "aproape de mare"],
  },
  {
    name: "Aleksandar",
    country: "Macedonia de Nord",
    date: "16 iunie 2025",
    score: "10",
    title: "Exceptional",
    room: "Studio Deluxe",
    stay: "1 noapte | familie",
    quote: "We were the first guests there and Grigoriu was the best host I ever had. Everything was perfect and we enjoyed our stay there. Close to the beach but quiet place, everything was new, so I do not need to explain more.",
    tags: ["close to beach", "quiet place", "everything new"],
  },
  {
    name: "Mike",
    country: "Bulgaria",
    date: "14 septembrie 2025",
    score: "8.0",
    title: "Nice and comfort place",
    room: "Studio Deluxe",
    stay: "8 nopti | familie",
    quote: "Very nice place close to the beach, with a friendly host, very clean room and a wide bathroom.",
    secondary: "The room is a little tight for a family with a kid, but would be perfect for a couple.",
    tags: ["close to beach", "friendly host", "clean room"],
  },
  {
    name: "Trajstarevic",
    country: "Germania",
    date: "1 august 2025",
    score: "10",
    title: "Exceptional",
    room: "Studio Deluxe",
    stay: "4 nopti | familie",
    quote: "Sve je perfektno cisto i osoba koja to izdaje je veoma ljubazan i korektan... prezadovoljni.",
    tags: ["foarte curat", "gazda amabila", "familie"],
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const LOCAL_OWNER_HOSTS = new Set(["127.0.0.1", "localhost"]);
const HAS_HTTP_PROTOCOL = ["http:", "https:"].includes(window.location.protocol);
const IS_LOCAL_OWNER_HOST = LOCAL_OWNER_HOSTS.has(window.location.hostname);
const CAN_USE_OWNER_API = HAS_HTTP_PROTOCOL;

const header = $(".site-header");
const navToggle = $(".nav-toggle");
const body = document.body;
const revealItems = $$(".reveal");
const spiralShell = $(".review-spiral-shell");
const spiralStage = $("[data-review-spiral-stage]");
const galleryViewport = $("#gallery-viewport");
const galleryTrack = $("[data-gallery-track]");
const galleryCount = $("[data-gallery-count]");
const galleryPrev = $("#gallery-prev");
const galleryNext = $("#gallery-next");
const roomTypesGrid = $("[data-room-types]");
const amenitiesGrid = $("[data-amenities-grid]");
const importantCards = $("[data-important-cards]");
const legalList = $("[data-legal-list]");
const scoreBars = $("[data-score-bars]");
const reviewList = $("[data-review-list]");
const bookingForm = $("#booking-form");
const bookingFormNote = $("#booking-form-note");
const bookingSubmit = $("#booking-submit");
const availabilityOverview = $("[data-availability-overview]");
const availabilityMonthLabel = $("#availability-month-label");
const availabilityMonthPrev = $("#availability-month-prev");
const availabilityMonthNext = $("#availability-month-next");
const ownerAccessToggles = $$("[data-owner-access-toggle]");
const ownerModal = $("#owner-modal");
const ownerAccessArea = $("#owner-access-area");
const ownerModalClose = $("#owner-modal-close");
const ownerSetupCard = $("#owner-setup-card");
const ownerLoginForm = $("#owner-login-form");
const ownerLoginHint = $("#owner-login-hint");
const ownerLoginStatus = $("#owner-login-status");
const ownerPanel = $("#owner-panel");
const ownerLogout = $("#owner-logout");
const ownerAccountForm = $("#owner-account-form");
const ownerAccountStatus = $("#owner-account-status");
const ownerAccommodationSelect = $("[data-owner-accommodation-select]");
const ownerMonthLabel = $("#owner-month-label");
const ownerMonthPrev = $("#owner-month-prev");
const ownerMonthNext = $("#owner-month-next");
const ownerCalendar = $("[data-owner-calendar]");
const ownerStatus = $("#owner-status");

const galleryState = {
  index: 0,
  scrollTicking: false,
};

const appState = createAppState();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizePhone(value) {
  return String(value ?? "").replace(/\D+/g, "");
}

function parseDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toInputDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMonthValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDate(dateString) {
  const date = parseDate(dateString);
  return date
    ? new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "-";
}

function formatMonthLabel(monthValue) {
  const [year, month] = String(monthValue).split("-").map(Number);
  if (!year || !month) {
    return "";
  }
  return new Intl.DateTimeFormat("ro-RO", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

function addMonthsToMonthValue(monthValue, delta) {
  const [year, month] = String(monthValue).split("-").map(Number);
  if (!year || !month) {
    return toMonthValue(new Date());
  }
  return toMonthValue(new Date(year, month - 1 + delta, 1));
}

function getNights(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) {
    return 0;
  }
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function formatNights(nights) {
  return `${nights} ${nights === 1 ? "noapte" : "nopti"}`;
}

function isValidRange(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  return !!(start && end && start.getTime() < end.getTime());
}

function deriveHighlights(accommodation) {
  return [
    accommodation.capacity ? `capacitate: ${accommodation.capacity}` : "",
    accommodation.summary || "",
    "calendar public clar pentru disponibilitate",
  ]
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeAccommodation(raw, index = 0) {
  const name = String(raw?.name ?? "").trim();
  if (!name) {
    return null;
  }

  const capacity = String(raw?.capacity ?? "").trim();
  const summary = String(raw?.summary ?? "").trim();
  const highlights = Array.isArray(raw?.highlights)
    ? raw.highlights.map((item) => String(item).trim()).filter(Boolean)
    : [];

  return {
    id: String(raw?.id ?? `acc-${index + 1}`),
    name,
    capacity: capacity || "2 adulti",
    summary: summary || "Spatiu pregatit pentru sejururi relaxate aproape de plaja.",
    highlights: highlights.length ? highlights.slice(0, 4) : deriveHighlights({ capacity, summary }),
  };
}

function normalizeReservation(raw) {
  const accommodationId = String(raw?.accommodationId ?? "").trim();
  const checkIn = String(raw?.checkIn ?? "").trim();
  const checkOut = String(raw?.checkOut ?? "").trim();
  const guestName = String(raw?.guestName ?? "").trim() || "Rezervat";

  if (!accommodationId || !isValidRange(checkIn, checkOut)) {
    return null;
  }

  return {
    accommodationId,
    source: String(raw?.source ?? "Rezervat").trim() || "Rezervat",
    guestName,
    checkIn,
    checkOut,
  };
}

function uniqueSortedDays(values) {
  return Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => String(value ?? "").trim())
        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)),
    ),
  ).sort();
}

function normalizeOverrideBucket(raw) {
  return {
    occupied: uniqueSortedDays(raw?.occupied),
    free: uniqueSortedDays(raw?.free),
  };
}

function createEmptyOverrideState(accommodations) {
  return Object.fromEntries(accommodations.map((item) => [item.id, { occupied: [], free: [] }]));
}

function normalizeOwnerOverrides(raw) {
  const base = createEmptyOverrideState(appState.accommodations);
  if (!raw || typeof raw !== "object") {
    return base;
  }

  Object.entries(raw).forEach(([accommodationId, bucket]) => {
    if (Object.hasOwn(base, accommodationId)) {
      base[accommodationId] = normalizeOverrideBucket(bucket);
    }
  });

  return base;
}

function expandDateRange(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end || start.getTime() >= end.getTime()) {
    return [];
  }

  const days = [];
  const cursor = new Date(start);
  while (cursor.getTime() < end.getTime()) {
    days.push(toInputDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function createAppState() {
  const accommodations = DEFAULT_ACCOMMODATIONS.map((item, index) => normalizeAccommodation(item, index)).filter(Boolean);
  const reservations = SOURCE_RESERVATIONS.map(normalizeReservation).filter(Boolean).sort((a, b) =>
    a.checkIn.localeCompare(b.checkIn),
  );
  const configuredMonth = String(CONTACT_SETTINGS.calendarMonth ?? "").trim();
  const search = new URLSearchParams(window.location.search);

  return {
    settings: {
      whatsappNumber: sanitizePhone(CONTACT_SETTINGS.whatsappNumber),
      calendarMonth: configuredMonth,
    },
    accommodations,
    reservations,
    owner: {
      isAvailable: CAN_USE_OWNER_API,
      isAuthenticated: false,
      panelOpen: IS_OWNER_PAGE || search.get("owner") === "1",
      usernameHint: DEFAULT_OWNER_USERNAME,
      activeAccommodationId: accommodations[0]?.id ?? "",
      activeMonth: /^\d{4}-\d{2}$/.test(configuredMonth) ? configuredMonth : toMonthValue(new Date()),
      activeMode: "occupied",
      overrides: createEmptyOverrideState(accommodations),
    },
    availability: {
      activeMonth: /^\d{4}-\d{2}$/.test(configuredMonth) ? configuredMonth : toMonthValue(new Date()),
    },
  };
}

function getAccommodationById(id) {
  return appState.accommodations.find((item) => item.id === id) ?? null;
}

function getOwnerOverrideBucket(accommodationId) {
  if (!Object.hasOwn(appState.owner.overrides, accommodationId)) {
    appState.owner.overrides[accommodationId] = { occupied: [], free: [] };
  }
  return appState.owner.overrides[accommodationId];
}

function getSourceBusySet(accommodationId) {
  const set = new Set();
  appState.reservations
    .filter((reservation) => reservation.accommodationId === accommodationId)
    .forEach((reservation) => {
      expandDateRange(reservation.checkIn, reservation.checkOut).forEach((day) => set.add(day));
    });
  return set;
}

function getCombinedBusySet(accommodationId) {
  const busy = getSourceBusySet(accommodationId);
  const bucket = getOwnerOverrideBucket(accommodationId);
  bucket.free.forEach((day) => busy.delete(day));
  bucket.occupied.forEach((day) => busy.add(day));
  return busy;
}

function getExplicitOwnerStatus(accommodationId, isoDate) {
  const bucket = getOwnerOverrideBucket(accommodationId);
  if (bucket.occupied.includes(isoDate)) {
    return "occupied";
  }
  if (bucket.free.includes(isoDate)) {
    return "free";
  }
  return null;
}

function getDayStatus(accommodationId, isoDate, combinedSet = null) {
  const busySet = combinedSet ?? getCombinedBusySet(accommodationId);
  return {
    isBooked: busySet.has(isoDate),
    explicitStatus: getExplicitOwnerStatus(accommodationId, isoDate),
  };
}

function getConflicts(accommodationId, checkIn, checkOut) {
  const busySet = getCombinedBusySet(accommodationId);
  return expandDateRange(checkIn, checkOut).filter((day) => busySet.has(day));
}

function setStatus(target, message, type = "") {
  const element = typeof target === "string" ? document.getElementById(target) : target;
  if (!element) {
    return;
  }
  element.textContent = message;
  element.classList.remove("is-error", "is-success");
  if (type === "error") {
    element.classList.add("is-error");
  }
  if (type === "success") {
    element.classList.add("is-success");
  }
}

function getAccommodationStatus(accommodation, combinedSet = null) {
  const busySet = combinedSet ?? getCombinedBusySet(accommodation.id);
  const today = toInputDate(new Date());

  if (busySet.has(today)) {
    return {
      label: "Ocupat",
      className: "is-busy",
      helper: "Ziua de azi este marcata ocupata in calendar.",
    };
  }

  const todayDate = parseDate(today);
  let nextBusyDay = "";
  for (let step = 1; step <= 365 && todayDate; step += 1) {
    const probe = new Date(todayDate);
    probe.setDate(probe.getDate() + step);
    const iso = toInputDate(probe);
    if (busySet.has(iso)) {
      nextBusyDay = iso;
      break;
    }
  }

  return nextBusyDay
    ? {
        label: "Disponibil",
        className: "is-free",
        helper: `Urmatoarea zi blocata este pe ${formatDate(nextBusyDay)}.`,
      }
    : {
        label: "Disponibil",
        className: "is-free",
        helper: "Nu exista zile marcate ocupate in urmatoarele luni.",
      };
}

function getCalendarMonthValue() {
  const active = String(appState.availability?.activeMonth ?? "").trim();
  if (/^\d{4}-\d{2}$/.test(active)) {
    return active;
  }

  const configured = String(appState.settings.calendarMonth ?? "").trim();
  return /^\d{4}-\d{2}$/.test(configured) ? configured : toMonthValue(new Date());
}

function getBusyDayCountForMonth(combinedSet, monthValue) {
  const prefix = `${monthValue}-`;
  let count = 0;
  combinedSet.forEach((day) => {
    if (day.startsWith(prefix)) {
      count += 1;
    }
  });
  return count;
}

function amenityIcon(name) {
  const icons = {
    Apartamente: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>',
    "Parcare gratuita": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4h5.5c3.2 0 5.5 2 5.5 5 0 3.1-2.3 5.1-5.5 5.1H10V20H7V4zm5.2 7.4c1.5 0 2.5-.9 2.5-2.4s-1-2.3-2.5-2.3H10v4.7h2.2z"/></svg>',
    "WiFi gratuit inclus": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-4-3a5.7 5.7 0 0 1 8 0l1.4-1.4a7.7 7.7 0 0 0-10.8 0Zm-3.2-3.2a10.2 10.2 0 0 1 14.4 0l1.4-1.4a12.2 12.2 0 0 0-17.2 0Z"/></svg>',
    "Transfer de la si/sau la aeroport": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m2 14 20-5-7 7 3 5-3 1-3-4-4 3-1-3 6-4z"/></svg>',
    Gratar: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 3c1 1 .7 2.4 0 3.2-.7.9-1 2.4 0 3.8H4c-1.1-1.7-.9-3.8.3-5.2C5.2 3.7 5.3 3.3 5 3h1Zm5 0c1 1 .7 2.4 0 3.2-.7.9-1 2.4 0 3.8H9c-1.1-1.7-.9-3.8.3-5.2.9-1.1 1-1.5.7-1.8h1Zm5 0c1 1 .7 2.4 0 3.2-.7.9-1 2.4 0 3.8h-2c-1.1-1.7-.9-3.8.3-5.2.9-1.1 1-1.5.7-1.8h1ZM7 13h10a3 3 0 0 1 3 3v1h-2v4h-2v-4H8v4H6v-4H4v-1a3 3 0 0 1 3-3Z"/></svg>',
    "Camere pentru nefumatori": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 10h9v4H6zm10 0h2v4h-2zm3 0h1a2 2 0 0 1 0 4h-1zm-8.6-6.6 1.4-1.4 10.2 10.2-1.4 1.4z"/></svg>',
    Balcon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v9h-2V6H6v7H4V4Zm2 11h12v5h-2v-3H8v3H6v-5Zm2 0v-2h2v2h-2Zm6 0v-2h2v2h-2Z"/></svg>',
    "Vedere la mare": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17c1.2 0 1.8-.7 2.4-1.3.6-.6 1.1-1.2 2.3-1.2s1.7.6 2.3 1.2c.6.6 1.2 1.3 2.4 1.3s1.8-.7 2.4-1.3c.6-.6 1.1-1.2 2.3-1.2s1.7.6 2.3 1.2c.6.6 1.2 1.3 2.4 1.3v2c-1.9 0-2.9-.9-3.7-1.7-.5-.5-.7-.8-1-.8s-.5.3-1 .8c-.8.8-1.8 1.7-3.7 1.7s-2.9-.9-3.7-1.7c-.5-.5-.7-.8-1-.8s-.5.3-1 .8C5.9 20.1 4.9 21 3 21v-2ZM7 8a5 5 0 0 1 10 0H7Z"/></svg>',
    "Aer conditionat": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 7h16v4H4zm2 6h12v2H6zm2 4h8v2H8z"/></svg>',
    Terasa: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v2H4zm2 4h2v11H6zm10 0h2v11h-2zM9 8h6v5H9zm-1 7h8v2H8z"/></svg>',
  };
  return icons[name] || '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>';
}

function buildGallerySlide(file, index) {
  const copy = GALLERY_COPY[index % GALLERY_COPY.length];
  return `
    <article class="gallery-slide" data-gallery-slide data-gallery-index="${index}">
      <figure class="gallery-slide-frame">
        <div class="gallery-slide-media">
          <img src="Images/${escapeHtml(file)}" alt="${escapeHtml(copy.title)}" loading="lazy" decoding="async">
        </div>
        <figcaption class="gallery-slide-copy">
          <span class="gallery-slide-kicker">Cadru ${index + 1}</span>
          <strong>${escapeHtml(copy.title)}</strong>
          <p>${escapeHtml(copy.note)}</p>
        </figcaption>
      </figure>
    </article>
  `;
}

function buildReviewListCard(item) {
  return `
    <article class="review-list-card">
      <div class="review-list-head">
        <div>
          <p class="review-list-name">${escapeHtml(item.name)}</p>
          <span class="review-list-country">${escapeHtml(item.country)} | ${escapeHtml(item.date)}</span>
        </div>
        <span class="review-list-score">${escapeHtml(item.score)}</span>
      </div>

      <div class="review-list-meta">
        <span>${escapeHtml(item.room)}</span>
        <span>${escapeHtml(item.stay)}</span>
      </div>

      <h4>${escapeHtml(item.title)}</h4>
      <p class="review-list-quote">"${escapeHtml(item.quote)}"</p>
      ${item.secondary ? `<p class="review-list-secondary">${escapeHtml(item.secondary)}</p>` : ""}

      <div class="review-list-tags">
        ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderGalleryCarousel() {
  if (!galleryTrack) {
    return;
  }
  galleryTrack.innerHTML = GALLERY_FILES.map((file, index) => buildGallerySlide(file, index)).join("");
  galleryState.index = clamp(galleryState.index, 0, Math.max(GALLERY_FILES.length - 1, 0));
  updateGalleryMeta();
  window.requestAnimationFrame(() => scrollGalleryTo(galleryState.index, "auto"));
}

function renderReviewSpiral() {
  if (!spiralStage) {
    return;
  }

  spiralStage.innerHTML = EXTRACTED_REVIEWS.map(
    (item) => `
      <article class="spiral-card spiral-card--review">
        <div class="review-card-top">
          <div>
            <p class="review-card-name">${escapeHtml(item.name)}</p>
            <span class="review-card-country">${escapeHtml(item.country)} | ${escapeHtml(item.date)}</span>
          </div>
          <span class="review-card-score">${escapeHtml(item.score)}</span>
        </div>
        <div class="review-card-body">
          <div class="review-card-meta">
            <span>${escapeHtml(item.room)}</span>
            <span>${escapeHtml(item.stay)}</span>
          </div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="review-card-quote">"${escapeHtml(item.quote)}"</p>
          ${item.secondary ? `<p class="review-card-secondary">${escapeHtml(item.secondary)}</p>` : ""}
          <div class="review-card-tags">
            ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <p class="review-card-footnote">Extras separat din capturile Booking din folder.</p>
        </div>
      </article>
    `,
  ).join("");
}

function renderAmenities() {
  if (!amenitiesGrid) {
    return;
  }
  amenitiesGrid.innerHTML = AMENITIES.map(
    (item) => `
      <article class="amenity-card">
        <div class="amenity-card-header">
          <span class="amenity-icon">${amenityIcon(item.name)}</span>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
          </div>
        </div>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `,
  ).join("");
}

function renderInfoCards() {
  if (importantCards) {
    importantCards.innerHTML = IMPORTANT_INFO.map(
      (item) => `
        <article class="info-card">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `,
    ).join("");
  }

  if (legalList) {
    legalList.innerHTML = LEGAL_INFO.map(
      (item) => `
        <article class="legal-card">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `,
    ).join("");
  }
}

function renderReviews() {
  if (scoreBars) {
    scoreBars.innerHTML = SCORE_BARS.map(
      (item) => `
        <div class="score-item">
          <div class="score-bar-meta">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${String(item.value).replace(".", ",")} / 10</span>
          </div>
          <div class="score-bar">
            <span style="width:${clamp(item.value / 10, 0, 1) * 100}%"></span>
          </div>
        </div>
      `,
    ).join("");
  }

  if (reviewList) {
    reviewList.innerHTML = EXTRACTED_REVIEWS.map((item) => buildReviewListCard(item)).join("");
  }
}

function renderAccommodationSelects() {
  if (!bookingForm) {
    return;
  }
  const select = bookingForm.querySelector('[data-accommodation-select]');
  if (!select) {
    return;
  }

  const previous = select.value;
  select.innerHTML = appState.accommodations
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");

  select.value = appState.accommodations.some((item) => item.id === previous)
    ? previous
    : appState.accommodations[0]?.id ?? "";
}

function renderOwnerAccommodationSelect() {
  if (!ownerAccommodationSelect) {
    return;
  }

  ownerAccommodationSelect.innerHTML = appState.accommodations
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");

  ownerAccommodationSelect.value = appState.accommodations.some(
    (item) => item.id === appState.owner.activeAccommodationId,
  )
    ? appState.owner.activeAccommodationId
    : appState.accommodations[0]?.id ?? "";
}

function renderRoomTypes() {
  if (!roomTypesGrid) {
    return;
  }

  const monthValue = getCalendarMonthValue();

  roomTypesGrid.innerHTML = appState.accommodations
    .map((accommodation) => {
      const combinedSet = getCombinedBusySet(accommodation.id);
      const status = getAccommodationStatus(accommodation, combinedSet);
      const busyDays = getBusyDayCountForMonth(combinedSet, monthValue);

      return `
        <article class="room-type-card">
          <div class="room-type-top">
            <div>
              <strong>${escapeHtml(accommodation.name)}</strong>
            </div>
            <span class="room-type-status ${status.className}">${status.label}</span>
          </div>
          <p>${escapeHtml(accommodation.summary)}</p>
          <ul>
            <li>${escapeHtml(accommodation.capacity)}</li>
            ${accommodation.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            <li>${busyDays ? `${busyDays} zile ocupate in luna afisata` : "fara zile ocupate in luna afisata"}</li>
          </ul>
          <p>${escapeHtml(status.helper)}</p>
        </article>
      `;
    })
    .join("");
}

function buildStaticCalendarCells(accommodationId, monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const monthIndex = month - 1;
  const monthStart = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const offset = (monthStart.getDay() + 6) % 7;
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayIso = toInputDate(new Date());
  const busySet = getCombinedBusySet(accommodationId);

  let busyDayCount = 0;
  const cells = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"].map(
    (day) => `<div class="calendar-weekday">${day}</div>`,
  );

  for (let index = 0; index < totalCells; index += 1) {
    const date = new Date(year, monthIndex, 1 - offset + index);
    const isoDate = toInputDate(date);
    const outside = date.getMonth() !== monthIndex;
    const isBooked = !outside && busySet.has(isoDate);

    if (isBooked) {
      busyDayCount += 1;
    }

    const classes = ["calendar-day"];
    if (outside) {
      classes.push("is-outside");
    }
    if (isBooked) {
      classes.push("is-booked");
    }
    if (isoDate === todayIso) {
      classes.push("is-today");
    }

    const note = outside ? "" : isBooked ? "Ocupat" : "Liber";
    cells.push(`
      <div class="${classes.join(" ")}">
        <span class="calendar-day-number">${date.getDate()}</span>
        ${note ? `<div class="calendar-day-note">${escapeHtml(note)}</div>` : ""}
      </div>
    `);
  }

  return { cells: cells.join(""), busyDayCount };
}

function renderAvailabilityOverview() {
  if (!availabilityOverview) {
    return;
  }

  const monthValue = getCalendarMonthValue();
  const monthLabel = formatMonthLabel(monthValue);

  availabilityOverview.innerHTML = appState.accommodations
    .map((accommodation) => {
      const status = getAccommodationStatus(accommodation);
      const { cells, busyDayCount } = buildStaticCalendarCells(accommodation.id, monthValue);

      return `
        <article class="availability-sheet panel-surface">
          <div class="availability-sheet-head">
            <div>
              <strong>${escapeHtml(accommodation.name)}</strong>
              <span>${escapeHtml(monthLabel)}</span>
            </div>
            <span class="room-type-status ${status.className}">${status.label}</span>
          </div>
          <div class="calendar-grid availability-sheet-grid">${cells}</div>
          <p class="availability-sheet-note">${busyDayCount} zile ocupate afisate in aceasta luna.</p>
        </article>
      `;
    })
    .join("");
}

function renderAvailabilityMonthNav() {
  if (!availabilityMonthLabel) {
    return;
  }
  availabilityMonthLabel.textContent = formatMonthLabel(getCalendarMonthValue());
}

function buildOwnerCalendarCells(accommodationId, monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const monthIndex = month - 1;
  const monthStart = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const offset = (monthStart.getDay() + 6) % 7;
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayIso = toInputDate(new Date());
  const busySet = getCombinedBusySet(accommodationId);

  const cells = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"].map(
    (day) => `<div class="calendar-weekday">${day}</div>`,
  );

  for (let index = 0; index < totalCells; index += 1) {
    const date = new Date(year, monthIndex, 1 - offset + index);
    const isoDate = toInputDate(date);
    const outside = date.getMonth() !== monthIndex;
    const { isBooked, explicitStatus } = getDayStatus(accommodationId, isoDate, busySet);

    const classes = ["calendar-day", "owner-calendar-day"];
    if (outside) {
      classes.push("is-outside");
    } else {
      classes.push("is-editable");
    }
    if (isBooked) {
      classes.push("is-booked");
    }
    if (explicitStatus === "occupied") {
      classes.push("is-owner-occupied");
    }
    if (explicitStatus === "free") {
      classes.push("is-owner-free");
    }
    if (isoDate === todayIso) {
      classes.push("is-today");
    }

    const note = outside ? "" : isBooked ? "Ocupat" : "Liber";
    cells.push(`
      <button
        class="${classes.join(" ")}"
        type="button"
        ${outside ? "disabled" : `data-owner-day="${escapeHtml(isoDate)}"`}
        aria-label="${escapeHtml(`${formatDate(isoDate)} - ${note || "alta luna"}`)}"
      >
        <span class="calendar-day-number">${date.getDate()}</span>
        ${note ? `<div class="calendar-day-note">${escapeHtml(note)}</div>` : ""}
      </button>
    `);
  }

  return cells.join("");
}

function syncOwnerQueryParam() {
  if (IS_OWNER_PAGE || !window.history?.replaceState) {
    return;
  }

  const url = new URL(window.location.href);
  if (appState.owner.panelOpen) {
    url.searchParams.set("owner", "1");
  } else {
    url.searchParams.delete("owner");
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function getOwnerLoginInput(fieldName) {
  const field = ownerLoginForm?.elements?.namedItem(fieldName);
  return field instanceof HTMLInputElement ? field : null;
}

function getOwnerAccountInput(fieldName) {
  const field = ownerAccountForm?.elements?.namedItem(fieldName);
  return field instanceof HTMLInputElement ? field : null;
}

function syncOwnerLoginForm() {
  const usernameInput = getOwnerLoginInput("ownerUsername");
  if (usernameInput) {
    usernameInput.placeholder = appState.owner.usernameHint || DEFAULT_OWNER_USERNAME;
    if (!usernameInput.value.trim()) {
      usernameInput.value = appState.owner.usernameHint || DEFAULT_OWNER_USERNAME;
    }
  }

  if (ownerLoginHint) {
    ownerLoginHint.textContent = `User pregatit: ${appState.owner.usernameHint || DEFAULT_OWNER_USERNAME}`;
  }
}

function syncOwnerAccountForm() {
  const nextUsernameInput = getOwnerAccountInput("nextOwnerUsername");
  if (nextUsernameInput) {
    nextUsernameInput.placeholder = appState.owner.usernameHint || DEFAULT_OWNER_USERNAME;
    if (!nextUsernameInput.value.trim()) {
      nextUsernameInput.value = appState.owner.usernameHint || DEFAULT_OWNER_USERNAME;
    }
  }
}

function focusOwnerEntry() {
  if (!appState.owner.panelOpen) {
    return;
  }

  window.requestAnimationFrame(() => {
    if (appState.owner.isAuthenticated) {
      ownerAccommodationSelect?.focus();
      return;
    }

    const passwordInput = getOwnerLoginInput("ownerPassword");
    const usernameInput = getOwnerLoginInput("ownerUsername");
    if (passwordInput && usernameInput?.value.trim()) {
      passwordInput.focus();
      return;
    }

    usernameInput?.focus();
  });
}

function setOwnerPanelOpen(isOpen) {
  if (IS_OWNER_PAGE) {
    return;
  }

  appState.owner.panelOpen = !!isOpen;
  syncOwnerQueryParam();
  renderOwnerPanel();

  if (appState.owner.panelOpen) {
    focusOwnerEntry();
  }
}

function renderOwnerAccess() {
  ownerAccessToggles.forEach((toggle) => {
    const accessLabel = appState.owner.panelOpen
      ? "Inchide accesul de proprietar"
      : appState.owner.isAvailable
        ? "Acces proprietar"
        : "Instructiuni acces proprietar";
    toggle.setAttribute("aria-label", accessLabel);
    toggle.setAttribute("title", accessLabel);
  });

  syncOwnerLoginForm();
  syncOwnerAccountForm();

  if (IS_OWNER_PAGE) {
    if (ownerSetupCard) {
      ownerSetupCard.hidden = appState.owner.isAvailable;
    }
    if (ownerLoginForm) {
      ownerLoginForm.hidden = !appState.owner.isAvailable || appState.owner.isAuthenticated;
    }
    if (ownerPanel) {
      ownerPanel.hidden = !appState.owner.isAvailable || !appState.owner.isAuthenticated;
    }
    return;
  }

  if (ownerModal) {
    ownerModal.hidden = !appState.owner.panelOpen;
    document.body.classList.toggle("owner-modal-open", appState.owner.panelOpen);
  }
  if (ownerSetupCard) {
    ownerSetupCard.hidden = appState.owner.isAvailable || !appState.owner.panelOpen;
  }
  if (ownerLoginForm) {
    ownerLoginForm.hidden = !appState.owner.panelOpen || !appState.owner.isAvailable || appState.owner.isAuthenticated;
  }
  if (ownerPanel) {
    ownerPanel.hidden = !appState.owner.panelOpen || !appState.owner.isAvailable || !appState.owner.isAuthenticated;
  }
}

function renderOwnerPanel() {
  renderOwnerAccess();
  if (!ownerPanel || !ownerCalendar || !ownerMonthLabel || !appState.owner.isAuthenticated) {
    return;
  }

  syncOwnerAccountForm();
  renderOwnerAccommodationSelect();
  ownerMonthLabel.textContent = formatMonthLabel(appState.owner.activeMonth);

  $$("[data-owner-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.ownerMode === appState.owner.activeMode);
  });

  ownerCalendar.innerHTML = buildOwnerCalendarCells(appState.owner.activeAccommodationId, appState.owner.activeMonth);
}

function syncBookingSetupState() {
  if (!bookingSubmit || !bookingFormNote) {
    return;
  }

  const hasWhatsAppNumber = !!sanitizePhone(appState.settings.whatsappNumber);
  bookingSubmit.disabled = !hasWhatsAppNumber;
  bookingSubmit.setAttribute("aria-disabled", String(!hasWhatsAppNumber));
  bookingFormNote.textContent = hasWhatsAppNumber
    ? "Calendarul din dreapta este public pentru oaspeti, iar editorul de proprietar se deschide direct in aceeasi pagina."
    : "Pentru a activa cererile pe WhatsApp trebuie adaugat numarul real in CONTACT_SETTINGS din app.js.";
}

function composeWhatsAppMessage(payload, accommodation) {
  const lines = [
    "Buna!",
    `Am o cerere noua pentru ${PROPERTY_NAME}.`,
    "",
    `Nume client: ${payload.guestName}`,
    `Telefon client: ${payload.guestPhone}`,
    `Cazare dorita: ${accommodation.name}`,
    `Numar oaspeti: ${payload.guestCount}`,
    `Check-in: ${formatDate(payload.checkIn)}`,
    `Check-out: ${formatDate(payload.checkOut)}`,
    `Durata: ${formatNights(getNights(payload.checkIn, payload.checkOut))}`,
    `Locatie: ${PROPERTY_LOCATION}`,
    "",
    "Calendarul afisat pe site a fost verificat inainte de trimitere.",
  ];
  return lines.join("\n");
}

function handleBookingSubmit(event) {
  event.preventDefault();
  if (!bookingForm) {
    return;
  }

  const data = new FormData(bookingForm);
  const guestName = String(data.get("guestName") ?? "").trim();
  const guestPhone = String(data.get("guestPhone") ?? "").trim();
  const accommodationId = String(data.get("accommodationId") ?? "").trim();
  const guestCount = String(data.get("guestCount") ?? "").trim();
  const checkIn = String(data.get("checkIn") ?? "").trim();
  const checkOut = String(data.get("checkOut") ?? "").trim();
  const whatsappNumber = sanitizePhone(appState.settings.whatsappNumber);
  const accommodation = getAccommodationById(accommodationId);

  if (!whatsappNumber) {
    setStatus("booking-status", "Adauga numarul de WhatsApp in CONTACT_SETTINGS din app.js.", "error");
    return;
  }
  if (!guestName || !guestPhone || !guestCount) {
    setStatus("booking-status", "Completeaza numele, telefonul si numarul de oaspeti.", "error");
    return;
  }
  if (!accommodation) {
    setStatus("booking-status", "Selecteaza o cazare valida pentru cerere.", "error");
    return;
  }
  if (!isValidRange(checkIn, checkOut)) {
    setStatus("booking-status", "Intervalul ales nu este valid.", "error");
    return;
  }

  const conflicts = getConflicts(accommodationId, checkIn, checkOut);
  if (conflicts.length) {
    setStatus("booking-status", "Intervalul se suprapune cu o perioada deja marcata ocupata in calendar.", "error");
    return;
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    composeWhatsAppMessage({ guestName, guestPhone, guestCount, checkIn, checkOut }, accommodation),
  )}`;
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.href = url;
  }

  setStatus("booking-status", "Am deschis WhatsApp cu cererea completata.", "success");
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(payload?.message || "A aparut o eroare de server.");
  }

  return payload;
}

function getOwnerServerEntryUrl() {
  if (!IS_LOCAL_OWNER_HOST) {
    return "/owner";
  }

  return LOCAL_OWNER_SERVER_URL;
}

function getOwnerApiUnavailableMessage() {
  if (!HAS_HTTP_PROTOCOL) {
    return "Panoul proprietar are nevoie de varianta site-ului care ruleaza cu backend activ.";
  }

  if (IS_LOCAL_OWNER_HOST) {
    return `Panoul proprietar are nevoie de backend. Porneste start-server.bat sau vercel dev, apoi intra pe ${getOwnerServerEntryUrl()}.`;
  }

  return "Panoul proprietar nu este disponibil momentan. Verifica daca backendul site-ului este pornit corect.";
}

async function hydrateOwnerState() {
  if (!CAN_USE_OWNER_API) {
    appState.owner.isAvailable = false;
    renderOwnerAccess();
    return;
  }

  try {
    const payload = await fetchJson("/api/bootstrap");
    appState.owner.isAvailable = !!payload?.ownerEnabled;
    appState.owner.isAuthenticated = !!payload?.authenticated;
    appState.owner.usernameHint = String(payload?.ownerUsername || DEFAULT_OWNER_USERNAME).trim() || DEFAULT_OWNER_USERNAME;
    appState.owner.overrides = normalizeOwnerOverrides(payload?.overrides);
    renderRoomTypes();
    renderAvailabilityOverview();
    renderOwnerPanel();
  } catch {
    appState.owner.isAvailable = false;
  }

  renderOwnerAccess();
  focusOwnerEntry();
}

async function handleOwnerLoginSubmit(event) {
  event.preventDefault();
  if (!ownerLoginForm) {
    return;
  }

  if (!CAN_USE_OWNER_API) {
    setStatus(ownerLoginStatus, getOwnerApiUnavailableMessage(), "error");
    return;
  }

  const data = new FormData(ownerLoginForm);
  const username = String(data.get("ownerUsername") ?? "").trim();
  const password = String(data.get("ownerPassword") ?? "").trim();

  if (!username || !password) {
    setStatus(ownerLoginStatus, "Completeaza userul si parola.", "error");
    return;
  }

  try {
    const payload = await fetchJson("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    appState.owner.isAuthenticated = true;
    appState.owner.usernameHint = String(payload?.ownerUsername || username).trim() || DEFAULT_OWNER_USERNAME;
    appState.owner.overrides = normalizeOwnerOverrides(payload?.overrides);
    ownerLoginForm.reset();
    if (ownerAccountForm) {
      ownerAccountForm.reset();
    }
    setStatus(ownerLoginStatus, "Panoul proprietar este deschis.", "success");
    setStatus(ownerStatus, "", "");
    setStatus(ownerAccountStatus, "", "");
    renderRoomTypes();
    renderAvailabilityOverview();
    renderOwnerPanel();
    focusOwnerEntry();
  } catch (error) {
    setStatus(ownerLoginStatus, error.message || "Date de autentificare invalide.", "error");
  }
}

async function handleOwnerLogout() {
  try {
    await fetchJson("/api/logout", { method: "POST" });
  } catch {
    // daca endpointul raspunde cu eroare, inchidem totusi panoul local
  }

  appState.owner.isAuthenticated = false;
  renderOwnerAccess();
  setStatus(ownerLoginStatus, "", "");
  setStatus(ownerStatus, "", "");
  setStatus(ownerAccountStatus, "", "");
  focusOwnerEntry();
}

function closeOwnerModal() {
  if (IS_OWNER_PAGE) {
    return;
  }
  setOwnerPanelOpen(false);
}

async function handleOwnerCalendarClick(event) {
  const dayButton = event.target.closest("[data-owner-day]");
  if (!dayButton || !appState.owner.isAuthenticated) {
    return;
  }

  const isoDate = String(dayButton.dataset.ownerDay ?? "").trim();
  if (!isoDate) {
    return;
  }

  try {
    const payload = await fetchJson("/api/calendar/toggle", {
      method: "POST",
      body: JSON.stringify({
        accommodationId: appState.owner.activeAccommodationId,
        date: isoDate,
        mode: appState.owner.activeMode,
      }),
    });

    appState.owner.overrides = normalizeOwnerOverrides(payload?.overrides);
    renderRoomTypes();
    renderAvailabilityOverview();
    renderOwnerPanel();
    setStatus(
      ownerStatus,
      `${formatDate(isoDate)} este acum marcata ca ${appState.owner.activeMode === "occupied" ? "ocupata" : "libera"}.`,
      "success",
    );
  } catch (error) {
    setStatus(ownerStatus, error.message || "Nu am putut salva modificarea.", "error");
  }
}

async function handleOwnerAccountSubmit(event) {
  event.preventDefault();
  if (!ownerAccountForm || !appState.owner.isAuthenticated) {
    return;
  }

  const data = new FormData(ownerAccountForm);
  const currentPassword = String(data.get("currentOwnerPassword") ?? "").trim();
  const nextUsername = String(data.get("nextOwnerUsername") ?? "").trim();
  const nextPassword = String(data.get("nextOwnerPassword") ?? "").trim();
  const confirmPassword = String(data.get("confirmOwnerPassword") ?? "").trim();

  if (!currentPassword || !nextUsername || !nextPassword || !confirmPassword) {
    setStatus(ownerAccountStatus, "Completeaza toate campurile pentru actualizarea credentialelor.", "error");
    return;
  }

  if (nextPassword !== confirmPassword) {
    setStatus(ownerAccountStatus, "Confirmarea parolei noi nu se potriveste.", "error");
    return;
  }

  try {
    const payload = await fetchJson("/api/account/update", {
      method: "POST",
      body: JSON.stringify({
        currentPassword,
        nextUsername,
        nextPassword,
      }),
    });

    appState.owner.usernameHint = String(payload?.ownerUsername || nextUsername).trim() || DEFAULT_OWNER_USERNAME;
    appState.owner.isAuthenticated = true;
    ownerAccountForm.reset();
    syncOwnerAccountForm();
    syncOwnerLoginForm();
    setStatus(ownerAccountStatus, "Noile date de login au fost salvate.", "success");
    setStatus(ownerLoginStatus, "Credentialele active au fost actualizate.", "success");
  } catch (error) {
    setStatus(ownerAccountStatus, error.message || "Nu am putut actualiza datele de login.", "error");
  }
}

function closeMenu() {
  if (!header || !navToggle) {
    return;
  }
  header.classList.remove("menu-open");
  body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function updateScrolledHeader() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }
}

function initRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function getGallerySlides() {
  return galleryTrack ? Array.from(galleryTrack.querySelectorAll("[data-gallery-slide]")) : [];
}

function updateGalleryMeta() {
  const slides = getGallerySlides();
  const total = slides.length;
  if (galleryCount) {
    galleryCount.textContent = total ? `${galleryState.index + 1} / ${total} imagini reale` : "0 imagini";
  }
  if (galleryPrev) {
    galleryPrev.disabled = galleryState.index <= 0;
  }
  if (galleryNext) {
    galleryNext.disabled = galleryState.index >= total - 1;
  }
}

function getSlideScrollLeft(slide) {
  if (!galleryTrack || !slide) {
    return 0;
  }
  return slide.offsetLeft - galleryTrack.offsetLeft;
}

function scrollGalleryTo(index, behavior = "smooth") {
  if (!galleryViewport) {
    return;
  }
  const slides = getGallerySlides();
  if (!slides.length) {
    updateGalleryMeta();
    return;
  }

  const safeIndex = clamp(index, 0, slides.length - 1);
  galleryState.index = safeIndex;
  galleryViewport.scrollTo({
    left: getSlideScrollLeft(slides[safeIndex]),
    behavior,
  });
  updateGalleryMeta();
}

function syncGalleryIndexFromScroll() {
  if (!galleryViewport || !galleryTrack) {
    return;
  }
  const slides = getGallerySlides();
  if (!slides.length) {
    return;
  }

  const currentLeft = galleryViewport.scrollLeft;
  let closestIndex = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const distance = Math.abs(getSlideScrollLeft(slide) - currentLeft);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex !== galleryState.index) {
    galleryState.index = closestIndex;
    updateGalleryMeta();
  }
}

function handleGalleryScroll() {
  if (galleryState.scrollTicking) {
    return;
  }
  galleryState.scrollTicking = true;
  window.requestAnimationFrame(() => {
    syncGalleryIndexFromScroll();
    galleryState.scrollTicking = false;
  });
}

function updateSpiralScene() {
  if (!spiralShell || !spiralStage) {
    return;
  }

  const cards = $$(".spiral-card");
  if (!cards.length) {
    return;
  }

  if (!DESKTOP_SPIRAL.matches) {
    cards.forEach((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
    return;
  }

  const span = Math.max(1, spiralShell.offsetHeight - window.innerHeight);
  const rect = spiralShell.getBoundingClientRect();
  const progress = clamp(-rect.top / span, 0, 1);

  cards.forEach((card, index) => {
    const offset = (index / Math.max(cards.length - 1, 1)) * 0.52;
    const local = clamp((progress - offset) / 0.5, 0, 1.12);
    const reveal = Math.min(1, local / 0.18);
    const fade = 1 - Math.max(0, (local - 0.84) / 0.26);
    const visibility = clamp(reveal * fade, 0, 1);
    const angle = index * 1.22 * Math.PI + progress * Math.PI * 2.2;
    const radius = 170 + index * 34 + (1 - Math.min(local, 1)) * 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.28;
    const z = -860 + local * 1560;
    const rotateY = -22 + local * 36 + Math.sin(angle) * 6;
    const rotateZ = Math.cos(angle) * 4;
    const scale = 0.64 + Math.min(local, 1) * 0.42;

    card.style.opacity = visibility.toFixed(3);
    card.style.transform =
      `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) ` +
      `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
  });
}

function initGalleryCarousel() {
  if (!galleryViewport) {
    return;
  }
  galleryViewport.addEventListener("scroll", handleGalleryScroll, { passive: true });
  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => scrollGalleryTo(galleryState.index - 1));
  }
  if (galleryNext) {
    galleryNext.addEventListener("click", () => scrollGalleryTo(galleryState.index + 1));
  }
}

function initEvents() {
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      body.classList.toggle("menu-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  $$(".site-nav a").forEach((link) => link.addEventListener("click", closeMenu));

  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }

  ownerAccessToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      setOwnerPanelOpen(!appState.owner.panelOpen);
    });
  });

  if (ownerModalClose) {
    ownerModalClose.addEventListener("click", closeOwnerModal);
  }

  $$("[data-owner-close]").forEach((element) => {
    element.addEventListener("click", closeOwnerModal);
  });

  if (ownerLoginForm) {
    ownerLoginForm.addEventListener("submit", handleOwnerLoginSubmit);
  }

if (ownerLogout) {
  ownerLogout.addEventListener("click", handleOwnerLogout);
}

if (ownerAccountForm) {
  ownerAccountForm.addEventListener("submit", handleOwnerAccountSubmit);
}

if (ownerAccommodationSelect) {
  ownerAccommodationSelect.addEventListener("change", (event) => {
      appState.owner.activeAccommodationId = String(event.target.value ?? "").trim();
      renderOwnerPanel();
      setStatus(ownerStatus, "", "");
    });
  }

  $$("[data-owner-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.owner.activeMode = button.dataset.ownerMode === "free" ? "free" : "occupied";
      renderOwnerPanel();
    });
  });

  if (ownerMonthPrev) {
    ownerMonthPrev.addEventListener("click", () => {
      appState.owner.activeMonth = addMonthsToMonthValue(appState.owner.activeMonth, -1);
      renderOwnerPanel();
    });
  }

  if (ownerMonthNext) {
    ownerMonthNext.addEventListener("click", () => {
      appState.owner.activeMonth = addMonthsToMonthValue(appState.owner.activeMonth, 1);
      renderOwnerPanel();
    });
  }

  if (availabilityMonthPrev) {
    availabilityMonthPrev.addEventListener("click", () => {
      appState.availability.activeMonth = addMonthsToMonthValue(getCalendarMonthValue(), -1);
      renderAvailabilityMonthNav();
      renderRoomTypes();
      renderAvailabilityOverview();
    });
  }

  if (availabilityMonthNext) {
    availabilityMonthNext.addEventListener("click", () => {
      appState.availability.activeMonth = addMonthsToMonthValue(getCalendarMonthValue(), 1);
      renderAvailabilityMonthNav();
      renderRoomTypes();
      renderAvailabilityOverview();
    });
  }

  if (ownerCalendar) {
    ownerCalendar.addEventListener("click", handleOwnerCalendarClick);
  }

  let ticking = false;
  const syncScene = () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      updateScrolledHeader();
      updateSpiralScene();
      if (galleryViewport) {
        syncGalleryIndexFromScroll();
      }
      ticking = false;
    });
  };

  window.addEventListener("scroll", syncScene, { passive: true });
  window.addEventListener("resize", () => {
    syncScene();
    window.requestAnimationFrame(() => scrollGalleryTo(galleryState.index, "auto"));
  });
  window.addEventListener("orientationchange", () => {
    syncScene();
    window.requestAnimationFrame(() => scrollGalleryTo(galleryState.index, "auto"));
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && appState.owner.panelOpen) {
      closeOwnerModal();
    }
  });
}

async function init() {
  renderGalleryCarousel();
  renderAmenities();
  renderInfoCards();
  renderReviews();
  renderAccommodationSelects();
  syncBookingSetupState();
  renderRoomTypes();
  renderAvailabilityMonthNav();
  renderAvailabilityOverview();
  renderOwnerAccess();
  initRevealObserver();
  initGalleryCarousel();
  initEvents();
  updateScrolledHeader();
  updateSpiralScene();
  await hydrateOwnerState();
}

init();
