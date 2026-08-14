import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";
import { useGlobalLoading } from "../../hooks/useGlobalLoading";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";
import { toastError, toastSuccess } from "../../utils/toast";
import NotFoundPage from "../NotFoundPage";
import { asArray, formatDate, formatLabel, resourceId } from "../../utils/safe";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { current: event, detailLoading, error, loadEvent, update, remove } = useEvents(false);
  const [actionError, setActionError] = useState("");
  const [acting, setActing] = useState(false);

  useGlobalLoading(detailLoading || acting, detailLoading ? "Loading event..." : "Updating event...");

  useEffect(() => {
    if (eventId) loadEvent(eventId);
  }, [eventId, loadEvent]);

  const submit = async () => {
    setActionError("");
    setActing(true);
    try {
      await update(eventId, { submit: true });
      toastSuccess("Submitted for admin approval");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setActionError(msg);
      toastError(msg);
    } finally {
      setActing(false);
    }
  };

  const onDelete = async () => {
    setActionError("");
    setActing(true);
    try {
      await remove(eventId);
      toastSuccess("Event deleted");
      navigate("/events");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setActionError(msg);
      toastError(msg);
    } finally {
      setActing(false);
    }
  };

  if (detailLoading) {
    return <LoadingState label="Loading event..." />;
  }

  if (!event) {
    return (
      <NotFoundPage
        embedded
        title="Event not found"
        subtitle="This event may have been removed, or you may not have access. Go back, refresh, or return home."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={event.title || "Untitled event"}
        subtitle={`${formatLabel(event.eventType) || "Event"} · ${event.location || "Location TBA"}`}
        actions={<StatusBadge status={event.status} />}
      />

      {(actionError || error) && (
        <div className="mb-4">
          <Alert message={actionError || error} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <AppCard className="lg:col-span-2" contentClassName="space-y-4 p-6">
          <Typography variant="body1" className="text-muted-foreground">
            {event.description || "No description"}
          </Typography>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="text-foreground">{formatDate(event.eventDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">City</p>
              <p className="text-foreground">{event.city || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guests</p>
              <p className="text-foreground">{event.guestCount || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget</p>
              <p className="text-foreground">₹{event.budget || 0}</p>
            </div>
          </div>
          {event.adminNote && (
            <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">
              Admin note: {event.adminNote}
            </p>
          )}
        </AppCard>

        <AppCard contentClassName="p-6">
          <Typography variant="h6">Selected vendors</Typography>
          <ul className="mt-3 space-y-3">
            {asArray(event.selectedVendors).map((sv, index) => (
              <li key={resourceId(sv, sv?.service, `sv-${index}`)} className="rounded-xl border border-border p-3 text-sm">
                <Typography variant="body2" className="capitalize text-foreground">
                  {formatLabel(sv?.category) || "Service"}
                </Typography>
                <StatusBadge status={sv?.status} />
              </li>
            ))}
            {!asArray(event.selectedVendors).length && (
              <p className="text-sm text-muted-foreground">None selected</p>
            )}
          </ul>

          {user?.role === "customer" && (
            <div className="mt-6 space-y-2">
              {["draft", "rejected"].includes(event.status || "") && (
                <>
                  <Button className="w-full" onClick={submit} loading={acting}>
                    Submit for approval
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={onDelete} disabled={acting}>
                    Delete
                  </Button>
                </>
              )}
              <Link to="/events">
                <Button variant="secondary" className="w-full">
                  Back to events
                </Button>
              </Link>
            </div>
          )}
        </AppCard>
      </div>
    </div>
  );
}
