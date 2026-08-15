export const APP_NAME = "EventSphere";
export const APP_SHORT_NAME = "ES";
export const APP_TAGLINE = "Plan events, book vendors, celebrate.";

export const PAGE_SIZE = 12;
export const IDLE_TIMEOUT_MINUTES = 30;

export const STORAGE_KEYS = {
  THEME_MODE: "eo-theme-mode",
  ACCENT_COLOR: "eo-accent-color",
  ONESAZ_THEME: "eo-onesaz-theme",
};

export const THEME_MODES = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "system" },
];

export const DEFAULT_THEME_MODE = "system";
export const DEFAULT_ACCENT = "violet";

export const ACCENT_OPTIONS = [
  { value: "violet", label: "Violet", swatch: "#7c3aed" },
  { value: "purple", label: "Purple", swatch: "#9333ea" },
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "cyan", label: "Cyan", swatch: "#0891b2" },
  { value: "teal", label: "Teal", swatch: "#0d9488" },
  { value: "green", label: "Green", swatch: "#16a34a" },
  { value: "orange", label: "Orange", swatch: "#ea580c" },
  { value: "pink", label: "Pink", swatch: "#db2777" },
  { value: "red", label: "Red", swatch: "#dc2626" },
];

export const ACCENT_HEX = Object.fromEntries(
  ACCENT_OPTIONS.map((item) => [item.value, item.swatch])
);

export const ROLE_LABELS = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

export const NAV_LINKS = {
  customer: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/events", label: "My Events", icon: "events" },
    { to: "/vendors", label: "Find Vendors", icon: "vendors" },
    { to: "/profile", label: "Profile", icon: "profile" },
  ],
  vendor: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/profile", label: "My Profile", icon: "profile" },
    { to: "/vendor/profile", label: "Business", icon: "services" },
    { to: "/vendor/services", label: "Services", icon: "services" },
    { to: "/vendor/bookings", label: "Bookings", icon: "bookings" },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/profile", label: "Profile", icon: "profile" },
    { to: "/admin/users", label: "Users", icon: "users" },
  ],
};

export const ADMIN_SETTINGS_LINKS = [
  { to: "/admin/events", label: "Approve Events", icon: "approveEvents" },
  { to: "/admin/vendors", label: "Approve Vendors", icon: "approveVendors" },
];

export const LANDING_FEATURES = [
  {
    title: "Plan any event",
    description: "Weddings, birthdays, corporate gatherings — structured end to end.",
  },
  {
    title: "Book trusted vendors",
    description: "Browse verified vendors, compare services, and request bookings.",
  },
  {
    title: "Track everything",
    description: "Approvals, schedules, and bookings stay in one clear workspace.",
  },
];

export const LANDING_STEPS = [
  { step: "01", title: "Create your event", desc: "Set date, location, and type in minutes." },
  { step: "02", title: "Choose vendors", desc: "Filter by service and send booking requests." },
  { step: "03", title: "Confirm and celebrate", desc: "Track status and keep plans moving." },
];

export const EVENT_TYPE_CHIPS = [
  "Weddings",
  "Birthdays",
  "Engagements",
  "Corporate",
  "House Warming",
  "Custom",
];

export const DASHBOARD_COPY = {
  customer: {
    title: (name) => `Welcome, ${name}`,
    subtitle: "Plan events, pick vendors, and keep everything in one place.",
    actionLabel: "Create event",
    actionTo: "/events/new",
  },
  vendor: {
    title: (name) => `Welcome, ${name}`,
    subtitle: "Manage services, bookings, and your business profile.",
    actionLabel: "Add service",
    actionTo: "/vendor/services",
  },
  admin: {
    title: (name) => `Welcome, ${name}`,
    subtitle: "Review users, events, and vendor approvals.",
    actionLabel: "Review events",
    actionTo: "/admin/events",
  },
};

export const STAT_CONFIG = {
  customer: [
    { key: "totalEvents", label: "Total events", fallback: 0 },
    { key: "draft", label: "Drafts", fallback: 0 },
    { key: "pending", label: "Pending", fallback: 0 },
    { key: "approved", label: "Approved", fallback: 0 },
  ],
  vendor: [
    { key: "services", label: "Services", fallback: 0 },
    { key: "bookings", label: "Bookings", fallback: 0 },
    { key: "pendingRequests", label: "Pending", fallback: 0 },
    { key: "approvalStatus", label: "Approval", fallback: "pending" },
  ],
  admin: [
    { key: "users", label: "Users", fallback: 0 },
    { key: "vendorsPending", label: "Vendors pending", fallback: 0 },
    { key: "eventsPending", label: "Events pending", fallback: 0 },
    { key: "eventsApproved", label: "Events approved", fallback: 0 },
  ],
};

export const QUICK_LINKS = {
  customer: [
    { to: "/events", label: "My events" },
    { to: "/vendors", label: "Find vendors" },
    { to: "/profile", label: "Profile" },
  ],
  vendor: [
    { to: "/vendor/bookings", label: "Bookings" },
    { to: "/vendor/services", label: "Services" },
    { to: "/vendor/profile", label: "Business profile" },
  ],
  admin: [
    { to: "/admin/events", label: "Events" },
    { to: "/admin/vendors", label: "Vendors" },
    { to: "/admin/users", label: "Users" },
  ],
};
