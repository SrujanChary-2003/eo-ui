import { Link } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
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
      {loading && <p className="text-slate-400">Loading events...</p>}

      {!loading && !events.length && (
        <EmptyState title="No events yet">
          Start with your celebration idea — pick services like photography or flower decoration, then choose vendors.
          <div className="mt-4">
            <Link to="/events/new"><Button>Create your first event</Button></Link>
          </div>
        </EmptyState>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="block rounded-2xl border border-white/10 bg-slate-900/50 p-5 transition hover:border-violet-500/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{event.title}</h2>
                <p className="mt-1 text-sm capitalize text-slate-400">
                  {String(event.eventType || "").replaceAll("_", " ")} · {event.location}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {event.eventDate ? new Date(event.eventDate).toLocaleString() : ""}
                </p>
              </div>
              <StatusBadge status={event.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
