import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader, StatCard } from "../components/ui/PageBits";
import { DASHBOARD_COPY, QUICK_LINKS, STAT_CONFIG } from "../constants";

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, stats, loading, error } = useDashboard();
  const role = user?.role || "customer";
  const copy = DASHBOARD_COPY[role] || DASHBOARD_COPY.customer;
  const statsConfig = STAT_CONFIG[role] || STAT_CONFIG.customer;
  const quickLinks = QUICK_LINKS[role] || QUICK_LINKS.customer;

  if (loading && !dashboard) {
    return <LoadingState label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={copy.title(user?.firstName || "there")}
        subtitle={copy.subtitle}
        actions={
          <Link to={copy.actionTo}>
            <Button>{copy.actionLabel}</Button>
          </Link>
        }
      />

      {error && <Alert message={error} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={stats?.[item.key] ?? item.fallback}
          />
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--app-muted)]">
          Quick links
        </h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5 text-sm text-[var(--app-text-secondary)] transition hover:border-[var(--app-accent)]/40 hover:text-[var(--app-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
