import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
              ES
            </span>
            <span className="text-lg font-semibold tracking-tight">EventSphere</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#events" className="transition hover:text-white">Events</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
