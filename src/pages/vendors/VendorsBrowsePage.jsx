import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@onesaz/ui";
import { useVendors } from "../../hooks/useVendors";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import AppCombobox from "../../components/ui/AppCombobox";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { LoadingState } from "../../components/ui/LoadingState";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { asArray, formatLabel, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";

export default function VendorsBrowsePage() {
  const { vendors, pagination, loading, error, load } = useVendors(false);
  const { catalog, loadCatalog } = useEvents(false);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    load({ category: category || undefined, q: q || undefined, page, limit: PAGE_SIZE });
  }, [category, page, load]);

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...(asArray(catalog?.serviceCategories).map((c) => ({ value: c.value, label: c.label }))),
  ];

  const runSearch = () => {
    setPage(1);
    load({ category: category || undefined, q: q || undefined, page: 1, limit: PAGE_SIZE });
  };

  return (
    <div>
      <PageHeader title="Find vendors" subtitle="Browse approved vendors by service." />
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <Input
          placeholder="Search vendors"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <AppCombobox
          options={categoryOptions}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          placeholder="All categories"
          className="sm:min-w-44"
        />
        <Button type="button" variant="secondary" onClick={runSearch} className="w-full sm:w-auto">
          Search
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}
      {loading && <LoadingState label="Loading vendors..." />}
      {!loading && !asArray(vendors).length && (
        <EmptyState title="No vendors found">
          Approved vendors with matching services will appear here.
        </EmptyState>
      )}

      {!loading && (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {asArray(vendors).map((vendor, index) => {
            const vendorId = resourceId(vendor?.user, vendor?.id, vendor?._id);
            const card = (
              <AppCard className="h-full hover:border-accent/40" contentClassName="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Typography variant="h6" className="truncate">
                      {vendor?.businessName || "Vendor"}
                    </Typography>
                    <Typography variant="body2" className="mt-1 text-muted-foreground">
                      {vendor?.city || "Location TBA"}
                    </Typography>
                  </div>
                  <StatusBadge status={vendor?.approvalStatus} />
                </div>
                <Typography variant="body2" className="mt-3 line-clamp-2 text-muted-foreground">
                  {vendor?.description || "Professional event services"}
                </Typography>
                {asArray(vendor?.services).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {asArray(vendor.services).slice(0, 3).map((service, serviceIndex) => (
                      <span
                        key={resourceId(service, `cat-${serviceIndex}`)}
                        className="rounded-full bg-[var(--app-accent-soft)] px-2.5 py-0.5 text-[11px] capitalize text-[var(--app-accent-text)]"
                      >
                        {formatLabel(service?.category) || "Service"}
                      </span>
                    ))}
                  </div>
                )}
              </AppCard>
            );
            if (!vendorId) {
              return <div key={`vendor-${index}`}>{card}</div>;
            }
            return (
            <Link
              key={vendorId}
              to={`/vendors/${vendorId}`}
              className="block transition"
            >
              {card}
            </Link>
            );
          })}
        </div>
      )}
      <PaginationBar pagination={pagination} onPage={setPage} disabled={loading} />
    </div>
  );
}
