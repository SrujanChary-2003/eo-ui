export function StatusBadge({ status }) {
  const styles = {
    draft: "bg-[var(--app-surface-muted)] text-[var(--app-muted)]",
    pending: "bg-amber-500/15 text-amber-600",
    pending_approval: "bg-amber-500/15 text-amber-600",
    approved: "bg-emerald-500/15 text-emerald-600",
    rejected: "bg-rose-500/15 text-rose-600",
    cancelled: "bg-[var(--app-surface-muted)] text-[var(--app-faint)]",
    requested: "bg-sky-500/15 text-sky-600",
    accepted: "bg-emerald-500/15 text-emerald-600",
    declined: "bg-rose-500/15 text-rose-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || styles.draft}`}
    >
      {String(status || "").replaceAll("_", " ")}
    </span>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="app-card rounded-2xl p-5">
      <p className="text-sm text-[var(--app-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--app-text)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--app-faint)]">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="app-card rounded-2xl border-dashed px-6 py-12 text-center">
      <p className="text-lg font-medium text-[var(--app-text)]">{title}</p>
      <div className="mt-3 text-sm text-[var(--app-muted)]">{children}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--app-text)] sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--app-muted)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
