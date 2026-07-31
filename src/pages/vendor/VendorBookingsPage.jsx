import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function VendorBookingsPage() {
  const { bookings, loadBookings, respondBooking } = useVendorWorkspace();
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const respond = async (id, accept) => {
    try {
      await respondBooking(id, accept);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Requests from customer events that selected your services." />
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!bookings.length && <EmptyState title="No bookings yet">When customers pick your services, requests show up here.</EmptyState>}

      <div className="space-y-4">
        {bookings.map((item) => (
          <AppCard key={item.event.id} contentClassName="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Typography variant="h6">{item.event.title}</Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {item.customer?.firstName} {item.customer?.lastName} · {item.event.location}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {new Date(item.event.eventDate).toLocaleString()}
                </Typography>
              </div>
              <StatusBadge status={item.event.status} />
            </div>
            <div className="mt-4 space-y-2">
              {(item.mySelections || []).map((sel) => (
                <div
                  key={sel._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                >
                  <div className="text-sm">
                    <Typography variant="body2" className="capitalize text-foreground">
                      {sel.category?.replaceAll("_", " ")}
                    </Typography>
                    <StatusBadge status={sel.status} />
                  </div>
                  {sel.status === "requested" && item.event.status === "approved" && (
                    <div className="flex gap-2">
                      <Button onClick={() => respond(sel._id, true)}>Accept</Button>
                      <Button variant="secondary" onClick={() => respond(sel._id, false)}>Decline</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}
