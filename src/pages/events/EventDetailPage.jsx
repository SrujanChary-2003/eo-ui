import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { current: event, loadEvent, update, remove } = useEvents(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEvent(eventId);
  }, [eventId, loadEvent]);

  const submit = async () => {
    try {
      await update(eventId, { submit: true });
      setMessage("Submitted for admin approval");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const onDelete = async () => {
    try {
      await remove(eventId);
      navigate("/events");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (!event && !error) return <p className="text-slate-400">Loading...</p>;
  if (!event) return <Alert message={error || "Event not found"} />;

  return (
    <div>
      <PageHeader
        title={event.title}
        subtitle={`${String(event.eventType || "").replaceAll("_", " ")} · ${event.location}`}
        actions={<StatusBadge status={event.status} />}
      />

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {message && <div className="mb-4"><Alert type="success" message={message} /></div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 lg:col-span-2">
          <p className="text-slate-300">{event.description || "No description"}</p>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div><p className="text-slate-500">Date</p><p>{new Date(event.eventDate).toLocaleString()}</p></div>
            <div><p className="text-slate-500">City</p><p>{event.city || "—"}</p></div>
            <div><p className="text-slate-500">Guests</p><p>{event.guestCount || 0}</p></div>
            <div><p className="text-slate-500">Budget</p><p>₹{event.budget || 0}</p></div>
          </div>
          {event.adminNote && (
            <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-200">Admin note: {event.adminNote}</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <h3 className="font-semibold text-white">Selected vendors</h3>
          <ul className="mt-3 space-y-3">
            {(event.selectedVendors || []).map((sv) => (
              <li key={sv._id || sv.service} className="rounded-xl border border-white/5 p-3 text-sm">
                <p className="capitalize text-slate-200">{sv.category?.replaceAll("_", " ")}</p>
                <StatusBadge status={sv.status} />
              </li>
            ))}
            {!event.selectedVendors?.length && <p className="text-sm text-slate-500">None selected</p>}
          </ul>

          {user?.role === "customer" && (
            <div className="mt-6 space-y-2">
              {["draft", "rejected"].includes(event.status) && (
                <>
                  <Button className="w-full" onClick={submit}>Submit for approval</Button>
                  <Button variant="ghost" className="w-full" onClick={onDelete}>Delete</Button>
                </>
              )}
              <Link to="/events"><Button variant="secondary" className="w-full">Back to events</Button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
