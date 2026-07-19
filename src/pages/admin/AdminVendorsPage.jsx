import { useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function AdminVendorsPage() {
  const { vendors, error, loadVendors, reviewVendor } = useAdmin();

  useEffect(() => {
    loadVendors({ status: "pending" });
  }, [loadVendors]);

  return (
    <div>
      <PageHeader title="Approve vendors" subtitle="Verify vendor businesses before they appear to customers." />
      <div className="mb-6 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", ""].map((value) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => loadVendors(value ? { status: value } : {})}
            className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-violet-500/20"
          >
            {value || "all"}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!vendors.length && <EmptyState title="No vendors">No vendor profiles for this filter.</EmptyState>}
      <div className="space-y-3">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{vendor.businessName}</h2>
                <p className="text-sm text-slate-400">
                  {vendor.user?.firstName} {vendor.user?.lastName} · {vendor.user?.email}
                </p>
              </div>
              <StatusBadge status={vendor.approvalStatus} />
            </div>
            {vendor.approvalStatus === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => reviewVendor(vendor.id, true, "Verified")}>Approve</Button>
                <Button variant="secondary" onClick={() => reviewVendor(vendor.id, false, "Incomplete profile")}>Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
