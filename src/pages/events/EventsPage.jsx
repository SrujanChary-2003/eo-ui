import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { asArray, formatDate, formatLabel, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";

export default function EventsPage() {
  const { events, pagination, loading, error, loadEvents } = useEvents(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadEvents({ page, limit: PAGE_SIZE });
  }, [page, loadEvents]);

  return (
    <div>
      <PageHeader
        title="My Events"
        subtitle="Track drafts, approvals, and vendor selections."
        actions={<Link to="/events/new"><Button>Create event</Button></Link>}
      />

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {loading && <LoadingState label="Loading events..." />}

      {!loading && !asArray(events).length && (
        <EmptyState title="No events yet">
          Start with your celebration idea — pick services like photography or flower decoration, then choose vendors.
          <div className="mt-4">
            <Link to="/events/new"><Button>Create your first event</Button></Link>
          </div>
        </EmptyState>
      )}

      {!loading && (
        <div className="space-y-3">
          {asArray(events).map((event, index) => {
            const id = resourceId(event);
            const card = (
              <AppCard className="hover:border-accent/40" contentClassName="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Typography variant="h6">{event?.title || "Untitled event"}</Typography>
                    <Typography variant="body2" className="mt-1 capitalize text-muted-foreground">
                      {formatLabel(event?.eventType) || "Event"} · {event?.location || "Location TBA"}
                    </Typography>
                    <Typography variant="caption" className="mt-1 text-muted-foreground">
                      {formatDate(event?.eventDate)}
                    </Typography>
                  </div>
                  <StatusBadge status={event?.status} />
                </div>
              </AppCard>
            );
            if (!id) {
              return <div key={`event-${index}`}>{card}</div>;
            }
            return (
            <Link key={id} to={`/events/${id}`} className="block">
              {card}
            </Link>
            );
          })}
        </div>
      )}
      <PaginationBar pagination={pagination} onPage={setPage} disabled={loading} />
    </div>
  );
}
