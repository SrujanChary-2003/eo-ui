import { NavIcon } from "./icons";
import { useTheme } from "../../context/ThemeContext";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "system" },
];

export default function TopNavbar({ user, sidebarOpen, onToggleSidebar, onLogout }) {
  const { mode, setMode, resolved } = useTheme();

  return (
    <header className="app-navbar sticky top-0 z-30 border-b px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="app-icon-btn inline-flex h-10 w-10 items-center justify-center rounded-xl"
          aria-label="Toggle sidebar"
        >
          <NavIcon name={sidebarOpen ? "sidebarClose" : "sidebarOpen"} className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 md:block">
          <div className="relative max-w-md">
            <NavIcon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-faint)]" />
            <input
              className="app-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]"
              placeholder="Search events, vendors, bookings..."
              readOnly
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-1 lg:flex">
            {THEME_OPTIONS.map((option) => {
              const active = mode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                      : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  }`}
                  title={option.label}
                >
                  <NavIcon name={option.icon} className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 lg:hidden">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                  mode === option.value ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-text)]" : "text-[var(--app-muted)]"
                }`}
                aria-label={option.label}
              >
                <NavIcon name={option.icon} className="h-4 w-4" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="app-icon-btn relative inline-flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="Notifications"
          >
            <NavIcon name="bell" className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-fuchsia-500" />
          </button>

          <div className="hidden items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
              {(user?.firstName || "U").slice(0, 1)}
              {(user?.lastName || "").slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--app-text)]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[11px] capitalize text-[var(--app-muted)]">
                {user?.role} · {resolved} mode
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="app-icon-btn inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm"
          >
            <NavIcon name="logout" className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 md:hidden">
        <div className="relative flex-1">
          <NavIcon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-faint)]" />
          <input
            className="app-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none"
            placeholder="Search..."
            readOnly
          />
        </div>
        <span className="app-chip inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium">
          <NavIcon name="sparkles" className="h-3.5 w-3.5" />
          Live
        </span>
      </div>
    </header>
  );
}
