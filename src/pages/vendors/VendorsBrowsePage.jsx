import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVendors } from "../../hooks/useVendors";
import { useEvents } from "../../hooks/useEvents";
import Alert from "../../components/ui/Alert";
import Input from "../../components/ui/Input";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function VendorsBrowsePage() {
  const { vendors, error, load } = useVendors(true);
  const { catalog, loadCatalog } = useEvents(false);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    load({ category: category || undefined, q: q || undefined });
  }, [category]);

  return (
    <div>
      <PageHeader title="Find vendors" subtitle="Browse approved vendors by service." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search vendors" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load({ category: category || undefined, q: q || undefined })} />
        <select
          className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {(catalog.serviceCategories || []).map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button type="button" onClick={() => load({ category: category || undefined, q: q || undefined })} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5">
          Search
        </button>
      </div>

      {error && <div className="mb-4"><Alert message={error} /></div>}
      {!vendors.length && <EmptyState title="No vendors found">Approved vendors with matching services will appear here.</EmptyState>}

      <div className="grid gap-4 md:grid-cols-2">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            to={`/vendors/${vendor.user?.id || vendor.user?._id || vendor.user}`}
            className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 transition hover:border-violet-500/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{vendor.businessName}</h2>
                <p className="mt-1 text-sm text-slate-400">{vendor.city || "Location TBA"}</p>
              </div>
              <StatusBadge status={vendor.approvalStatus} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-slate-300">{vendor.description || "Professional event services"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
