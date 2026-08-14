import { Badge, Card, CardContent, Typography } from "@onesaz/ui";

const STATUS_COLOR = {
  draft: "normal",
  pending: "warning",
  pending_approval: "warning",
  approved: "success",
  rejected: "error",
  cancelled: "archived",
  requested: "info",
  accepted: "success",
  declined: "error",
};

export function StatusBadge({ status }) {
  return (
    <Badge color={STATUS_COLOR[status] || "normal"} variant="soft" className="capitalize">
      {String(status || "").replaceAll("_", " ")}
    </Badge>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <Typography variant="body2" className="text-muted-foreground">
          {label}
        </Typography>
        <Typography variant="h4" className="mt-2 font-semibold">
          {value}
        </Typography>
        {hint ? (
          <Typography variant="caption" className="mt-1 text-muted-foreground">
            {hint}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, children }) {
  return (
    <Card className="border-dashed border-border bg-card">
      <CardContent className="px-6 py-12 text-center">
        <Typography variant="h6">{title}</Typography>
        <div className="mt-3 text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <Typography variant="h3" className="font-bold tracking-tight !text-2xl sm:!text-3xl">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" className="mt-1 text-muted-foreground">
            {subtitle}
          </Typography>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function PaginationBar({ pagination, onPage, disabled }) {
  const page = Number(pagination?.page) || 1;
  const totalPages = Number(pagination?.totalPages) || 1;
  const total = Number(pagination?.total) || 0;
  if (totalPages <= 1 && total <= (pagination?.limit || 0)) return null;

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-[var(--app-muted)]">
        Page {page} of {totalPages}
        {total ? ` · ${total} total` : ""}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
