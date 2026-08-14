import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { asArray, formatLabel, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";

export default function AdminEventsPage() {
  const { events, eventsPagination, error, loadEvents, reviewEvent } = useAdmin();
  const [status, setStatus] = useState("pending_approval");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadEvents({ status: status || undefined, page, limit: PAGE_SIZE });
  }, [loadEvents, status, page]);

  return (
    <div>
      <PageHeader title="Approve events" subtitle="Review customer event plans and vendor selections." />
      <div className="mb-6 flex flex-wrap gap-2">
        {["pending_approval", "approved", "rejected", ""].map((value) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/20 hover:text-foreground"
          >
            {value ? formatLabel(value) : "all"}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!asArray(events).length && <EmptyState title="Nothing here">No events match this filter.</EmptyState>}
      <div className="space-y-3">
        {asArray(events).map((event, index) => {
          const id = resourceId(event);
          return (
          <AppCard key={id || `event-${index}`} contentClassName="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Typography variant="h6">{event?.title || "Untitled event"}</Typography>
                <Typography variant="body2" className="capitalize text-muted-foreground">
                  {formatLabel(event?.eventType) || "Event"} · {event?.location || "Location TBA"}
                </Typography>
              </div>
              <StatusBadge status={event?.status} />
            </div>
            {event?.status === "pending_approval" && id && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => reviewEvent(id, true, "Approved")}>Approve</Button>
                <Button variant="secondary" onClick={() => reviewEvent(id, false, "Needs changes")}>Reject</Button>
              </div>
            )}
          </AppCard>
          );
        })}
      </div>
      <PaginationBar pagination={eventsPagination} onPage={setPage} />
    </div>
  );
}
