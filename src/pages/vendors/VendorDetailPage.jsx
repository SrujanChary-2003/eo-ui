import { useEffect } from "react";
import { Typography } from "@onesaz/ui";
import { useParams } from "react-router-dom";
import { useVendors } from "../../hooks/useVendors";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import { LoadingState } from "../../components/ui/LoadingState";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { mediaUrl } from "../../utils/mediaUrl";

export default function VendorDetailPage() {
  const { vendorId } = useParams();
  const { current: vendor, loading, error, loadOne } = useVendors(false);

  useEffect(() => {
    loadOne(vendorId);
  }, [vendorId, loadOne]);

  if (error) return <Alert message={error} />;
  if (loading || !vendor) return <LoadingState label="Loading vendor..." />;

  return (
    <div>
      <PageHeader
        title={vendor.businessName}
        subtitle={vendor.city || "Event vendor"}
        actions={<StatusBadge status={vendor.approvalStatus} />}
      />
      <AppCard>
        <Typography variant="body1" className="text-muted-foreground">
          {vendor.description || "No description yet."}
        </Typography>
      </AppCard>

      {(vendor.portfolio || []).length > 0 && (
        <>
          <Typography variant="h6" className="mb-3 mt-8">
            Proof gallery
          </Typography>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendor.portfolio.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <img
                  src={mediaUrl(item.url)}
                  alt={item.caption || "Proof"}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml," +
                      encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect fill="#0f172a" width="100%" height="100%"/><text x="50%" y="50%" fill="#94a3b8" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14">Image unavailable</text></svg>`
                      );
                  }}
                />
                <div className="p-3 text-sm text-muted-foreground">
                  {item.caption || item.eventName || "Past work"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Typography variant="h6" className="mb-3 mt-8">
        Services
      </Typography>
      <div className="space-y-3">
        {(vendor.services || []).map((service) => (
          <AppCard key={service.id} contentClassName="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Typography variant="subtitle1" className="font-medium">
                  {service.title}
                </Typography>
                <Typography variant="body2" className="capitalize text-muted-foreground">
                  {service.category.replaceAll("_", " ")}
                </Typography>
              </div>
              <Typography variant="body2" className="text-accent">
                ₹{service.priceFrom} – ₹{service.priceTo}
              </Typography>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}
