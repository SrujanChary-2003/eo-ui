import { useEffect, useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { EmptyState, PageHeader } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function VendorServicesPage() {
  const { services, message, loadServices, createService, deleteService, clearMessage } = useVendorWorkspace();
  const { catalog, loadCatalog } = useEvents(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "photography",
    description: "",
    priceFrom: "",
    priceTo: "",
  });

  useEffect(() => {
    loadServices();
    loadCatalog();
  }, [loadServices, loadCatalog]);

  useEffect(() => {
    if (catalog.serviceCategories?.[0] && form.category === "photography") {
      setForm((f) => ({ ...f, category: catalog.serviceCategories[0].value }));
    }
  }, [catalog.serviceCategories]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    clearMessage();
    try {
      await createService({
        ...form,
        priceFrom: Number(form.priceFrom) || 0,
        priceTo: Number(form.priceTo) || 0,
      });
      setForm((f) => ({ ...f, title: "", description: "", priceFrom: "", priceTo: "" }));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="My services" subtitle="List what you offer for customer events." />
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {message && <div className="mb-4"><Alert type="success" message={message} /></div>}

      <form onSubmit={onSubmit} className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <Input label="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {(catalog.serviceCategories || []).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Price from" type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} />
          <Input label="Price to" type="number" value={form.priceTo} onChange={(e) => setForm({ ...form, priceTo: e.target.value })} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
          <textarea
            className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <Button type="submit">Add service</Button>
      </form>

      {!services.length && <EmptyState title="No services yet">Add your first offering so customers can book you.</EmptyState>}

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <div>
              <p className="font-medium text-white">{service.title}</p>
              <p className="text-sm capitalize text-slate-400">
                {service.category.replaceAll("_", " ")} · ₹{service.priceFrom}–₹{service.priceTo}
              </p>
            </div>
            <Button variant="ghost" onClick={() => deleteService(service.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
