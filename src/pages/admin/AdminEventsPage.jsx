import { useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
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
            className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-violet-500/20"
          >
            {value ? value.replaceAll("_", " ") : "all"}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!events.length && <EmptyState title="Nothing here">No events match this filter.</EmptyState>}
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{event.title}</h2>
                <p className="text-sm capitalize text-slate-400">
                  {String(event.eventType || "").replaceAll("_", " ")} · {event.location}
                </p>
              </div>
              <StatusBadge status={event.status} />
            </div>
            {event.status === "pending_approval" && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => reviewEvent(event.id, true, "Approved")}>Approve</Button>
                <Button variant="secondary" onClick={() => reviewEvent(event.id, false, "Needs changes")}>Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
