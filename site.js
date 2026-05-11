const PROPERTY_NAME = "AFRODITI Studios Grigoriu Luxury Apartments";
const PROPERTY_LOCATION = "Paralia Katerinis, Grecia";
const OWNER_USERNAME_PLACEHOLDER = "User proprietar";
const LOCAL_OWNER_SERVER_URL = "http://127.0.0.1:8787/owner";
const DESKTOP_SPIRAL = window.matchMedia("(min-width: 1081px)");
const COMPACT_AVAILABILITY = window.matchMedia("(max-width: 760px)");
const IS_OWNER_PAGE = document.body?.dataset.page === "owner";
const INTRO_SESSION_KEY = "afroditi-intro-seen";
const VISITOR_PREFERENCES_STORAGE_KEY = "afroditi-visitor-preferences";
const VISITOR_POLICY_VERSION = "2026-05-07-privacy-consent";
const GOOGLE_ANALYTICS_ID = "G-3ERJHNHMFY";

document.documentElement.classList.add("js-ready");

const CONTACT_SETTINGS = {
  whatsappNumber: "40742721408",
  calendarMonth: "",
};

const MINIMUM_BOOKING_NIGHTS = 4;
const STAY_PRICING_REFERENCE = Object.freeze([
  { nights: 4, total: 3032 },
  { nights: 5, total: 3790 },
  { nights: 6, total: 4548 },
  { nights: 7, total: 5306 },
  { nights: 8, total: 6065 },
  { nights: 9, total: 6823 },
]);
const AVERAGE_STAY_NIGHT_PRICE =
  STAY_PRICING_REFERENCE.reduce((sum, item) => sum + item.total / item.nights, 0) / STAY_PRICING_REFERENCE.length;

const DEFAULT_ACCOMMODATIONS = [
  {
    id: "studio-double",
    name: "Apartament studio cu 1 pat dublu",
    capacity: "2 adulti",
    maxAdults: 2,
    maxChildren: 0,
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
    maxAdults: 2,
    maxChildren: 1,
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
  "cazare-paralia-katerinis-afroditi-studios-exterior.jpg",
  "intrare-afroditi-studios-paralia-katerinis-grecia.jpg",
  "terasa-afroditi-studios-paralia-katerinis-1.jpg",
  "terasa-afroditi-studios-paralia-katerinis-2.jpg",
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
  "696119957.jpg",
  "696793852.jpg",
  "696793921.jpg",
  "696793943.jpg",
  "696794119.jpg",
  "696795514.jpg",
  "698803324.jpg",
  "698803810.jpg",
  "699517290.jpg",
  "701075281.jpg",
  "701075456.jpg",
  "821243420.jpg",
  "846839553.jpg",
  "846843696.jpg",
  "847487317.jpg",
];

const GALLERY_IMAGE_ALT_TEXT = {
  "cazare-paralia-katerinis-afroditi-studios-exterior.jpg":
    "Exteriorul cladirii AFRODITI Studios Grigoriu, cazare in Paralia Katerinis Grecia",
  "intrare-afroditi-studios-paralia-katerinis-grecia.jpg":
    "Intrarea AFRODITI Studios Grigoriu din Paralia Katerinis, Grecia",
  "terasa-afroditi-studios-paralia-katerinis-1.jpg":
    "Terasa spatioasa AFRODITI Studios Grigoriu pentru vacanta in Paralia Katerinis",
  "terasa-afroditi-studios-paralia-katerinis-2.jpg":
    "Terasa luminoasa cu vedere deschisa la AFRODITI Studios Grigoriu Paralia Katerinis",
  "694257536.jpg": "Dormitor luminos cu pat dublu pentru cazare in Paralia Katerinis",
  "694797681.jpg": "Balcon privat cu masa si scaune la AFRODITI Studios Grigoriu",
  "699517290.jpg": "Studio modern cu pat dublu, canapea si chicineta in Paralia Katerinis",
};

const AMENITIES = [
  ["Apartamente", "Studios luminoase, bine organizate, potrivite pentru sejururi relaxate la mare."],
  ["Parcare gratuita", "Confort in plus pentru sosiri cu masina si deplasari fara graba."],
  ["WiFi gratuit inclus", "Util pentru conectivitate zilnica, planuri de plaja sau cateva ore de lucru."],
  ["Transfer de la si/sau la aeroport", "Optiune practica pentru un drum mai usor pana la cazare."],
  ["Gratar", "Un detaliu care completeaza atmosfera relaxata a proprietatii."],
  ["Camere pentru nefumatori", "Un plus de confort pentru cupluri, familii si sejururi mai lungi."],
  ["Balcon", "Spatiu bun pentru cafeaua de dimineata sau o pauza linistita seara."],
  ["Vedere la mare", "Un detaliu care aduce si mai mult din senzatia de vacanta."],
  ["Aer conditionat", "Confort important in zilele calde de vara."],
  ["Terasa", "Una dintre cele mai placute zone pentru relaxare in aer liber."],
].map(([name, description]) => ({ name, description }));

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
const introOverlay = $("#site-intro");
const backToTopLinks = $$("[data-back-to-top]");
const sectionAnchorLinks = $$('a[href^="#"]:not([data-back-to-top])');
const sectionHighlightLinks = $$('.site-nav a[href^="#"], .booking-tabs a[href^="#"]');
const trackedSectionIds = Array.from(
  new Set(
    sectionHighlightLinks
      .map((link) => String(link.hash || "").replace(/^#/, "").trim())
      .filter(Boolean),
  ),
);
const revealItems = $$(".reveal");
const spiralShell = $(".review-spiral-shell");
const spiralStage = $("[data-review-spiral-stage]");
const galleryViewport = $("#gallery-viewport");
const galleryTrack = $("[data-gallery-track]");
const galleryCount = $("[data-gallery-count]");
const galleryProgress = $("[data-gallery-progress]");
const galleryPrev = $("#gallery-prev");
const galleryNext = $("#gallery-next");
const galleryLightbox = $("#gallery-lightbox");
const galleryLightboxImage = $("#gallery-lightbox-image");
const galleryLightboxCount = $("[data-gallery-lightbox-count]");
const galleryLightboxBackdrop = $("[data-gallery-lightbox-backdrop]");
const galleryLightboxClose = $("#gallery-lightbox-close");
const galleryLightboxPrev = $("#gallery-lightbox-prev");
const galleryLightboxNext = $("#gallery-lightbox-next");
const siteFooter = $(".site-footer");
const mobileQuickActions = $("[data-mobile-quick-actions]");
const roomTypesGrid = $("[data-room-types]");
const amenitiesGrid = $("[data-amenities-grid]");
const scoreBars = $("[data-score-bars]");
const reviewList = $("[data-review-list]");
const bookingForm = $("#booking-form");
const stayPricingGrid = $("[data-stay-pricing]");
const bookingAccommodationSelect = bookingForm?.querySelector("[data-accommodation-select]") ?? null;
const bookingAccommodationOptions = $("[data-accommodation-options]");
const bookingCheckInField = bookingForm?.querySelector('input[name="checkIn"]') ?? null;
const bookingCheckOutField = bookingForm?.querySelector('input[name="checkOut"]') ?? null;
const bookingGuestPicker = $("[data-guest-picker]");
const bookingGuestTrigger = $("#booking-guests-trigger");
const bookingGuestPanel = $("#booking-guests-panel");
const bookingGuestSummary = $("#booking-guests-summary");
const bookingGuestHint = $("#booking-guests-hint");
const bookingAdultsValue = $("#booking-adults-value");
const bookingChildrenValue = $("#booking-children-value");
const bookingAdultCountField = $("#booking-adult-count");
const bookingChildCountField = $("#booking-child-count");
const bookingGuestCountField = $("#booking-guest-count");
const bookingPriceNote = $("#booking-price-note");
const bookingContactConsent = $("#booking-contact-consent");
const bookingFormNote = $("#booking-form-note");
const bookingSubmit = $("#booking-submit");
const bookingRenderedAtField = $("#booking-form-rendered-at");
const bookingTurnstileField = $("#booking-turnstile-token");
const bookingTurnstileContainer = $("#booking-turnstile");
const availabilityOverview = $("[data-availability-overview]");
const preferenceStatusLabel = $("[data-preference-status]");
const openTermsButtons = $$("[data-open-terms]");
const openPreferencesButtons = $$("[data-open-preferences]");
const visitorPreferencesModal = $("#visitor-preferences-modal");
const visitorPreferencesClose = $("#visitor-preferences-close");
const visitorPreferencesKicker = $("#visitor-preferences-kicker");
const visitorPreferencesTitle = $("#visitor-preferences-title");
const visitorPreferencesText = $("#visitor-preferences-text");
const visitorSaveEssential = $("#visitor-save-essential");
const visitorSavePreferences = $("#visitor-save-preferences");
const visitorPreferencesStatus = $("#visitor-preferences-status");
const visitorBackdrop = $("[data-visitor-backdrop]");
const siteTermsModal = $("#site-terms-modal");
const siteTermsClose = $("#site-terms-close");
const termsBackdrop = $("[data-terms-backdrop]");
const trackableLinks = $$("[data-analytics-event]");
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
const ownerContactForm = $("#owner-contact-form");
const ownerContactStatus = $("#owner-contact-status");
const ownerAccountForm = $("#owner-account-form");
const ownerAccountStatus = $("#owner-account-status");
const ownerAccommodationSelect = $("[data-owner-accommodation-select]");
const ownerMonthLabel = $("#owner-month-label");
const ownerMonthPrev = $("#owner-month-prev");
const ownerMonthNext = $("#owner-month-next");
const ownerCalendar = $("[data-owner-calendar]");
const ownerStatus = $("#owner-status");
const ownerAnalyticsGrid = $("[data-owner-analytics-grid]");
const ownerAnalyticsDays = $("[data-owner-analytics-days]");
const ownerAnalyticsVisitors = $("[data-owner-analytics-visitors]");
const ownerAnalyticsStatus = $("#owner-analytics-status");

const galleryState = {
  index: 0,
  scrollTicking: false,
  lightboxOpen: false,
  lightboxAnimating: false,
  lastTrigger: null,
  pendingLightboxIndex: null,
};

let thirdPartyAnalyticsLoaded = false;

const PUBLIC_AVAILABILITY_MIN_VISIBLE_MONTHS = 8;
const PUBLIC_AVAILABILITY_TAIL_MONTHS = 3;

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

function getGalleryImageAlt(index) {
  const file = GALLERY_FILES[index];
  return GALLERY_IMAGE_ALT_TEXT[file] || `Fotografia ${index + 1} din galeria AFRODITI Studios Grigoriu`;
}

function waitForTimeout(delay) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function loadGalleryImage(index) {
  const safeIndex = clamp(index, 0, Math.max(GALLERY_FILES.length - 1, 0));
  const file = GALLERY_FILES[safeIndex];
  const image = new Image();
  image.decoding = "async";
  image.src = `Images/${file}`;

  if (typeof image.decode === "function") {
    return image.decode().catch(() => null).then(() => image);
  }

  if (image.complete) {
    return Promise.resolve(image);
  }

  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => resolve(image), { once: true });
  });
}

function warmGalleryLightboxNeighbors(index) {
  if (!GALLERY_FILES.length) {
    return;
  }

  if (index > 0) {
    void loadGalleryImage(index - 1);
  }

  if (index < GALLERY_FILES.length - 1) {
    void loadGalleryImage(index + 1);
  }
}

function sanitizePhone(value) {
  return String(value ?? "").replace(/\D+/g, "");
}

function setThirdPartyAnalyticsEnabled(isEnabled) {
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = !isEnabled;

  if (!isEnabled || thirdPartyAnalyticsLoaded || !GOOGLE_ANALYTICS_ID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
  script.addEventListener("load", () => {
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ANALYTICS_ID);
  });
  document.head.appendChild(script);
  thirdPartyAnalyticsLoaded = true;
}

function readLocalVisitorPreferences() {
  try {
    const raw = window.localStorage.getItem(VISITOR_PREFERENCES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalVisitorPreferences(payload) {
  try {
    window.localStorage.setItem(
      VISITOR_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        analyticsEnabled: !!payload?.analyticsEnabled,
        preferencesSaved: !!payload?.preferencesSaved,
        policyVersion: String(payload?.policyVersion || VISITOR_POLICY_VERSION).trim() || VISITOR_POLICY_VERSION,
        savedAt: String(payload?.savedAt || "").trim(),
        storageMode: String(payload?.storageMode || "").trim(),
      }),
    );
  } catch {
    // ignoram lipsa localStorage
  }
}

function getCurrentPath() {
  return window.location.pathname || "/";
}

function getCurrentUrlWithoutHash() {
  return `${getCurrentPath()}${window.location.search || ""}`;
}

function getNavigationType() {
  const performanceApi = window.performance;
  const navigationEntries =
    performanceApi && typeof performanceApi.getEntriesByType === "function"
      ? performanceApi.getEntriesByType("navigation")
      : [];
  return navigationEntries && navigationEntries.length ? String(navigationEntries[0]?.type || "") : "";
}

function replaceUrlWithoutHash() {
  try {
    window.history.replaceState(window.history.state, document.title, getCurrentUrlWithoutHash());
  } catch {
    // ignoram browserele care nu permit replaceState pe fisiere locale
  }
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

function getDefaultCalendarMonthValue(configuredMonth = CONTACT_SETTINGS.calendarMonth) {
  const normalized = String(configuredMonth ?? "").trim();
  return /^\d{4}-\d{2}$/.test(normalized) ? normalized : toMonthValue(new Date());
}

function buildAvailabilityMonthState(accommodations, initialMonth) {
  return accommodations.reduce((state, accommodation) => {
    state[accommodation.id] = initialMonth;
    return state;
  }, {});
}

function formatDate(dateString) {
  const date = parseDate(dateString);
  return date
    ? new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "-";
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("ro-RO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
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

function getMonthIndex(monthValue) {
  const [year, month] = String(monthValue).split("-").map(Number);
  if (!year || !month) {
    return null;
  }
  return year * 12 + (month - 1);
}

function compareMonthValues(leftMonthValue, rightMonthValue) {
  const leftIndex = getMonthIndex(leftMonthValue);
  const rightIndex = getMonthIndex(rightMonthValue);
  if (leftIndex === null || rightIndex === null) {
    return 0;
  }
  return leftIndex - rightIndex;
}

function getMonthDistance(startMonthValue, endMonthValue) {
  return Math.max(0, compareMonthValues(endMonthValue, startMonthValue));
}

function formatMonthShortLabel(monthValue) {
  const [year, month] = String(monthValue).split("-").map(Number);
  if (!year || !month) {
    return "";
  }
  return new Intl.DateTimeFormat("ro-RO", { month: "short", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

function getPublicAvailabilityMinimumMonthValue() {
  return toMonthValue(new Date());
}

function clampAvailabilityMonthValue(monthValue) {
  const normalized = /^\d{4}-\d{2}$/.test(String(monthValue).trim())
    ? String(monthValue).trim()
    : getDefaultCalendarMonthValue();
  const minimumMonthValue = getPublicAvailabilityMinimumMonthValue();
  return compareMonthValues(normalized, minimumMonthValue) < 0 ? minimumMonthValue : normalized;
}

function getInitialAvailabilityMonthValue(configuredMonth = CONTACT_SETTINGS.calendarMonth) {
  return clampAvailabilityMonthValue(getDefaultCalendarMonthValue(configuredMonth));
}

function getNights(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) {
    return 0;
  }
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function addDays(dateString, days) {
  const date = parseDate(dateString);
  if (!date) {
    return "";
  }
  date.setDate(date.getDate() + Number(days || 0));
  return toInputDate(date);
}

function formatNights(nights) {
  return `${nights} ${nights === 1 ? "noapte" : "nopti"}`;
}

function formatCurrencyLei(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return "-";
  }
  return `${new Intl.NumberFormat("ro-RO").format(Math.round(numericAmount))} lei`;
}

function isValidRange(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  return !!(start && end && start.getTime() < end.getTime());
}

function getStayPriceEstimate(nights) {
  const normalizedNights = clamp(Number(nights ?? 0), 0, 365);
  const exactMatch = STAY_PRICING_REFERENCE.find((item) => item.nights === normalizedNights);

  if (exactMatch) {
    return {
      nights: normalizedNights,
      total: exactMatch.total,
      isApproximate: false,
    };
  }

  return {
    nights: normalizedNights,
    total: Math.round(AVERAGE_STAY_NIGHT_PRICE * normalizedNights),
    isApproximate: normalizedNights > 0,
  };
}

function deriveHighlights(accommodation) {
  return [
    accommodation.capacity ? `capacitate: ${accommodation.capacity}` : "",
    accommodation.summary || "",
    "aproape de plaja si potrivit pentru sejururi relaxate",
  ]
    .filter(Boolean)
    .slice(0, 3);
}

function inferAccommodationGuestLimits(capacity) {
  const capacityLabel = String(capacity ?? "").toLowerCase();
  const adultsMatch = capacityLabel.match(/(\d+)\s*adulti?/);
  const childrenMatch = capacityLabel.match(/(\d+)\s*cop/i);

  return {
    maxAdults: clamp(Number(adultsMatch?.[1] ?? 2), 1, 20),
    maxChildren: clamp(Number(childrenMatch?.[1] ?? 0), 0, 20),
  };
}

function normalizeAccommodation(raw, index = 0) {
  const name = String(raw?.name ?? "").trim();
  if (!name) {
    return null;
  }

  const capacity = String(raw?.capacity ?? "").trim();
  const summary = String(raw?.summary ?? "").trim();
  const inferredLimits = inferAccommodationGuestLimits(capacity);
  const highlights = Array.isArray(raw?.highlights)
    ? raw.highlights.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const parsedMaxAdults = Number.parseInt(raw?.maxAdults, 10);
  const parsedMaxChildren = Number.parseInt(raw?.maxChildren, 10);

  return {
    id: String(raw?.id ?? `acc-${index + 1}`),
    name,
    capacity: capacity || "2 adulti",
    maxAdults: Number.isFinite(parsedMaxAdults) && parsedMaxAdults > 0 ? parsedMaxAdults : inferredLimits.maxAdults,
    maxChildren:
      Number.isFinite(parsedMaxChildren) && parsedMaxChildren >= 0 ? parsedMaxChildren : inferredLimits.maxChildren,
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

function cloneOwnerOverrides(raw) {
  return normalizeOwnerOverrides(raw);
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
  const initialMonth = getInitialAvailabilityMonthValue(configuredMonth);
  const search = new URLSearchParams(window.location.search);
  const initialAccommodation = accommodations[0] ?? null;
  const initialGuestLimits = getAccommodationGuestLimits(initialAccommodation);

  return {
    settings: {
      whatsappNumber: sanitizePhone(CONTACT_SETTINGS.whatsappNumber),
      calendarMonth: configuredMonth,
    },
    accommodations,
    reservations,
    booking: {
      adults: clamp(2, 1, initialGuestLimits.maxAdults),
      children: 0,
      guestPickerOpen: false,
      formRenderedAt: Date.now(),
      captchaEnabled: false,
      captchaSiteKey: "",
      captchaWidgetId: null,
      captchaLoading: false,
    },
    owner: {
      isAvailable: CAN_USE_OWNER_API,
      isAuthenticated: false,
      panelOpen: IS_OWNER_PAGE || search.get("owner") === "1",
      usernameHint: "",
      activeAccommodationId: accommodations[0]?.id ?? "",
      activeMonth: initialMonth,
      activeMode: "occupied",
      overrides: createEmptyOverrideState(accommodations),
      serverOverrides: createEmptyOverrideState(accommodations),
      pendingOperations: [],
      isSyncing: false,
      analyticsSummary: null,
      analyticsLoading: false,
    },
    availability: {
      monthByAccommodation: buildAvailabilityMonthState(accommodations, initialMonth),
    },
    visitor: {
      analyticsEnabled: false,
      preferencesSaved: false,
      policyVersion: VISITOR_POLICY_VERSION,
      storageMode: CAN_USE_OWNER_API ? "local-file" : "local-only",
      shouldShowWelcome: false,
      modalOpen: false,
      modalLocked: false,
      isNewVisitor: false,
      lastSavedAt: "",
    },
  };
}

function getAccommodationById(id) {
  return appState.accommodations.find((item) => item.id === id) ?? null;
}

function getAccommodationGuestLimits(accommodation) {
  return {
    maxAdults: clamp(Number(accommodation?.maxAdults ?? 2), 1, 20),
    maxChildren: clamp(Number(accommodation?.maxChildren ?? 0), 0, 20),
  };
}

function getActiveBookingAccommodation() {
  return getAccommodationById(bookingAccommodationSelect?.value) ?? appState.accommodations[0] ?? null;
}

function formatGuestPartyLabel(adults, children) {
  const safeAdults = clamp(Number(adults ?? 1), 1, 20);
  const safeChildren = clamp(Number(children ?? 0), 0, 20);
  const parts = [`${safeAdults} ${safeAdults === 1 ? "adult" : "adulti"}`];

  if (safeChildren > 0) {
    parts.push(`${safeChildren} ${safeChildren === 1 ? "copil" : "copii"}`);
  }

  return parts.join(", ");
}

function clampBookingGuestSelection(adults, children, accommodation = getActiveBookingAccommodation()) {
  const limits = getAccommodationGuestLimits(accommodation);

  return {
    adults: clamp(Number(adults ?? appState.booking?.adults ?? 1), 1, limits.maxAdults),
    children: clamp(Number(children ?? appState.booking?.children ?? 0), 0, limits.maxChildren),
  };
}

function setBookingGuestPickerOpen(isOpen) {
  if (!bookingGuestTrigger || !bookingGuestPanel) {
    return;
  }

  const shouldOpen = COMPACT_AVAILABILITY.matches ? true : !!isOpen;
  appState.booking.guestPickerOpen = shouldOpen;
  bookingGuestTrigger.setAttribute("aria-expanded", String(shouldOpen));
  bookingGuestPanel.hidden = !shouldOpen;
  bookingGuestPicker?.classList.toggle("is-open", shouldOpen);
  bookingGuestPicker?.classList.toggle("is-static", COMPACT_AVAILABILITY.matches);
}

function syncBookingGuestPicker(nextSelection = null) {
  const accommodation = getActiveBookingAccommodation();
  const selection = nextSelection
    ? clampBookingGuestSelection(nextSelection.adults, nextSelection.children, accommodation)
    : clampBookingGuestSelection(appState.booking.adults, appState.booking.children, accommodation);
  const limits = getAccommodationGuestLimits(accommodation);
  const summary = formatGuestPartyLabel(selection.adults, selection.children);
  const maxSummary = formatGuestPartyLabel(limits.maxAdults, limits.maxChildren);

  appState.booking.adults = selection.adults;
  appState.booking.children = selection.children;

  if (bookingGuestSummary) {
    bookingGuestSummary.textContent = summary;
  }
  if (bookingAdultsValue) {
    bookingAdultsValue.textContent = String(selection.adults);
  }
  if (bookingChildrenValue) {
    bookingChildrenValue.textContent = String(selection.children);
  }
  if (bookingAdultCountField) {
    bookingAdultCountField.value = String(selection.adults);
  }
  if (bookingChildCountField) {
    bookingChildCountField.value = String(selection.children);
  }
  if (bookingGuestCountField) {
    bookingGuestCountField.value = summary;
  }
  if (bookingGuestHint) {
    bookingGuestHint.textContent =
      limits.maxChildren > 0
        ? `Maxim ${maxSummary} pentru aceasta unitate.`
        : `Maxim ${limits.maxAdults} ${limits.maxAdults === 1 ? "adult" : "adulti"} pentru aceasta unitate.`;
  }

  bookingGuestPanel
    ?.querySelectorAll(".guest-picker-step")
    .forEach((button) => {
      const field = button.dataset.guestField;
      const step = Number(button.dataset.guestStep);
      let isDisabled = false;

      if (field === "adults") {
        isDisabled = step < 0 ? selection.adults <= 1 : selection.adults >= limits.maxAdults;
      }
      if (field === "children") {
        isDisabled = step < 0 ? selection.children <= 0 : selection.children >= limits.maxChildren;
      }

      button.disabled = isDisabled;
      button.setAttribute("aria-disabled", String(isDisabled));
    });

  setBookingGuestPickerOpen(appState.booking.guestPickerOpen);
  return selection;
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

function applyOwnerOverrideChange(overrides, accommodationId, isoDate, mode) {
  const bucket = normalizeOverrideBucket(overrides?.[accommodationId]);
  const cleanMode = mode === "free" ? "free" : "occupied";
  const currentList = cleanMode === "free" ? bucket.free : bucket.occupied;
  const alreadyApplied = currentList.includes(isoDate);

  bucket.occupied = bucket.occupied.filter((day) => day !== isoDate);
  bucket.free = bucket.free.filter((day) => day !== isoDate);

  if (!alreadyApplied) {
    const targetList = cleanMode === "free" ? bucket.free : bucket.occupied;
    targetList.push(isoDate);
    targetList.sort();
  }

  overrides[accommodationId] = {
    occupied: uniqueSortedDays(bucket.occupied),
    free: uniqueSortedDays(bucket.free),
  };
}

function syncOwnerOverridesFromServer(rawOverrides) {
  appState.owner.serverOverrides = cloneOwnerOverrides(rawOverrides);
  appState.owner.overrides = cloneOwnerOverrides(appState.owner.serverOverrides);

  appState.owner.pendingOperations.forEach((operation) => {
    applyOwnerOverrideChange(
      appState.owner.overrides,
      operation.accommodationId,
      operation.date,
      operation.mode,
    );
  });
}

function isOwnerDayPending(accommodationId, isoDate) {
  return appState.owner.pendingOperations.some(
    (operation) => operation.accommodationId === accommodationId && operation.date === isoDate,
  );
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

function clearBookingDateValidity() {
  bookingCheckInField?.setCustomValidity("");
  bookingCheckOutField?.setCustomValidity("");
}

function updateBookingPriceNote(message = "") {
  if (!bookingPriceNote) {
    return;
  }
  bookingPriceNote.textContent = message;
}

function syncBookingDateFields(options = {}) {
  if (!bookingCheckInField || !bookingCheckOutField || !bookingAccommodationSelect) {
    return true;
  }

  const { report = false, keepStatus = false } = options;
  const today = toInputDate(new Date());
  const accommodation = getActiveBookingAccommodation();
  const checkIn = String(bookingCheckInField.value || "").trim();
  const checkOut = String(bookingCheckOutField.value || "").trim();

  clearBookingDateValidity();
  bookingCheckInField.min = today;
  bookingCheckOutField.disabled = !checkIn;
  bookingCheckOutField.min = checkIn ? addDays(checkIn, MINIMUM_BOOKING_NIGHTS) : today;

  if (!checkIn) {
    updateBookingPriceNote(`Selecteaza un sejur de minimum ${MINIMUM_BOOKING_NIGHTS} nopti pentru a vedea suma orientativa.`);
    if (!keepStatus) {
      setStatus("booking-status", "", "");
    }
    return true;
  }

  const minimumCheckoutDate = addDays(checkIn, MINIMUM_BOOKING_NIGHTS);
  const minimumStayConflicts = accommodation ? getConflicts(accommodation.id, checkIn, minimumCheckoutDate) : [];

  if (!accommodation || !isValidRange(checkIn, minimumCheckoutDate) || minimumStayConflicts.length) {
    const message = `Data de check-in trebuie sa porneasca un interval liber de minimum ${MINIMUM_BOOKING_NIGHTS} nopti.`;
    bookingCheckInField.setCustomValidity(message);
    bookingCheckOutField.value = "";
    bookingCheckOutField.disabled = true;
    updateBookingPriceNote(message);
    if (!keepStatus) {
      setStatus("booking-status", message, "error");
    }
    if (report) {
      bookingCheckInField.reportValidity();
    }
    return false;
  }

  bookingCheckOutField.disabled = false;

  if (!checkOut) {
    updateBookingPriceNote(
      `Pentru ${formatNights(MINIMUM_BOOKING_NIGHTS)} pornesti de la ${formatCurrencyLei(
        getStayPriceEstimate(MINIMUM_BOOKING_NIGHTS).total,
      )}.`,
    );
    if (!keepStatus) {
      setStatus("booking-status", "", "");
    }
    return true;
  }

  const nights = getNights(checkIn, checkOut);
  if (!isValidRange(checkIn, checkOut) || nights < MINIMUM_BOOKING_NIGHTS) {
    const message = `Se accepta rezervari de minimum ${MINIMUM_BOOKING_NIGHTS} nopti.`;
    bookingCheckOutField.setCustomValidity(message);
    updateBookingPriceNote(message);
    if (!keepStatus) {
      setStatus("booking-status", message, "error");
    }
    if (report) {
      bookingCheckOutField.reportValidity();
    }
    return false;
  }

  const conflicts = accommodation ? getConflicts(accommodation.id, checkIn, checkOut) : [];
  if (conflicts.length) {
    const message = "Intervalul ales include zile deja ocupate. Alege un interval complet liber din calendar.";
    bookingCheckOutField.setCustomValidity(message);
    updateBookingPriceNote(message);
    if (!keepStatus) {
      setStatus("booking-status", message, "error");
    }
    if (report) {
      bookingCheckOutField.reportValidity();
    }
    return false;
  }

  const estimate = getStayPriceEstimate(nights);
  updateBookingPriceNote(
    estimate.isApproximate
      ? `Estimare orientativa pentru ${formatNights(nights)}: aproximativ ${formatCurrencyLei(estimate.total)}.`
      : `Estimare pentru ${formatNights(nights)}: de la ${formatCurrencyLei(estimate.total)}.`,
  );
  if (!keepStatus) {
    setStatus("booking-status", "", "");
  }
  return true;
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

function applyVisitorPayload(payload = {}) {
  appState.visitor.analyticsEnabled = !!payload.analyticsEnabled;
  appState.visitor.preferencesSaved = !!payload.preferencesSaved;
  appState.visitor.policyVersion = String(payload.policyVersion || VISITOR_POLICY_VERSION).trim() || VISITOR_POLICY_VERSION;
  appState.visitor.lastSavedAt = String(payload.savedAt || "").trim();
  appState.visitor.storageMode = String(payload.storageMode || appState.visitor.storageMode || "").trim() || "local-only";
  setThirdPartyAnalyticsEnabled(appState.visitor.analyticsEnabled);
}

function renderVisitorPreferenceStatus() {
  if (!preferenceStatusLabel) {
    return;
  }

  if (!appState.visitor.preferencesSaved) {
    preferenceStatusLabel.textContent = "Preferintele de confidentialitate nu sunt salvate inca pentru acest vizitator.";
    return;
  }

  preferenceStatusLabel.textContent = appState.visitor.analyticsEnabled
    ? "Preferintele sunt salvate. Analytics-ul optional este activ."
    : "Preferintele sunt salvate. Ruleaza doar functionarea esentiala a site-ului.";
}

function syncVisitorPreferenceUi() {
  if (visitorPreferencesClose) {
    visitorPreferencesClose.hidden = appState.visitor.modalLocked;
  }

  if (!visitorPreferencesKicker || !visitorPreferencesTitle || !visitorPreferencesText) {
    renderVisitorPreferenceStatus();
    return;
  }

  if (appState.visitor.modalLocked) {
    visitorPreferencesKicker.textContent = appState.visitor.isNewVisitor ? "Prima vizita" : "Informare cookies";
    visitorPreferencesTitle.textContent = "Bine ai venit la AFRODITI Studios Grigoriu.";
    visitorPreferencesText.textContent =
      "La prima deschidere iti cerem sa alegi separat intre functionarea esentiala a site-ului si analytics-ul optional folosit pentru masurarea interactiunilor.";
  } else {
    visitorPreferencesKicker.textContent = "Cookies si analytics";
    visitorPreferencesTitle.textContent = "Preferinte de confidentialitate si analytics.";
    visitorPreferencesText.textContent =
      "Poti pastra doar functionarea esentiala a site-ului sau poti activa analytics-ul optional pentru statistici de utilizare si administrarea mai buna a cererilor.";
  }

  if (visitorSavePreferences) {
    visitorSavePreferences.textContent =
      appState.visitor.analyticsEnabled ? "Analytics activ" : "Accept analytics";
  }

  if (visitorSaveEssential) {
    visitorSaveEssential.textContent =
      appState.visitor.preferencesSaved && !appState.visitor.analyticsEnabled
        ? "Doar esentiale activ"
        : "Continua doar cu esentiale";
  }

  renderVisitorPreferenceStatus();
}

function setVisitorModalOpen(isOpen, { locked = false } = {}) {
  if (!visitorPreferencesModal) {
    return;
  }

  appState.visitor.modalOpen = !!isOpen;
  appState.visitor.modalLocked = !!locked && !!isOpen;
  visitorPreferencesModal.hidden = !isOpen;
  visitorPreferencesModal.setAttribute("aria-hidden", String(!isOpen));
  body.classList.toggle("visitor-modal-open", !!isOpen);
  syncVisitorPreferenceUi();

  if (isOpen) {
    window.requestAnimationFrame(() => {
      if (visitorSaveEssential) {
        visitorSaveEssential.focus();
        return;
      }
      if (visitorSavePreferences) {
        visitorSavePreferences.focus();
        return;
      }
      if (visitorPreferencesClose && !visitorPreferencesClose.hidden) {
        visitorPreferencesClose.focus();
      }
    });
    return;
  }

  setStatus(visitorPreferencesStatus, "", "");
}

function openTermsModal() {
  if (!siteTermsModal) {
    return;
  }
  siteTermsModal.hidden = false;
  siteTermsModal.setAttribute("aria-hidden", "false");
  body.classList.add("visitor-modal-open");
  void trackAnalyticsEvent("policy_open");
}

function closeTermsModal() {
  if (!siteTermsModal) {
    return;
  }

  siteTermsModal.hidden = true;
  siteTermsModal.setAttribute("aria-hidden", "true");
  body.classList.toggle("visitor-modal-open", appState.visitor.modalOpen);
}

function maybeOpenVisitorWelcome() {
  if (IS_OWNER_PAGE || !appState.visitor.shouldShowWelcome || appState.visitor.modalOpen) {
    return;
  }

  if (body.classList.contains("intro-active")) {
    return;
  }

  setVisitorModalOpen(true, { locked: true });
}

async function persistVisitorPreferences({ source = "manual", silent = false, closeModal = true, analyticsEnabled = false } = {}) {
  const fallbackPayload = {
    analyticsEnabled: !!analyticsEnabled,
    preferencesSaved: true,
    policyVersion: appState.visitor.policyVersion || VISITOR_POLICY_VERSION,
    savedAt: new Date().toISOString(),
    storageMode: CAN_USE_OWNER_API ? appState.visitor.storageMode : "local-only",
  };

  try {
    const payload = CAN_USE_OWNER_API && !IS_OWNER_PAGE
      ? await fetchJson("/api/visitor/preferences", {
          method: "POST",
          body: JSON.stringify({
            path: getCurrentPath(),
            analyticsEnabled: !!analyticsEnabled,
            source,
          }),
        })
      : { visitor: fallbackPayload };

    applyVisitorPayload(payload?.visitor || fallbackPayload);
    appState.visitor.shouldShowWelcome = false;
    writeLocalVisitorPreferences({
      ...fallbackPayload,
      ...(payload?.visitor || {}),
    });
    syncVisitorPreferenceUi();
    if (!silent) {
      setStatus(
        visitorPreferencesStatus,
        analyticsEnabled
          ? "Preferintele au fost salvate, iar analytics-ul optional este activ."
          : "Preferintele au fost salvate. Site-ul foloseste doar functionarea esentiala.",
        "success",
      );
    }
    if (closeModal) {
      window.setTimeout(() => {
        setVisitorModalOpen(false);
      }, 240);
    }
  } catch {
    applyVisitorPayload(fallbackPayload);
    appState.visitor.shouldShowWelcome = false;
    writeLocalVisitorPreferences(fallbackPayload);
    syncVisitorPreferenceUi();
    if (!silent) {
      setStatus(
        visitorPreferencesStatus,
        analyticsEnabled
          ? "Preferintele au fost salvate local, iar analytics-ul optional este activ in acest browser."
          : "Preferintele au fost salvate local si ruleaza doar functionarea esentiala.",
        "success",
      );
    }
    if (closeModal) {
      window.setTimeout(() => {
        setVisitorModalOpen(false);
      }, 240);
    }
  }
}

async function hydrateVisitorState() {
  if (IS_OWNER_PAGE) {
    return;
  }

  const localPreferences = readLocalVisitorPreferences();
  const localPreferencesSaved =
    !!localPreferences?.preferencesSaved &&
    String(localPreferences?.policyVersion || "").trim() === VISITOR_POLICY_VERSION;
  const localPayload = {
    analyticsEnabled: !!localPreferences?.analyticsEnabled,
    preferencesSaved: localPreferencesSaved,
    policyVersion: String(localPreferences?.policyVersion || VISITOR_POLICY_VERSION).trim() || VISITOR_POLICY_VERSION,
    savedAt: String(localPreferences?.savedAt || "").trim(),
    storageMode: String(localPreferences?.storageMode || "local-only").trim(),
  };

  appState.visitor.isNewVisitor = false;

  if (!CAN_USE_OWNER_API) {
    applyVisitorPayload(localPayload);
    appState.visitor.isNewVisitor = !appState.visitor.preferencesSaved;
    appState.visitor.shouldShowWelcome = !appState.visitor.preferencesSaved;
    syncVisitorPreferenceUi();
    maybeOpenVisitorWelcome();
    return;
  }

  try {
    const payload = await fetchJson(`/api/visitor/bootstrap?path=${encodeURIComponent(getCurrentPath())}`);
    appState.visitor.shouldShowWelcome = !!payload?.shouldShowWelcome;
    appState.visitor.isNewVisitor = !!payload?.isNewVisitor;
    applyVisitorPayload(payload?.visitor || localPayload);
    writeLocalVisitorPreferences(payload?.visitor || localPayload);
  } catch {
    applyVisitorPayload(localPayload);
    appState.visitor.isNewVisitor = !appState.visitor.preferencesSaved;
    appState.visitor.shouldShowWelcome = !appState.visitor.preferencesSaved;
  }

  syncVisitorPreferenceUi();
  maybeOpenVisitorWelcome();
}

async function trackAnalyticsEvent(eventType) {
  if (IS_OWNER_PAGE || !appState.visitor.analyticsEnabled || !CAN_USE_OWNER_API) {
    return;
  }

  try {
    if (typeof navigator.sendBeacon === "function") {
      const sent = navigator.sendBeacon(
        "/api/analytics/event",
        new Blob(
          [
            JSON.stringify({
              eventType,
              path: getCurrentPath(),
            }),
          ],
          { type: "application/json" },
        ),
      );

      if (sent) {
        return;
      }
    }

    await fetchJson("/api/analytics/event", {
      method: "POST",
      body: JSON.stringify({
        eventType,
        path: getCurrentPath(),
      }),
    });
  } catch {
    // analytics optional: nu blocam experienta publicului
  }
}

let ownerRefreshFrame = 0;

function scheduleOwnerDataRefresh() {
  if (ownerRefreshFrame) {
    return;
  }

  ownerRefreshFrame = window.requestAnimationFrame(() => {
    ownerRefreshFrame = 0;
    renderRoomTypes();
    renderAvailabilityOverview();
    syncBookingDateFields({ keepStatus: true });
    renderOwnerPanel();
  });
}

async function flushOwnerPendingOperations() {
  if (appState.owner.isSyncing || !appState.owner.pendingOperations.length) {
    return;
  }

  appState.owner.isSyncing = true;
  const operation = appState.owner.pendingOperations[0];

  try {
    const payload = await fetchJson("/api/calendar/toggle", {
      method: "POST",
      body: JSON.stringify({
        accommodationId: operation.accommodationId,
        date: operation.date,
        mode: operation.mode,
      }),
    });

    appState.owner.pendingOperations.shift();
    syncOwnerOverridesFromServer(payload?.overrides);

    if (appState.owner.pendingOperations.length) {
      setStatus(
        ownerStatus,
        `Sincronizez inca ${appState.owner.pendingOperations.length} modificari din calendar...`,
        "",
      );
    } else {
      setStatus(
        ownerStatus,
        `${formatDate(operation.date)} este acum marcata ca ${operation.mode === "occupied" ? "ocupata" : "libera"} si reflectata in site.`,
        "success",
      );
    }
  } catch (error) {
    appState.owner.pendingOperations.shift();
    syncOwnerOverridesFromServer(appState.owner.serverOverrides);
    setStatus(
      ownerStatus,
      error.message || "Nu am putut salva modificarea. Am revenit la ultima varianta sincronizata.",
      "error",
    );
  } finally {
    appState.owner.isSyncing = false;
    scheduleOwnerDataRefresh();
    if (appState.owner.pendingOperations.length) {
      void flushOwnerPendingOperations();
    }
  }
}

function getAccommodationStatus(accommodation, combinedSet = null) {
  const busySet = combinedSet ?? getCombinedBusySet(accommodation.id);
  const today = toInputDate(new Date());

  if (busySet.has(today)) {
    return {
      label: "Ocupat",
      className: "is-busy",
      helper: "Perioada curenta este deja rezervata pentru aceasta unitate.",
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
        helper: `Urmatoarea zi deja rezervata este ${formatDate(nextBusyDay)}.`,
      }
    : {
        label: "Disponibil",
        className: "is-free",
        helper: "Momentan nu apar rezervari in lunile urmatoare.",
      };
}

function getAvailabilityMonthValue(accommodationId) {
  const active = String(appState.availability?.monthByAccommodation?.[accommodationId] ?? "").trim();
  if (/^\d{4}-\d{2}$/.test(active)) {
    return clampAvailabilityMonthValue(active);
  }

  return getInitialAvailabilityMonthValue(appState.settings.calendarMonth);
}

function setAvailabilityMonthValue(accommodationId, monthValue) {
  if (!accommodationId) {
    return;
  }

  if (!appState.availability.monthByAccommodation) {
    appState.availability.monthByAccommodation = {};
  }

  appState.availability.monthByAccommodation[accommodationId] = clampAvailabilityMonthValue(monthValue);
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

function getBusyDaysForMonth(combinedSet, monthValue) {
  const prefix = `${monthValue}-`;
  return Array.from(combinedSet)
    .filter((day) => day.startsWith(prefix))
    .sort()
    .map((day) => String(Number(day.slice(-2))));
}

function getDaysInMonth(monthValue) {
  const [year, month] = String(monthValue).split("-").map(Number);
  if (!year || !month) {
    return 30;
  }
  return new Date(year, month, 0).getDate();
}

function formatDayRangeLabel(startDay, endDay) {
  return startDay === endDay ? String(startDay) : `${startDay}-${endDay}`;
}

function getAvailabilityVisibleDayStart(monthValue) {
  const today = new Date();
  return monthValue === toMonthValue(today) ? today.getDate() : 1;
}

function getAvailabilityMonthMetrics(combinedSet, monthValue) {
  const daysInMonth = getDaysInMonth(monthValue);
  const visibleStartDay = getAvailabilityVisibleDayStart(monthValue);
  const busyDays = [];
  const freeRanges = [];
  let rangeStart = null;

  for (let day = visibleStartDay; day <= daysInMonth; day += 1) {
    const isoDate = `${monthValue}-${String(day).padStart(2, "0")}`;
    const isBusy = combinedSet.has(isoDate);

    if (!isBusy && rangeStart === null) {
      rangeStart = day;
    }

    if (isBusy) {
      busyDays.push(String(day));
    }

    if ((isBusy || day === daysInMonth) && rangeStart !== null) {
      const rangeEnd = isBusy ? day - 1 : day;
      if (rangeEnd >= rangeStart) {
        freeRanges.push(formatDayRangeLabel(rangeStart, rangeEnd));
      }
      rangeStart = null;
    }
  }

  const visibleDayCount = Math.max(0, daysInMonth - visibleStartDay + 1);
  const busyDayCount = busyDays.length;

  return {
    daysInMonth,
    visibleDayCount,
    visibleStartDay,
    busyDayCount,
    busyDays,
    freeRanges,
    availableDayCount: Math.max(0, visibleDayCount - busyDayCount),
    startsFromToday: visibleStartDay > 1,
  };
}

function buildAvailabilityMonthButtons(accommodationId, activeMonthValue, combinedSet) {
  const minimumMonthValue = getPublicAvailabilityMinimumMonthValue();
  const activeMonth = clampAvailabilityMonthValue(activeMonthValue);
  const totalMonths = Math.max(
    PUBLIC_AVAILABILITY_MIN_VISIBLE_MONTHS,
    getMonthDistance(minimumMonthValue, activeMonth) + 1 + PUBLIC_AVAILABILITY_TAIL_MONTHS,
  );

  return Array.from({ length: totalMonths }, (_, offset) => {
    const monthValue = addMonthsToMonthValue(minimumMonthValue, offset);
    const metrics = getAvailabilityMonthMetrics(combinedSet, monthValue);
    const isActive = monthValue === activeMonth;
    const helperLabel = metrics.availableDayCount ? `${metrics.availableDayCount} libere` : "ocupata";

    return `
      <button
        class="availability-month-pill${isActive ? " is-active" : ""}"
        type="button"
        data-availability-month-value="${escapeHtml(monthValue)}"
        data-accommodation-id="${escapeHtml(accommodationId)}"
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <strong>${escapeHtml(formatMonthShortLabel(monthValue))}</strong>
        <span>${escapeHtml(helperLabel)}</span>
      </button>
    `;
  }).join("");
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
  return `
    <article class="gallery-slide" data-gallery-slide data-gallery-index="${index}">
      <figure class="gallery-slide-frame">
        <div class="gallery-slide-media">
          <button
            class="gallery-slide-trigger"
            type="button"
            data-gallery-open="${index}"
            aria-label="${escapeHtml(`Mareste fotografia ${index + 1} din galerie`)}"
          >
            <img
              src="Images/${escapeHtml(file)}"
              alt="${escapeHtml(getGalleryImageAlt(index))}"
              loading="lazy"
              decoding="async"
              draggable="false"
            >
          </button>
        </div>
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
          <p class="review-card-footnote">Impresie lasata de un oaspete dupa sejur.</p>
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
  if (!bookingAccommodationSelect) {
    return;
  }

  const previous = bookingAccommodationSelect.value;
  bookingAccommodationSelect.innerHTML = appState.accommodations
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");

  bookingAccommodationSelect.value = appState.accommodations.some((item) => item.id === previous)
    ? previous
    : appState.accommodations[0]?.id ?? "";
  renderBookingAccommodationChoices();
  syncBookingGuestPicker();
  syncBookingDateFields({ keepStatus: true });
}

function renderBookingAccommodationChoices() {
  if (!bookingAccommodationOptions || !bookingAccommodationSelect) {
    return;
  }

  const activeId = bookingAccommodationSelect.value;
  bookingAccommodationOptions.innerHTML = appState.accommodations
    .map((item) => {
      const isActive = item.id === activeId;
      return `
        <button
          class="booking-accommodation-option${isActive ? " is-active" : ""}"
          type="button"
          data-accommodation-option="${escapeHtml(item.id)}"
          aria-pressed="${isActive ? "true" : "false"}"
        >
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.capacity)}</span>
        </button>
      `;
    })
    .join("");
}

function renderStayPricing() {
  if (!stayPricingGrid) {
    return;
  }

  stayPricingGrid.innerHTML = STAY_PRICING_REFERENCE.map(
    (item) => `
      <article class="stay-pricing-card${item.nights === MINIMUM_BOOKING_NIGHTS ? " is-featured" : ""}">
        <strong>${escapeHtml(formatNights(item.nights))}</strong>
        <span>${escapeHtml(formatCurrencyLei(item.total))}</span>
        <small>${item.nights === MINIMUM_BOOKING_NIGHTS ? "sejur minim Booking" : "tarif orientativ"}</small>
      </article>
    `,
  ).join("");
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

  roomTypesGrid.innerHTML = appState.accommodations
    .map((accommodation) => {
      const monthValue = getAvailabilityMonthValue(accommodation.id);
      const monthLabel = formatMonthLabel(monthValue);
      const combinedSet = getCombinedBusySet(accommodation.id);
      const status = getAccommodationStatus(accommodation, combinedSet);
      const busyDays = getBusyDayCountForMonth(combinedSet, monthValue);

      return `
        <article class="room-type-card">
          <div class="room-type-top">
            <div class="room-type-copy">
              <strong>${escapeHtml(accommodation.name)}</strong>
              <span class="room-type-month">${escapeHtml(monthLabel)}</span>
            </div>
            <span class="room-type-status ${status.className}">${status.label}</span>
          </div>
          <p>${escapeHtml(accommodation.summary)}</p>
          <ul>
            <li>${escapeHtml(accommodation.capacity)}</li>
            ${accommodation.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            <li>${busyDays ? `${busyDays} zile ocupate in ${monthLabel}` : `nicio zi ocupata in ${monthLabel}`}</li>
          </ul>
          <p>${escapeHtml(status.helper)}</p>
        </article>
      `;
    })
    .join("");
}

function scrollAvailabilityMonthStripToActive(button, behavior = "smooth") {
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const strip = button.closest(".availability-month-strip");
  if (!(strip instanceof HTMLElement)) {
    return;
  }

  const targetLeft =
    button.offsetLeft - strip.offsetLeft - Math.max(0, (strip.clientWidth - button.offsetWidth) / 2);

  strip.scrollTo({
    left: Math.max(0, targetLeft),
    behavior,
  });
}

function renderAvailabilityOverview() {
  if (!availabilityOverview) {
    return;
  }

  availabilityOverview.innerHTML = appState.accommodations
    .map((accommodation) => {
      const monthValue = getAvailabilityMonthValue(accommodation.id);
      const monthLabel = formatMonthLabel(monthValue);
      const combinedSet = getCombinedBusySet(accommodation.id);
      const status = getAccommodationStatus(accommodation, combinedSet);
      const metrics = getAvailabilityMonthMetrics(combinedSet, monthValue);
      const minimumMonthValue = getPublicAvailabilityMinimumMonthValue();
      const previousDisabled = compareMonthValues(monthValue, minimumMonthValue) <= 0;
      const availableSummaryLabel = metrics.availableDayCount
        ? `${metrics.availableDayCount} zile libere`
        : "Nicio zi libera";
      const busySummaryLabel = metrics.busyDayCount
        ? `${metrics.busyDayCount} zile ocupate`
        : "Fara zile ocupate";
      const availabilityRatio = metrics.visibleDayCount
        ? Math.round((metrics.availableDayCount / metrics.visibleDayCount) * 100)
        : 0;
      const monthHelper = metrics.startsFromToday
        ? "Afisam doar zilele ramase incepand de astazi."
        : "Selecteaza rapid alta luna, fara sa mergi inapoi de luna curenta.";
      const freeRangesMarkup = metrics.freeRanges.length
        ? metrics.freeRanges.map((range) => `<span class="availability-day-pill is-free">${range}</span>`).join("")
        : '<span class="availability-day-pill is-booked">Nicio zi libera</span>';
      const busyDaysMarkup = metrics.busyDays.length
        ? metrics.busyDays.map((day) => `<span class="availability-day-pill is-booked">${day}</span>`).join("")
        : '<span class="availability-day-pill is-free">Fara zile ocupate</span>';

      return `
        <article class="availability-sheet panel-surface">
          <div class="availability-sheet-head">
            <div>
              <strong>${escapeHtml(accommodation.name)}</strong>
              <span>Potrivit pentru ${escapeHtml(accommodation.capacity)}</span>
            </div>
            <span class="room-type-status ${status.className}">${status.label}</span>
          </div>
          <div class="availability-month-nav is-inline" aria-label="${escapeHtml(`Navigare luna pentru ${accommodation.name}`)}">
            <button
              class="availability-month-button"
              type="button"
              data-availability-month-step="-1"
              data-accommodation-id="${escapeHtml(accommodation.id)}"
              aria-label="${escapeHtml(`Luna anterioara pentru ${accommodation.name}`)}"
              ${previousDisabled ? "disabled" : ""}
            >
              <span aria-hidden="true">&#8592;</span>
            </button>

            <div class="availability-month-copy">
              <strong>${escapeHtml(monthLabel)}</strong>
              <span>${escapeHtml(monthHelper)}</span>
            </div>

            <button
              class="availability-month-button"
              type="button"
              data-availability-month-step="1"
              data-accommodation-id="${escapeHtml(accommodation.id)}"
              aria-label="${escapeHtml(`Luna urmatoare pentru ${accommodation.name}`)}"
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
          <div class="availability-month-strip" aria-label="${escapeHtml(`Luni disponibile pentru ${accommodation.name}`)}">
            ${buildAvailabilityMonthButtons(accommodation.id, monthValue, combinedSet)}
          </div>
          <div class="availability-summary">
            <span class="availability-summary-chip">
              ${availableSummaryLabel}
            </span>
            <span class="availability-summary-chip ${metrics.busyDayCount ? "is-busy" : "is-free"}">
              ${busySummaryLabel}
            </span>
          </div>
          <div class="availability-month-progress" aria-hidden="true">
            <span style="width:${availabilityRatio}%"></span>
          </div>
          <div class="availability-range-grid">
            <div class="availability-day-block">
              <strong class="availability-day-label">Intervale libere</strong>
              <div class="availability-day-list" aria-label="${escapeHtml(`Intervale libere in ${monthLabel}`)}">
                ${freeRangesMarkup}
              </div>
            </div>
            <div class="availability-day-block">
              <strong class="availability-day-label">Zile ocupate</strong>
              <div class="availability-day-list" aria-label="${escapeHtml(`Zile ocupate in ${monthLabel}`)}">
                ${busyDaysMarkup}
              </div>
            </div>
          </div>
          <p class="availability-sheet-note">
            ${metrics.startsFromToday
              ? `Pentru ${monthLabel} sunt afisate doar zilele ramase de la ziua ${metrics.visibleStartDay}.`
              : monthHelper}
          </p>
        </article>
      `;
    })
    .join("");

  window.requestAnimationFrame(() => {
    availabilityOverview.querySelectorAll(".availability-month-pill.is-active").forEach((button) => {
      scrollAvailabilityMonthStripToActive(button, "auto");
    });
  });
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
    const isPending = !outside && isOwnerDayPending(accommodationId, isoDate);

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
    if (isPending) {
      classes.push("is-pending");
    }

    const note = outside ? "" : isPending ? "Se salveaza" : isBooked ? "Ocupat" : "Liber";
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

function getOwnerContactInput(fieldName) {
  const field = ownerContactForm?.elements?.namedItem(fieldName);
  return field instanceof HTMLInputElement ? field : null;
}

function syncOwnerLoginForm() {
  const usernameInput = getOwnerLoginInput("ownerUsername");
  if (usernameInput) {
    usernameInput.placeholder = OWNER_USERNAME_PLACEHOLDER;
  }

  if (ownerLoginHint) {
    ownerLoginHint.textContent =
      "Datele de acces raman private, iar zilele salvate aici se reflecta in disponibilitatea publica a site-ului.";
  }
}

function syncOwnerAccountForm() {
  const nextUsernameInput = getOwnerAccountInput("nextOwnerUsername");
  if (nextUsernameInput) {
    nextUsernameInput.placeholder = appState.owner.usernameHint || OWNER_USERNAME_PLACEHOLDER;
  }
}

function syncOwnerContactForm() {
  const whatsappInput = getOwnerContactInput("ownerWhatsappNumber");
  if (!whatsappInput) {
    return;
  }

  whatsappInput.value = appState.settings.whatsappNumber || "";
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
  syncOwnerContactForm();
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
  renderOwnerAnalytics();
}

function handleAvailabilityMonthChange(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const selectButton = event.target.closest("[data-availability-month-value]");
  if (selectButton instanceof HTMLButtonElement) {
    const accommodationId = String(selectButton.dataset.accommodationId ?? "").trim();
    const monthValue = String(selectButton.dataset.availabilityMonthValue ?? "").trim();
    if (!accommodationId || !/^\d{4}-\d{2}$/.test(monthValue)) {
      return;
    }
    setAvailabilityMonthValue(accommodationId, monthValue);
    renderRoomTypes();
    renderAvailabilityOverview();
    return;
  }

  const stepButton = event.target.closest("[data-availability-month-step]");
  if (!(stepButton instanceof HTMLButtonElement) || stepButton.disabled) {
    return;
  }

  const accommodationId = String(stepButton.dataset.accommodationId ?? "").trim();
  const direction = Number(stepButton.dataset.availabilityMonthStep ?? 0);

  if (!accommodationId || !Number.isFinite(direction) || direction === 0) {
    return;
  }

  const nextMonth = addMonthsToMonthValue(getAvailabilityMonthValue(accommodationId), direction);
  setAvailabilityMonthValue(accommodationId, nextMonth);
  renderRoomTypes();
  renderAvailabilityOverview();
}

function renderOwnerAnalytics() {
  if (!ownerAnalyticsGrid || !ownerAnalyticsDays || !ownerAnalyticsVisitors) {
    return;
  }

  const summary = appState.owner.analyticsSummary;
  if (!summary) {
    ownerAnalyticsGrid.innerHTML = "";
    ownerAnalyticsDays.innerHTML = '<p class="owner-analytics-empty">Statistica site-ului apare aici dupa autentificare.</p>';
    ownerAnalyticsVisitors.innerHTML = "";
    return;
  }

  const totals = summary.totals || {};
  ownerAnalyticsGrid.innerHTML = [
    ["Vizitatori unici", totals.uniqueVisitors || 0],
    ["Intrari totale", totals.totalEntries || 0],
    ["Intrari cu analytics", totals.analyticsEntries || 0],
    ["Cereri WhatsApp", totals.whatsappRequests || 0],
    ["Clickuri social", totals.socialClicks || 0],
    ["Informari confirmate", totals.preferenceSaves || 0],
  ]
    .map(
      ([label, value]) => `
        <article class="owner-analytics-stat">
          <strong>${escapeHtml(label)}</strong>
          <b>${escapeHtml(String(value))}</b>
          <span>Actualizat din datele agregate ale site-ului.</span>
        </article>
      `,
    )
    .join("");

  ownerAnalyticsDays.innerHTML = Array.isArray(summary.recentDays) && summary.recentDays.length
    ? summary.recentDays
        .slice(-6)
        .reverse()
        .map(
          (day) => `
            <article class="owner-analytics-day">
              <strong>${escapeHtml(formatDate(day.date))}</strong>
              <span>${escapeHtml(String(day.entries || 0))} intrari, ${escapeHtml(String(day.newVisitors || 0))} vizitatori noi</span>
              <span>${escapeHtml(String(day.whatsappRequests || 0))} cereri WhatsApp, ${escapeHtml(String(day.socialClicks || 0))} clickuri social</span>
            </article>
          `,
        )
        .join("")
    : '<p class="owner-analytics-empty">Nu exista inca zile inregistrate in sumarul analytics.</p>';

  ownerAnalyticsVisitors.innerHTML = Array.isArray(summary.recentVisitors) && summary.recentVisitors.length
    ? summary.recentVisitors
        .map(
          (visitor) => `
            <article class="owner-analytics-visitor">
              <strong>Vizitator ${escapeHtml(String(visitor.id || "").toUpperCase())}</strong>
              <span>Ultima activitate: ${escapeHtml(formatDateTime(visitor.lastSeenAt))}</span>
              <span>${escapeHtml(String(visitor.visitCount || 0))} intrari, analytics intern activ</span>
            </article>
          `,
        )
        .join("")
    : '<p class="owner-analytics-empty">Lista ultimelor vizite va aparea aici dupa primele intrari.</p>';
}

async function hydrateOwnerAnalytics() {
  if (!CAN_USE_OWNER_API || !appState.owner.isAuthenticated) {
    appState.owner.analyticsSummary = null;
    renderOwnerAnalytics();
    return;
  }

  appState.owner.analyticsLoading = true;
  setStatus(ownerAnalyticsStatus, "Incarc analytics-ul site-ului...", "");

  try {
    const payload = await fetchJson("/api/analytics/summary");
    appState.owner.analyticsSummary = payload;
    renderOwnerAnalytics();
    setStatus(
      ownerAnalyticsStatus,
      payload?.storageMode === "memory"
        ? "Analytics activ, cu stocare temporara in memorie."
        : "Analytics actualizat.",
      "success",
    );
  } catch (error) {
    appState.owner.analyticsSummary = null;
    renderOwnerAnalytics();
    setStatus(ownerAnalyticsStatus, error.message || "Nu am putut incarca analytics-ul site-ului.", "error");
  } finally {
    appState.owner.analyticsLoading = false;
  }
}

function syncBookingSetupState() {
  if (!bookingSubmit || !bookingFormNote) {
    return;
  }

  const hasWhatsAppNumber = !!sanitizePhone(appState.settings.whatsappNumber);
  const hasServerEndpoint = CAN_USE_OWNER_API;
  bookingSubmit.disabled = !hasWhatsAppNumber || !hasServerEndpoint;
  bookingSubmit.setAttribute("aria-disabled", String(!hasWhatsAppNumber || !hasServerEndpoint));
  if (!hasServerEndpoint) {
    bookingFormNote.textContent = "Formularul de cazare este disponibil doar prin varianta securizata a site-ului.";
    return;
  }
  bookingFormNote.textContent = hasWhatsAppNumber
    ? `Se accepta doar sejururi de minimum ${MINIMUM_BOOKING_NIGHTS} nopti, iar datele ocupate sunt respinse automat din formular.`
    : "Momentan formularul nu poate fi trimis, pentru ca numarul WhatsApp nu este setat.";
}

function markBookingFormRendered() {
  if (!bookingRenderedAtField) {
    return;
  }
  appState.booking.formRenderedAt = Date.now();
  bookingRenderedAtField.value = String(appState.booking.formRenderedAt);
}

function resetBookingCaptcha() {
  if (bookingTurnstileField) {
    bookingTurnstileField.value = "";
  }
  if (window.turnstile && appState.booking.captchaWidgetId !== null) {
    try {
      window.turnstile.reset(appState.booking.captchaWidgetId);
    } catch {
      // CAPTCHA-ul este optional in lipsa configurarii complete.
    }
  }
}

function renderBookingTurnstile() {
  if (
    !bookingTurnstileContainer ||
    !appState.booking.captchaEnabled ||
    !appState.booking.captchaSiteKey ||
    !window.turnstile ||
    appState.booking.captchaWidgetId !== null
  ) {
    return;
  }

  bookingTurnstileContainer.hidden = false;
  appState.booking.captchaWidgetId = window.turnstile.render(bookingTurnstileContainer, {
    sitekey: appState.booking.captchaSiteKey,
    callback(token) {
      if (bookingTurnstileField) {
        bookingTurnstileField.value = token || "";
      }
    },
    "expired-callback"() {
      if (bookingTurnstileField) {
        bookingTurnstileField.value = "";
      }
    },
    "error-callback"() {
      if (bookingTurnstileField) {
        bookingTurnstileField.value = "";
      }
    },
  });
}

function loadBookingTurnstileScript() {
  if (window.turnstile) {
    renderBookingTurnstile();
    return;
  }
  if (appState.booking.captchaLoading) {
    return;
  }

  appState.booking.captchaLoading = true;
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  script.addEventListener("load", () => {
    appState.booking.captchaLoading = false;
    renderBookingTurnstile();
  });
  script.addEventListener("error", () => {
    appState.booking.captchaLoading = false;
    setStatus("booking-status", "Verificarea anti-spam nu a putut fi incarcata. Reincearca in cateva secunde.", "error");
  });
  document.head.appendChild(script);
}

async function hydrateBookingSecurityConfig() {
  markBookingFormRendered();
  if (!bookingForm || !CAN_USE_OWNER_API) {
    return;
  }

  try {
    const config = await fetchJson("/api/security-config");
    appState.booking.captchaEnabled = !!config?.captchaEnabled;
    appState.booking.captchaSiteKey = String(config?.captchaSiteKey || "").trim();
    if (appState.booking.captchaEnabled && appState.booking.captchaSiteKey) {
      loadBookingTurnstileScript();
    }
  } catch {
    appState.booking.captchaEnabled = false;
    appState.booking.captchaSiteKey = "";
  }
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  if (!bookingForm) {
    return;
  }

  const data = new FormData(bookingForm);
  const guestName = String(data.get("guestName") ?? "").trim();
  const guestPhone = String(data.get("guestPhone") ?? "").trim();
  const guestEmail = String(data.get("guestEmail") ?? "").trim();
  const accommodationId = String(data.get("accommodationId") ?? "").trim();
  const guestSelection = syncBookingGuestPicker({
    adults: data.get("adultCount"),
    children: data.get("childCount"),
  });
  const guestCount = formatGuestPartyLabel(guestSelection.adults, guestSelection.children);
  const checkIn = String(data.get("checkIn") ?? "").trim();
  const checkOut = String(data.get("checkOut") ?? "").trim();
  const whatsappNumber = sanitizePhone(appState.settings.whatsappNumber);
  const accommodation = getAccommodationById(accommodationId);

  if (!whatsappNumber) {
    setStatus("booking-status", "Momentan contactul pe WhatsApp nu este disponibil.", "error");
    return;
  }
  if (!guestName || !guestPhone || !guestCount) {
    setStatus("booking-status", "Completeaza numele, telefonul si numarul de oaspeti.", "error");
    return;
  }
  if (!bookingContactConsent?.checked) {
    setStatus(
      "booking-status",
      "Bifeaza acordul pentru prelucrarea datelor inainte de a trimite solicitarea.",
      "error",
    );
    bookingContactConsent?.focus();
    return;
  }
  if (!accommodation) {
    setStatus("booking-status", "Selecteaza o cazare valida pentru cerere.", "error");
    return;
  }
  if (!syncBookingDateFields({ report: true })) {
    return;
  }
  if (!isValidRange(checkIn, checkOut)) {
    setStatus("booking-status", "Intervalul ales nu este valid.", "error");
    return;
  }
  if (getNights(checkIn, checkOut) < MINIMUM_BOOKING_NIGHTS) {
    setStatus("booking-status", `Se accepta rezervari de minimum ${MINIMUM_BOOKING_NIGHTS} nopti.`, "error");
    return;
  }

  const conflicts = getConflicts(accommodationId, checkIn, checkOut);
  if (conflicts.length) {
    setStatus("booking-status", "Intervalul se suprapune cu o perioada deja marcata ocupata in calendar.", "error");
    return;
  }

  const requestPayload = {
    guestName,
    guestPhone,
    guestEmail,
    guestCount,
    checkIn,
    checkOut,
  };
  const consentAcceptedAt = new Date().toISOString();
  const renderedAt = Number(bookingRenderedAtField?.value || appState.booking.formRenderedAt || Date.now());
  const submittedAt = Date.now();
  const turnstileToken = String(bookingTurnstileField?.value || "").trim();

  if (appState.booking.captchaEnabled && !turnstileToken) {
    setStatus("booking-status", "Completeaza verificarea anti-spam inainte de trimitere.", "error");
    return;
  }

  bookingSubmit.disabled = true;
  bookingSubmit.setAttribute("aria-disabled", "true");
  setStatus("booking-status", "Validam cererea in mod securizat...", "");

  let bookingResponse;
  try {
    bookingResponse = await fetchJson("/api/booking-request", {
      method: "POST",
      body: JSON.stringify({
        ...requestPayload,
        accommodationId: accommodation.id,
        accommodationName: accommodation.name,
        adultCount: guestSelection.adults,
        childCount: guestSelection.children,
        contactConsentAccepted: true,
        contactConsentAcceptedAt: consentAcceptedAt,
        contactConsentPolicyVersion: VISITOR_POLICY_VERSION,
        website: String(data.get("website") ?? ""),
        formRenderedAt: renderedAt,
        submittedAt,
        submitElapsedMs: submittedAt - renderedAt,
        turnstileToken,
      }),
    });
  } catch (error) {
    resetBookingCaptcha();
    setStatus(
      "booking-status",
      error.message || "Nu am putut trimite cererea. Te rugam sa incerci din nou.",
      "error",
    );
    syncBookingSetupState();
    return;
  }

  if (!bookingResponse?.whatsappUrl) {
    resetBookingCaptcha();
    markBookingFormRendered();
    setStatus("booking-status", bookingResponse?.message || "Mesajul a fost primit.", "success");
    syncBookingSetupState();
    return;
  }

  const popup = window.open(bookingResponse.whatsappUrl, "_blank", "noopener,noreferrer");

  if (!popup) {
    window.location.href = bookingResponse.whatsappUrl;
  }

  setBookingGuestPickerOpen(false);
  void trackAnalyticsEvent("whatsapp_request");
  setStatus("booking-status", "Am deschis WhatsApp cu cererea completata.", "success");
  resetBookingCaptcha();
  markBookingFormRendered();
  syncBookingSetupState();
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
    appState.owner.usernameHint = String(payload?.ownerUsername || "").trim();
    appState.settings.whatsappNumber =
      sanitizePhone(payload?.whatsappNumber) || sanitizePhone(CONTACT_SETTINGS.whatsappNumber);
    appState.owner.pendingOperations = [];
    appState.owner.isSyncing = false;
    syncOwnerOverridesFromServer(payload?.overrides);
    scheduleOwnerDataRefresh();
  } catch {
    appState.owner.isAvailable = false;
  }

  syncBookingSetupState();
  syncOwnerContactForm();
  renderOwnerAccess();
  renderOwnerAnalytics();
  focusOwnerEntry();

  if (appState.owner.isAuthenticated) {
    void hydrateOwnerAnalytics();
  }
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
    appState.owner.usernameHint = String(payload?.ownerUsername || username).trim();
    appState.settings.whatsappNumber = sanitizePhone(payload?.whatsappNumber) || appState.settings.whatsappNumber;
    appState.owner.pendingOperations = [];
    appState.owner.isSyncing = false;
    syncOwnerOverridesFromServer(payload?.overrides);
    ownerLoginForm.reset();
    if (ownerContactForm) {
      ownerContactForm.reset();
    }
    if (ownerAccountForm) {
      ownerAccountForm.reset();
    }
    syncBookingSetupState();
    syncOwnerContactForm();
    setStatus(ownerLoginStatus, "Panoul proprietar este deschis.", "success");
    setStatus(ownerStatus, "", "");
    setStatus(ownerContactStatus, "", "");
    setStatus(ownerAccountStatus, "", "");
    scheduleOwnerDataRefresh();
    void hydrateOwnerAnalytics();
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
  appState.owner.pendingOperations = [];
  appState.owner.isSyncing = false;
  appState.owner.overrides = cloneOwnerOverrides(appState.owner.serverOverrides);
  renderOwnerAccess();
  setStatus(ownerLoginStatus, "", "");
  setStatus(ownerStatus, "", "");
  setStatus(ownerContactStatus, "", "");
  setStatus(ownerAccountStatus, "", "");
  appState.owner.analyticsSummary = null;
  renderOwnerAnalytics();
  setStatus(ownerAnalyticsStatus, "", "");
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

  const operation = {
    accommodationId: appState.owner.activeAccommodationId,
    date: isoDate,
    mode: appState.owner.activeMode,
  };

  applyOwnerOverrideChange(appState.owner.overrides, operation.accommodationId, operation.date, operation.mode);
  appState.owner.pendingOperations.push(operation);
  scheduleOwnerDataRefresh();
  setStatus(
    ownerStatus,
    appState.owner.pendingOperations.length > 1
      ? `Am marcat instant ziua. Sincronizez ${appState.owner.pendingOperations.length} modificari si pentru site-ul public...`
      : `${formatDate(isoDate)} se actualizeaza acum si in disponibilitatea publica...`,
    "",
  );
  void flushOwnerPendingOperations();
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

    appState.owner.usernameHint = String(payload?.ownerUsername || nextUsername).trim();
    appState.owner.isAuthenticated = true;
    appState.settings.whatsappNumber = sanitizePhone(payload?.whatsappNumber) || appState.settings.whatsappNumber;
    ownerAccountForm.reset();
    syncBookingSetupState();
    syncOwnerContactForm();
    syncOwnerAccountForm();
    syncOwnerLoginForm();
    setStatus(ownerAccountStatus, "Noile date de login au fost salvate.", "success");
    setStatus(ownerLoginStatus, "Credentialele active au fost actualizate.", "success");
  } catch (error) {
    setStatus(ownerAccountStatus, error.message || "Nu am putut actualiza datele de login.", "error");
  }
}

async function handleOwnerContactSubmit(event) {
  event.preventDefault();
  if (!ownerContactForm || !appState.owner.isAuthenticated) {
    return;
  }

  const data = new FormData(ownerContactForm);
  const whatsappNumber = String(data.get("ownerWhatsappNumber") ?? "").trim();

  try {
    const payload = await fetchJson("/api/contact-update", {
      method: "POST",
      body: JSON.stringify({
        whatsappNumber,
      }),
    });

    appState.settings.whatsappNumber = sanitizePhone(payload?.whatsappNumber);
    syncBookingSetupState();
    syncOwnerContactForm();
    setStatus(
      ownerContactStatus,
      appState.settings.whatsappNumber
        ? "Numarul WhatsApp public a fost salvat."
        : "Numarul WhatsApp a fost golit, iar formularul public a fost dezactivat.",
      "success",
    );
  } catch (error) {
    setStatus(ownerContactStatus, error.message || "Nu am putut salva numarul WhatsApp.", "error");
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

function resetScrollOnReload() {
  const shouldForceTop = window.__AFRODITI_RELOAD_SCROLL_TOP__ === true || getNavigationType() === "reload";
  if (!shouldForceTop) {
    return;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    replaceUrlWithoutHash();
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  scrollToTop();
  window.requestAnimationFrame(scrollToTop);
  window.setTimeout(scrollToTop, 140);
}

function updateScrolledHeader() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // ignoram lipsa sessionStorage
  }
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function hideIntroImmediately() {
  if (!introOverlay) {
    return;
  }

  introOverlay.hidden = true;
  introOverlay.classList.remove("is-leaving");
  body.classList.remove("intro-active");
  maybeOpenVisitorWelcome();
}

function finishIntro() {
  if (!introOverlay || introOverlay.classList.contains("is-leaving")) {
    return;
  }

  introOverlay.classList.add("is-leaving");
  body.classList.remove("intro-active");
  markIntroSeen();

  window.setTimeout(() => {
    introOverlay.hidden = true;
    maybeOpenVisitorWelcome();
  }, 760);
}

function initIntro() {
  if (!introOverlay) {
    return;
  }

  const skipIntro = new URLSearchParams(window.location.search).get("skipIntro") === "1";
  if (skipIntro) {
    hideIntroImmediately();
    return;
  }

  if (hasSeenIntro()) {
    hideIntroImmediately();
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minimumDelay = prefersReducedMotion ? 180 : COMPACT_AVAILABILITY.matches ? 820 : 1280;
  const maximumDelay = prefersReducedMotion ? 480 : COMPACT_AVAILABILITY.matches ? 1500 : 2100;
  const getTimestamp = () =>
    window.performance && typeof window.performance.now === "function"
      ? window.performance.now()
      : Date.now();

  body.classList.add("intro-active");

  const startedAt = getTimestamp();
  let minimumScheduled = false;

  const scheduleFinishAfterMinimum = () => {
    if (minimumScheduled) {
      return;
    }
    minimumScheduled = true;

    const elapsed = getTimestamp() - startedAt;
    const remainingDelay = Math.max(0, minimumDelay - elapsed);
    window.setTimeout(finishIntro, remainingDelay);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleFinishAfterMinimum, { once: true });
  } else {
    scheduleFinishAfterMinimum();
  }

  window.setTimeout(finishIntro, maximumDelay);
  window.addEventListener("pageshow", scheduleFinishAfterMinimum, { once: true });
}

function handleBackToTop(event) {
  event.preventDefault();
  closeMenu();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function scrollToHashTarget(hash, behavior = "smooth") {
  const targetId = String(hash ?? "").replace(/^#/, "").trim();
  if (!targetId) {
    return false;
  }

  const target = document.getElementById(targetId);
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  target.scrollIntoView({
    behavior,
    block: "start",
  });
  return true;
}

function handleSectionAnchorClick(event) {
  const link = event.currentTarget;
  if (!(link instanceof HTMLAnchorElement) || !isPlainLeftClick(event)) {
    return;
  }

  if (!link.hash || link.hash === "#page-top") {
    return;
  }

  const didScroll = scrollToHashTarget(link.hash);
  if (!didScroll) {
    return;
  }

  event.preventDefault();
  closeMenu();
  replaceUrlWithoutHash();
  window.requestAnimationFrame(syncSectionHighlights);
}

function applyRevealDelays() {
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
  });
}

function syncSectionHighlights() {
  if (!sectionHighlightLinks.length || !trackedSectionIds.length) {
    return;
  }

  const anchorLine = COMPACT_AVAILABILITY.matches ? 148 : 142;
  let activeId = trackedSectionIds[0];
  let nearestUpcomingId = trackedSectionIds[0];
  let nearestUpcomingOffset = Number.POSITIVE_INFINITY;

  trackedSectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!(section instanceof HTMLElement)) {
      return;
    }

    const rect = section.getBoundingClientRect();
    if (rect.top <= anchorLine && rect.bottom > anchorLine) {
      activeId = id;
    }

    if (rect.top > anchorLine && rect.top < nearestUpcomingOffset) {
      nearestUpcomingOffset = rect.top;
      nearestUpcomingId = id;
    }
  });

  const resolvedId = window.scrollY < 24 ? trackedSectionIds[0] : activeId || nearestUpcomingId;

  sectionHighlightLinks.forEach((link) => {
    const linkId = String(link.hash || "").replace(/^#/, "").trim();
    const isActive = linkId === resolvedId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
      return;
    }
    link.removeAttribute("aria-current");
  });
}

function initRevealObserver() {
  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top <= window.innerHeight * 0.92) {
      item.classList.add("is-visible");
    }
  });

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
    // Large stacked blocks like the mobile review board can stay below a high
    // intersection ratio for too long, so we reveal them as soon as they enter view.
    { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
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
  if (galleryProgress) {
    const bar = galleryProgress.querySelector("span");
    if (bar instanceof HTMLElement) {
      bar.style.width = total ? `${((galleryState.index + 1) / total) * 100}%` : "0%";
    }
  }
  if (galleryPrev) {
    galleryPrev.disabled = galleryState.index <= 0;
  }
  if (galleryNext) {
    galleryNext.disabled = galleryState.index >= total - 1;
  }
  if (galleryState.lightboxOpen) {
    updateGalleryLightbox();
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
  if (!galleryViewport || !galleryTrack || galleryState.lightboxOpen) {
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

function updateGalleryLightbox() {
  if (!galleryLightboxImage) {
    return;
  }

  const total = GALLERY_FILES.length;
  if (!total) {
    galleryLightboxImage.removeAttribute("src");
    galleryLightboxImage.alt = "";
    if (galleryLightboxCount) {
      galleryLightboxCount.textContent = "0 imagini";
    }
    if (galleryLightboxPrev) {
      galleryLightboxPrev.disabled = true;
    }
    if (galleryLightboxNext) {
      galleryLightboxNext.disabled = true;
    }
    return;
  }

  const safeIndex = clamp(galleryState.index, 0, total - 1);
  const file = GALLERY_FILES[safeIndex];
  galleryLightboxImage.src = `Images/${file}`;
  galleryLightboxImage.alt = getGalleryImageAlt(safeIndex);
  if (galleryLightboxCount) {
    galleryLightboxCount.textContent = `${safeIndex + 1} / ${total} imagini`;
  }
  if (galleryLightboxPrev) {
    galleryLightboxPrev.disabled = safeIndex <= 0;
  }
  if (galleryLightboxNext) {
    galleryLightboxNext.disabled = safeIndex >= total - 1;
  }
  warmGalleryLightboxNeighbors(safeIndex);
}

function openGalleryLightbox(index = galleryState.index, trigger = null) {
  if (!galleryLightbox || !galleryLightboxImage || !GALLERY_FILES.length) {
    return;
  }

  galleryState.index = clamp(index, 0, GALLERY_FILES.length - 1);
  galleryState.lightboxOpen = true;
  galleryState.lightboxAnimating = false;
  galleryState.pendingLightboxIndex = null;
  galleryState.lastTrigger =
    trigger instanceof HTMLElement
      ? trigger
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

  galleryLightbox.hidden = false;
  galleryLightbox.setAttribute("aria-hidden", "false");
  body.classList.add("gallery-lightbox-open");
  updateGalleryMeta();
  window.requestAnimationFrame(() => {
    scrollGalleryTo(galleryState.index, "auto");
    galleryLightboxClose?.focus();
  });
}

function closeGalleryLightbox() {
  if (!galleryLightbox || !galleryState.lightboxOpen) {
    return;
  }

  galleryState.lightboxOpen = false;
  galleryState.lightboxAnimating = false;
  galleryState.pendingLightboxIndex = null;
  galleryLightbox.hidden = true;
  galleryLightbox.setAttribute("aria-hidden", "true");
  body.classList.remove("gallery-lightbox-open");
  galleryLightboxImage?.classList.remove("is-transitioning");
  const focusTarget = galleryState.lastTrigger;
  galleryState.lastTrigger = null;
  if (focusTarget instanceof HTMLElement) {
    focusTarget.focus();
  }
}

function stepGalleryLightbox(step) {
  if (!galleryState.lightboxOpen || !GALLERY_FILES.length) {
    return;
  }

  const nextIndex = clamp(galleryState.index + step, 0, GALLERY_FILES.length - 1);
  if (nextIndex === galleryState.index) {
    updateGalleryLightbox();
    return;
  }

  if (galleryState.lightboxAnimating) {
    galleryState.pendingLightboxIndex = nextIndex;
    return;
  }

  void transitionGalleryLightboxTo(nextIndex);
}

async function transitionGalleryLightboxTo(nextIndex) {
  if (!galleryState.lightboxOpen || !galleryLightboxImage || !GALLERY_FILES.length) {
    return;
  }

  const safeIndex = clamp(nextIndex, 0, GALLERY_FILES.length - 1);
  if (safeIndex === galleryState.index) {
    updateGalleryLightbox();
    return;
  }

  galleryState.lightboxAnimating = true;
  galleryState.pendingLightboxIndex = null;

  await loadGalleryImage(safeIndex);

  if (!galleryState.lightboxOpen || !galleryLightboxImage) {
    galleryState.lightboxAnimating = false;
    return;
  }

  galleryLightboxImage.classList.add("is-transitioning");
  await waitForTimeout(150);

  if (!galleryState.lightboxOpen || !galleryLightboxImage) {
    galleryState.lightboxAnimating = false;
    return;
  }

  galleryState.index = safeIndex;
  updateGalleryMeta();
  scrollGalleryTo(safeIndex, "auto");

  window.requestAnimationFrame(() => {
    galleryLightboxImage.classList.remove("is-transitioning");
  });

  await waitForTimeout(240);
  galleryState.lightboxAnimating = false;

  if (
    galleryState.pendingLightboxIndex !== null &&
    galleryState.pendingLightboxIndex !== galleryState.index
  ) {
    const queuedIndex = galleryState.pendingLightboxIndex;
    galleryState.pendingLightboxIndex = null;
    void transitionGalleryLightboxTo(queuedIndex);
  }
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
  galleryViewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
  galleryViewport.addEventListener("scroll", handleGalleryScroll, { passive: true });
  galleryViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollGalleryTo(galleryState.index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollGalleryTo(galleryState.index + 1);
    }
  });
  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => scrollGalleryTo(galleryState.index - 1));
  }
  if (galleryNext) {
    galleryNext.addEventListener("click", () => scrollGalleryTo(galleryState.index + 1));
  }
  if (galleryTrack) {
    galleryTrack.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-gallery-open]") : null;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const nextIndex = Number(target.dataset.galleryOpen);
      if (!Number.isFinite(nextIndex)) {
        return;
      }

      openGalleryLightbox(nextIndex, target);
    });
  }
}

function initGalleryLightbox() {
  if (!galleryLightbox) {
    return;
  }

  galleryLightboxBackdrop?.addEventListener("click", closeGalleryLightbox);
  galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);
  galleryLightboxPrev?.addEventListener("click", () => stepGalleryLightbox(-1));
  galleryLightboxNext?.addEventListener("click", () => stepGalleryLightbox(1));
}

function initMobileQuickActions() {
  if (!mobileQuickActions || !siteFooter || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const isFooterVisible = entries.some((entry) => entry.isIntersecting);
      mobileQuickActions.classList.toggle("is-hidden", isFooterVisible);
    },
    {
      threshold: 0.08,
    },
  );

  observer.observe(siteFooter);
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
  sectionAnchorLinks.forEach((link) => link.addEventListener("click", handleSectionAnchorClick));
  backToTopLinks.forEach((link) => link.addEventListener("click", handleBackToTop));

  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }
  if (bookingAccommodationSelect) {
    bookingAccommodationSelect.addEventListener("change", () => {
      renderBookingAccommodationChoices();
      syncBookingGuestPicker();
      syncBookingDateFields();
    });
  }
  if (bookingAccommodationOptions) {
    bookingAccommodationOptions.addEventListener("click", (event) => {
      if (!(event.target instanceof Element) || !bookingAccommodationSelect) {
        return;
      }

      const button = event.target.closest("[data-accommodation-option]");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const nextAccommodationId = String(button.dataset.accommodationOption || "").trim();
      if (!nextAccommodationId || bookingAccommodationSelect.value === nextAccommodationId) {
        return;
      }

      bookingAccommodationSelect.value = nextAccommodationId;
      renderBookingAccommodationChoices();
      syncBookingGuestPicker();
      syncBookingDateFields();
    });
  }
  if (bookingCheckInField) {
    bookingCheckInField.addEventListener("change", () => {
      if (bookingCheckOutField && bookingCheckOutField.value) {
        const minimumCheckoutDate = addDays(bookingCheckInField.value, MINIMUM_BOOKING_NIGHTS);
        const currentCheckOutDate = parseDate(bookingCheckOutField.value);
        const minimumCheckOutDate = parseDate(minimumCheckoutDate);
        if (
          currentCheckOutDate &&
          minimumCheckOutDate &&
          currentCheckOutDate.getTime() < minimumCheckOutDate.getTime()
        ) {
          bookingCheckOutField.value = "";
        }
      }
      syncBookingDateFields({ report: true });
    });
  }
  if (bookingCheckOutField) {
    bookingCheckOutField.addEventListener("change", () => {
      syncBookingDateFields({ report: true });
    });
  }
  if (bookingContactConsent) {
    bookingContactConsent.addEventListener("change", () => {
      if (bookingContactConsent.checked) {
        setStatus("booking-status", "", "");
      }
    });
  }
  if (bookingGuestTrigger) {
    bookingGuestTrigger.addEventListener("click", () => {
      setBookingGuestPickerOpen(!appState.booking.guestPickerOpen);
    });
    bookingGuestTrigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setBookingGuestPickerOpen(true);
        bookingGuestPanel?.querySelector(".guest-picker-step:not(:disabled)")?.focus();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setBookingGuestPickerOpen(false);
      }
    });
  }
  if (bookingGuestPanel) {
    bookingGuestPanel.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const button = event.target.closest("[data-guest-field][data-guest-step]");
      if (!(button instanceof HTMLButtonElement) || button.disabled) {
        return;
      }

      const field = button.dataset.guestField;
      const step = Number(button.dataset.guestStep);
      const nextSelection = {
        adults: appState.booking.adults,
        children: appState.booking.children,
      };

      if (field === "adults") {
        nextSelection.adults += step;
      }
      if (field === "children") {
        nextSelection.children += step;
      }

      syncBookingGuestPicker(nextSelection);
      setStatus("booking-status", "", "");
    });
  }
  if (bookingGuestPicker) {
    document.addEventListener("click", (event) => {
      if (!appState.booking.guestPickerOpen) {
        return;
      }
      if (event.target instanceof Node && bookingGuestPicker.contains(event.target)) {
        return;
      }
      setBookingGuestPickerOpen(false);
    });
  }

  openTermsButtons.forEach((button) => {
    button.addEventListener("click", openTermsModal);
  });

  openPreferencesButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setVisitorModalOpen(true, { locked: false });
    });
  });

  if (visitorPreferencesClose) {
    visitorPreferencesClose.addEventListener("click", () => {
      if (!appState.visitor.modalLocked) {
        setVisitorModalOpen(false);
      }
    });
  }

  if (visitorBackdrop) {
    visitorBackdrop.addEventListener("click", () => {
      if (!appState.visitor.modalLocked) {
        setVisitorModalOpen(false);
      }
    });
  }

  if (siteTermsClose) {
    siteTermsClose.addEventListener("click", closeTermsModal);
  }

  if (termsBackdrop) {
    termsBackdrop.addEventListener("click", closeTermsModal);
  }

  if (visitorSavePreferences) {
    visitorSavePreferences.addEventListener("click", () => {
      if (!appState.visitor.modalLocked && appState.visitor.preferencesSaved && appState.visitor.analyticsEnabled) {
        setVisitorModalOpen(false);
        return;
      }
      void persistVisitorPreferences({
        analyticsEnabled: true,
        source: appState.visitor.modalLocked ? "welcome" : "manual",
      });
    });
  }

  if (visitorSaveEssential) {
    visitorSaveEssential.addEventListener("click", () => {
      if (!appState.visitor.modalLocked && appState.visitor.preferencesSaved && !appState.visitor.analyticsEnabled) {
        setVisitorModalOpen(false);
        return;
      }
      void persistVisitorPreferences({
        analyticsEnabled: false,
        source: appState.visitor.modalLocked ? "welcome-essential" : "manual-essential",
      });
    });
  }

  trackableLinks.forEach((link) => {
    link.addEventListener("click", () => {
      void trackAnalyticsEvent(link.dataset.analyticsEvent);
    });
  });

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

if (ownerContactForm) {
  ownerContactForm.addEventListener("submit", handleOwnerContactSubmit);
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

  if (availabilityOverview) {
    availabilityOverview.addEventListener("click", handleAvailabilityMonthChange);
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
      syncSectionHighlights();
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
    syncBookingGuestPicker();
  });
  window.addEventListener("orientationchange", () => {
    syncScene();
    window.requestAnimationFrame(() => scrollGalleryTo(galleryState.index, "auto"));
    syncBookingGuestPicker();
  });
  if (typeof COMPACT_AVAILABILITY.addEventListener === "function") {
    COMPACT_AVAILABILITY.addEventListener("change", renderAvailabilityOverview);
  } else if (typeof COMPACT_AVAILABILITY.addListener === "function") {
    COMPACT_AVAILABILITY.addListener(renderAvailabilityOverview);
  }
  window.addEventListener("keydown", (event) => {
    if (galleryState.lightboxOpen) {
      if (event.key === "Escape") {
        closeGalleryLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepGalleryLightbox(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepGalleryLightbox(1);
        return;
      }
    }
    if (event.key === "Escape" && appState.booking.guestPickerOpen) {
      setBookingGuestPickerOpen(false);
      bookingGuestTrigger?.focus();
      return;
    }
    if (event.key === "Escape" && !siteTermsModal?.hidden) {
      closeTermsModal();
      return;
    }
    if (event.key === "Escape" && appState.visitor.modalOpen && !appState.visitor.modalLocked) {
      setVisitorModalOpen(false);
      return;
    }
    if (event.key === "Escape" && appState.owner.panelOpen) {
      closeOwnerModal();
    }
  });
}

function initOptionalImages() {
  $$("[data-optional-image]").forEach((image) => {
    const shell = image.closest("[data-optional-image-shell]");
    if (!shell) {
      return;
    }

    const markReady = () => {
      shell.classList.add("is-ready");
      shell.classList.remove("is-missing");
    };

    const markMissing = () => {
      shell.classList.add("is-missing");
      shell.classList.remove("is-ready");
    };

    if (image.complete) {
      if (image.naturalWidth > 0) {
        markReady();
      } else {
        markMissing();
      }
      return;
    }

    image.addEventListener("load", markReady, { once: true });
    image.addEventListener("error", markMissing, { once: true });
  });
}

async function init() {
  resetScrollOnReload();
  initIntro();
  applyRevealDelays();
  renderGalleryCarousel();
  renderAmenities();
  renderReviews();
  renderStayPricing();
  renderAccommodationSelects();
  markBookingFormRendered();
  syncBookingSetupState();
  syncBookingDateFields({ keepStatus: true });
  renderRoomTypes();
  renderAvailabilityOverview();
  renderOwnerAccess();
  initRevealObserver();
  initGalleryCarousel();
  initGalleryLightbox();
  initMobileQuickActions();
  initOptionalImages();
  initEvents();
  updateScrolledHeader();
  syncSectionHighlights();
  updateSpiralScene();
  await Promise.all([hydrateVisitorState(), hydrateOwnerState(), hydrateBookingSecurityConfig()]);
  resetScrollOnReload();
}

init();
