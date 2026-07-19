import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVendors } from "../../hooks/useVendors";
import Alert from "../../components/ui/Alert";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { mediaUrl } from "../../utils/mediaUrl";

export default function VendorDetailPage() {
  const { vendorId } = useParams();
  const { current: vendor, error, loadOne } = useVendors(false);

  useEffect(() => {
    loadOne(vendorId);
  }, [vendorId, loadOne]);

  if (error) return <Alert message={error} />;
  if (!vendor) return <p className="text-slate-400">Loading...</p>;

  return (
    <div>
      <PageHeader
        title={vendor.businessName}
        subtitle={vendor.city || "Event vendor"}
        actions={<StatusBadge status={vendor.approvalStatus} />}
      />
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <p className="text-slate-300">{vendor.description || "No description yet."}</p>
      </div>

      {(vendor.portfolio || []).length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-semibold text-white">Proof gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendor.portfolio.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-white/10">
                <img src={mediaUrl(item.url)} alt={item.caption || "Proof"} className="h-40 w-full object-cover" />
                <div className="p-3 text-sm text-slate-300">{item.caption || item.eventName || "Past work"}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mb-3 mt-8 text-lg font-semibold text-white">Services</h2>
      <div className="space-y-3">
        {(vendor.services || []).map((service) => (
          <div key={service.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-white">{service.title}</p>
                <p className="text-sm capitalize text-slate-400">{service.category.replaceAll("_", " ")}</p>
              </div>
              <p className="text-sm text-violet-300">₹{service.priceFrom} – ₹{service.priceTo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
