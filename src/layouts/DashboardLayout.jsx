import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavIcon } from "../components/navigation/icons";
import TopNavbar from "../components/navigation/TopNavbar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import {
  ADMIN_SETTINGS_LINKS,
  APP_NAME,
  APP_SHORT_NAME,
  NAV_LINKS,
} from "../constants";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = useMemo(() => NAV_LINKS[user?.role] || NAV_LINKS.customer, [user?.role]);
  const isAdmin = user?.role === "admin";
  const settingsActive = ADMIN_SETTINGS_LINKS.some((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    if (settingsActive) setSettingsOpen(true);
  }, [settingsActive]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setLogoutOpen(false);
      navigate("/signin");
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleSidebar = () => setOpen((v) => !v);

  return (
    <div className="app-shell">
      <div className="relative flex min-h-screen">
        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`app-sidebar fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r transition-all duration-300 lg:sticky ${
            open
              ? "w-60 translate-x-0"
              : "w-60 -translate-x-full lg:w-[4.5rem] lg:translate-x-0"
          }`}
        >
          <div
            className={`flex border-b border-[var(--app-border)] ${
              open
                ? "items-center justify-between gap-2 px-3 py-4"
                : "flex-col items-center gap-2 px-2 py-3"
            }`}
          >
            <NavLink
              to="/dashboard"
              className={`flex min-w-0 items-center ${open ? "gap-2.5" : "justify-center"}`}
              onClick={() => {
                if (window.innerWidth < 1024) setOpen(false);
              }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-accent)] text-sm font-bold text-white shadow-lg">
                {APP_SHORT_NAME}
              </span>
              {open && (
                <span className="truncate text-base font-semibold tracking-tight text-[var(--app-text)]">
                  {APP_NAME}
                </span>
              )}
            </NavLink>

            {open ? (
              <button
                type="button"
                onClick={toggleSidebar}
                className="app-icon-btn hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg lg:inline-flex"
                aria-label="Collapse sidebar"
              >
                <NavIcon name="sidebarClose" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleSidebar}
                className="app-icon-btn hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:inline-flex"
                aria-label="Expand sidebar"
              >
                <NavIcon name="sidebarOpen" className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                title={link.label}
                onClick={() => {
                  if (window.innerWidth < 1024) setOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive ? "app-nav-item-active" : "app-nav-item"
                  } ${open ? "" : "justify-center px-0"}`
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
                  } ${open ? "" : "justify-center px-0"}`}
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
                  <div className="ml-4 mt-1 space-y-1 border-l border-[var(--app-border)] pl-2">
                    {ADMIN_SETTINGS_LINKS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        title={item.label}
                        onClick={() => {
                          if (window.innerWidth < 1024) setOpen(false);
                        }}
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
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            user={user}
            sidebarOpen={open}
            onToggleSidebar={toggleSidebar}
            onLogout={() => setLogoutOpen(true)}
          />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        message="Are you sure you want to log out of EventSphere?"
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        confirmVariant="destructive"
        loading={loggingOut}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
