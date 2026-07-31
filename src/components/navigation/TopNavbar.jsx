import { Link } from "react-router-dom";
import { Avatar } from "@onesaz/ui";
import { NavIcon } from "./icons";
import ThemeControls from "../theme/ThemeControls";
import { mediaUrl } from "../../utils/mediaUrl";

export default function TopNavbar({ user, sidebarOpen, onToggleSidebar, onLogout }) {
  const initials = `${(user?.firstName || "U").slice(0, 1)}${(user?.lastName || "").slice(0, 1)}`;

  return (
    <header className="app-navbar sticky top-0 z-30 border-b px-3 py-2.5 sm:px-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="app-icon-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <NavIcon name={sidebarOpen ? "sidebarClose" : "sidebarOpen"} className="h-4.5 w-4.5" />
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeControls />

          <Link
            to="/profile"
            className="inline-flex rounded-full ring-2 ring-[var(--app-border)] transition hover:ring-[var(--app-accent)]"
            aria-label="Profile"
            title="Profile"
          >
            <Avatar
              src={mediaUrl(user?.avatarUrl)}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              fallback={initials}
              size="sm"
            />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="app-icon-btn inline-flex h-9 w-9 items-center justify-center rounded-xl"
            aria-label="Logout"
            title="Logout"
          >
            <NavIcon name="logout" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
