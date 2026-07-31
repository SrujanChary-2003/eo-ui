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
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function VendorsBrowsePage() {
  const { vendors, loading, error, load } = useVendors(true);
  const { catalog, loadCatalog } = useEvents(false);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    load({ category: category || undefined, q: q || undefined });
  }, [category]);

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...(catalog.serviceCategories || []).map((c) => ({ value: c.value, label: c.label })),
  ];

  const runSearch = () => load({ category: category || undefined, q: q || undefined });

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
          onChange={setCategory}
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
      {!loading && !vendors.length && (
        <EmptyState title="No vendors found">
          Approved vendors with matching services will appear here.
        </EmptyState>
      )}

      {!loading && (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              to={`/vendors/${vendor.user?.id || vendor.user?._id || vendor.user}`}
              className="block transition"
            >
              <AppCard className="h-full hover:border-accent/40" contentClassName="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Typography variant="h6" className="truncate">
                      {vendor.businessName}
                    </Typography>
                    <Typography variant="body2" className="mt-1 text-muted-foreground">
                      {vendor.city || "Location TBA"}
                    </Typography>
                  </div>
                  <StatusBadge status={vendor.approvalStatus} />
                </div>
                <Typography variant="body2" className="mt-3 line-clamp-2 text-muted-foreground">
                  {vendor.description || "Professional event services"}
                </Typography>
                {(vendor.services || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {vendor.services.slice(0, 3).map((service) => (
                      <span
                        key={service.id}
                        className="rounded-full bg-[var(--app-accent-soft)] px-2.5 py-0.5 text-[11px] capitalize text-[var(--app-accent-text)]"
                      >
                        {String(service.category || "").replaceAll("_", " ")}
                      </span>
                    ))}
                  </div>
                )}
              </AppCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
