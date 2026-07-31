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
