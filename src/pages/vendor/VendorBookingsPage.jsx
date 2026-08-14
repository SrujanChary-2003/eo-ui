import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";
import { asArray, formatDate, formatLabel, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";

export default function VendorBookingsPage() {
  const { bookings, bookingsPagination, loadBookings, respondBooking } = useVendorWorkspace();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadBookings({ page, limit: PAGE_SIZE });
  }, [loadBookings, page]);

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
      {!asArray(bookings).length && <EmptyState title="No bookings yet">When customers pick your services, requests show up here.</EmptyState>}

      <div className="space-y-4">
        {asArray(bookings).map((item, index) => {
          const event = item?.event || {};
          const eventKey = resourceId(event, `booking-${index}`);
          return (
          <AppCard key={eventKey} contentClassName="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Typography variant="h6">{event.title || "Untitled event"}</Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {item.customer?.firstName || "Customer"} {item.customer?.lastName || ""} · {event.location || "Location TBA"}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {formatDate(event.eventDate)}
                </Typography>
              </div>
              <StatusBadge status={event.status} />
            </div>
            <div className="mt-4 space-y-2">
              {asArray(item.mySelections).map((sel, selIndex) => (
                <div
                  key={resourceId(sel, `sel-${selIndex}`)}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                >
                  <div className="text-sm">
                    <Typography variant="body2" className="capitalize text-foreground">
                      {formatLabel(sel?.category) || "Service"}
                    </Typography>
                    <StatusBadge status={sel?.status} />
                  </div>
                  {sel?.status === "requested" && event.status === "approved" && sel?._id && (
                    <div className="flex gap-2">
                      <Button onClick={() => respond(sel._id, true)}>Accept</Button>
                      <Button variant="secondary" onClick={() => respond(sel._id, false)}>Decline</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AppCard>
          );
        })}
      </div>
      <PaginationBar pagination={bookingsPagination} onPage={setPage} />
    </div>
  );
}
