import { Link } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function EventsPage() {
  const { events, loading, error } = useEvents(true);

  return (
    <div>
      <PageHeader
        title="My Events"
        subtitle="Track drafts, approvals, and vendor selections."
        actions={<Link to="/events/new"><Button>Create event</Button></Link>}
      />

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {loading && <LoadingState label="Loading events..." />}

      {!loading && !events.length && (
        <EmptyState title="No events yet">
          Start with your celebration idea — pick services like photography or flower decoration, then choose vendors.
          <div className="mt-4">
            <Link to="/events/new"><Button>Create your first event</Button></Link>
          </div>
        </EmptyState>
      )}

      {!loading && (
        <div className="space-y-3">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="block">
              <AppCard className="hover:border-accent/40" contentClassName="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" className="mt-1 capitalize text-muted-foreground">
                      {String(event.eventType || "").replaceAll("_", " ")} · {event.location}
                    </Typography>
                    <Typography variant="caption" className="mt-1 text-muted-foreground">
                      {event.eventDate ? new Date(event.eventDate).toLocaleString() : ""}
                    </Typography>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
              </AppCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
