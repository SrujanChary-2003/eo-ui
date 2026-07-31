import { useEffect } from "react";
import { Typography } from "@onesaz/ui";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function AdminEventsPage() {
  const { events, error, loadEvents, reviewEvent } = useAdmin();

  useEffect(() => {
    loadEvents({ status: "pending_approval" });
  }, [loadEvents]);

  return (
    <div>
      <PageHeader title="Approve events" subtitle="Review customer event plans and vendor selections." />
      <div className="mb-6 flex flex-wrap gap-2">
        {["pending_approval", "approved", "rejected", ""].map((value) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => loadEvents(value ? { status: value } : {})}
            className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/20 hover:text-foreground"
          >
            {value ? value.replaceAll("_", " ") : "all"}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!events.length && <EmptyState title="Nothing here">No events match this filter.</EmptyState>}
      <div className="space-y-3">
        {events.map((event) => (
          <AppCard key={event.id} contentClassName="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" className="capitalize text-muted-foreground">
                  {String(event.eventType || "").replaceAll("_", " ")} · {event.location}
                </Typography>
              </div>
              <StatusBadge status={event.status} />
            </div>
            {event.status === "pending_approval" && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => reviewEvent(event.id, true, "Approved")}>Approve</Button>
                <Button variant="secondary" onClick={() => reviewEvent(event.id, false, "Needs changes")}>Reject</Button>
              </div>
            )}
          </AppCard>
        ))}
      </div>
    </div>
  );
}
