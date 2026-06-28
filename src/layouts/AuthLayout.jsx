import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
              ES
            </span>
            <span className="text-xl font-semibold">EventSphere</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
