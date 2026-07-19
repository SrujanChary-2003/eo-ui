import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavIcon } from "../components/navigation/icons";
import TopNavbar from "../components/navigation/TopNavbar";

const NAV = {
  customer: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/events", label: "My Events", icon: "events" },
    { to: "/vendors", label: "Find Vendors", icon: "vendors" },
  ],
  vendor: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/vendor/profile", label: "Business Profile", icon: "profile" },
    { to: "/vendor/services", label: "My Services", icon: "services" },
    { to: "/vendor/bookings", label: "Bookings", icon: "bookings" },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: "overview" },
    { to: "/admin/users", label: "Users", icon: "users" },
  ],
};

const ADMIN_SETTINGS = [
  { to: "/admin/events", label: "Approve Events", icon: "approveEvents" },
  { to: "/admin/vendors", label: "Approve Vendors", icon: "approveVendors" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const links = useMemo(() => NAV[user?.role] || NAV.customer, [user?.role]);
  const isAdmin = user?.role === "admin";
  const settingsActive = ADMIN_SETTINGS.some((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    if (settingsActive) setSettingsOpen(true);
  }, [settingsActive]);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="app-shell">
      <div className="flex min-h-screen">
        <aside
          className={`app-sidebar sticky top-0 z-40 flex h-screen flex-col border-r transition-all ${
            open ? "w-64" : "w-[4.5rem]"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--app-border)] px-3 py-4">
            <NavLink to="/dashboard" className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                ES
              </span>
              {open && (
                <span className="truncate text-lg font-semibold tracking-tight text-[var(--app-text)]">
                  EventSphere
                </span>
              )}
            </NavLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="app-icon-btn hidden h-9 w-9 items-center justify-center rounded-lg lg:inline-flex"
              aria-label="Collapse sidebar"
            >
              <NavIcon name={open ? "sidebarClose" : "sidebarOpen"} className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                title={link.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive ? "app-nav-item-active" : "app-nav-item"
                  } ${open ? "" : "justify-center"}`
                }
              >
                <NavIcon name={link.icon} className="h-5 w-5 shrink-0" />
                {open && <span className="truncate">{link.label}</span>}
              </NavLink>
            ))}

            {isAdmin && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!open) {
                      setOpen(true);
                      setSettingsOpen(true);
                      return;
                    }
                    setSettingsOpen((v) => !v);
                  }}
                  title="Settings"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    settingsActive ? "app-nav-item-active" : "app-nav-item"
                  } ${open ? "" : "justify-center"}`}
                >
                  <NavIcon name="settings" className="h-5 w-5 shrink-0" />
                  {open && (
                    <>
                      <span className="flex-1 truncate text-left">Settings</span>
                      <NavIcon
                        name="chevronDown"
                        className={`h-4 w-4 transition ${settingsOpen ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>

                {open && settingsOpen && (
                  <div className="mt-1 space-y-1 border-l border-[var(--app-border)] ml-4 pl-2">
                    {ADMIN_SETTINGS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        title={item.label}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                            isActive ? "app-nav-item-active" : "app-nav-item"
                          }`
                        }
                      >
                        <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="border-t border-[var(--app-border)] p-3">
            {open ? (
              <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3">
                <p className="truncate text-sm font-medium text-[var(--app-text)]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs capitalize text-[var(--app-accent-text)]">{user?.role}</p>
              </div>
            ) : (
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                {(user?.firstName || "U").slice(0, 1)}
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            user={user}
            sidebarOpen={open}
            onToggleSidebar={() => setOpen((v) => !v)}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
