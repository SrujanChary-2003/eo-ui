import { Link, Outlet } from "react-router-dom";
import ThemeControls from "../components/theme/ThemeControls";
import Button from "../components/ui/Button";
import { APP_NAME, APP_SHORT_NAME } from "../constants";

export default function PublicLayout() {
  return (
    <div className="app-shell min-h-screen">
      <header className="app-navbar sticky top-0 z-50 w-full border-b">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <Link to="/" className="flex min-w-0 items-center gap-2 justify-self-start sm:gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-accent)] text-sm font-bold text-white">
              {APP_SHORT_NAME}
            </span>
            <span className="truncate text-base font-semibold tracking-tight text-[var(--app-text)] sm:text-lg">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-6 text-sm text-[var(--app-muted)] md:flex lg:gap-8">
            <a href="#features" className="whitespace-nowrap transition hover:text-[var(--app-text)]">
              Features
            </a>
            <a href="#how-it-works" className="whitespace-nowrap transition hover:text-[var(--app-text)]">
              How it works
            </a>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 justify-self-end sm:gap-3">
            <ThemeControls />
            <Link
              to="/signin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)] sm:inline"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <Button className="!px-3 !py-2 text-sm sm:!px-4">Get started</Button>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
