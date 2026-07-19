import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { PageHeader, StatCard } from "../components/ui/PageBits";

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, stats, error } = useDashboard();

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName}!`}
        subtitle="Plan events, pick vendors, and keep everything moving in one place."
        actions={
          user?.role === "customer" ? (
            <Link to="/events/new"><Button>Create event</Button></Link>
          ) : user?.role === "vendor" ? (
            <Link to="/vendor/services"><Button>Add service</Button></Link>
          ) : (
            <Link to="/admin/events"><Button>Review events</Button></Link>
          )
        }
      />

      {error && <div className="mb-6"><Alert message={error} /></div>}

      {user?.role === "customer" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total events" value={stats.totalEvents ?? 0} />
          <StatCard label="Drafts" value={stats.draft ?? 0} />
          <StatCard label="Pending approval" value={stats.pending ?? 0} />
          <StatCard label="Approved" value={stats.approved ?? 0} />
        </div>
      )}

      {user?.role === "vendor" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Services" value={stats.services ?? 0} />
          <StatCard label="Bookings" value={stats.bookings ?? 0} />
          <StatCard label="Pending requests" value={stats.pendingRequests ?? 0} />
          <StatCard label="Approval" value={stats.approvalStatus || "pending"} />
        </div>
      )}

      {user?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Users" value={stats.users ?? 0} />
          <StatCard label="Vendors pending" value={stats.vendorsPending ?? 0} />
          <StatCard label="Events pending" value={stats.eventsPending ?? 0} />
          <StatCard label="Events approved" value={stats.eventsApproved ?? 0} />
        </div>
      )}

      {dashboard?.welcomeMessage && (
        <div className="app-card mt-8 rounded-2xl border-[var(--app-accent)]/20 p-6">
          <p className="text-[var(--app-accent-text)]">{dashboard.welcomeMessage}</p>
        </div>
      )}
    </div>
  );
}
