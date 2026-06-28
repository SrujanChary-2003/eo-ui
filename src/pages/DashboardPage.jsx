import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../APIs/dashboard/dashboard.api";
import Alert from "../components/ui/Alert";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user?.firstName}!
        </h1>
        <p className="mt-2 text-slate-400">
          Your EventSphere dashboard — manage events, bookings, and more.
        </p>
      </div>

      {error && <Alert message={error} />}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-400">Account</p>
          <p className="mt-1 text-lg font-semibold capitalize text-white">{user?.role}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-400">Email status</p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">Verified</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-400">Events</p>
          <p className="mt-1 text-lg font-semibold text-white">0</p>
        </div>
      </div>

      {dashboard && (
        <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-950/20 p-6">
          <p className="text-violet-300">{dashboard.welcomeMessage}</p>
          <p className="mt-2 text-sm text-slate-400">
            Protected route active — scope: {dashboard.accessibleParams?.scope}
          </p>
        </div>
      )}
    </div>
  );
}
