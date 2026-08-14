import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import Button from "../../components/ui/Button";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { asArray, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";

export default function AdminVendorsPage() {
  const { vendors, vendorsPagination, error, loadVendors, reviewVendor } = useAdmin();
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadVendors({ status: status || undefined, page, limit: PAGE_SIZE });
  }, [loadVendors, status, page]);

  return (
    <div>
      <PageHeader title="Approve vendors" subtitle="Verify vendor businesses before they appear to customers." />
      <div className="mb-6 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", ""].map((value) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/20 hover:text-foreground"
          >
            {value || "all"}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!asArray(vendors).length && <EmptyState title="No vendors">No vendor profiles for this filter.</EmptyState>}
      <div className="space-y-3">
        {asArray(vendors).map((vendor, index) => {
          const id = resourceId(vendor);
          return (
          <AppCard key={id || `vendor-${index}`} contentClassName="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Typography variant="h6">{vendor?.businessName || "Vendor"}</Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {vendor?.user?.firstName || ""} {vendor?.user?.lastName || ""} · {vendor?.user?.email || "No email"}
                </Typography>
              </div>
              <StatusBadge status={vendor?.approvalStatus} />
            </div>
            {vendor?.approvalStatus === "pending" && id && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => reviewVendor(id, true, "Verified")}>Approve</Button>
                <Button variant="secondary" onClick={() => reviewVendor(id, false, "Incomplete profile")}>Reject</Button>
              </div>
            )}
          </AppCard>
          );
        })}
      </div>
      <PaginationBar pagination={vendorsPagination} onPage={setPage} />
    </div>
  );
}
