import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useEvents } from "../../hooks/useEvents";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AppCombobox from "../../components/ui/AppCombobox";
import AppTextarea from "../../components/ui/AppTextarea";
import AppCard from "../../components/ui/AppCard";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function VendorServicesPage() {
  const { services, message, loadServices, createService, deleteService, clearMessage } =
    useVendorWorkspace();
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

  const categoryOptions = (catalog.serviceCategories || []).map((c) => ({
    value: c.value,
    label: c.label,
  }));

  return (
    <div>
      <PageHeader title="My services" subtitle="List what you offer for customer events." />
      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}
      {message && (
        <div className="mb-4">
          <Alert type="success" message={message} />
        </div>
      )}

      <AppCard className="mb-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Service title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <AppCombobox
            label="Category"
            options={categoryOptions}
            value={form.category}
            onChange={(value) => setForm({ ...form, category: value })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price from"
              type="number"
              value={form.priceFrom}
              onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
            />
            <Input
              label="Price to"
              type="number"
              value={form.priceTo}
              onChange={(e) => setForm({ ...form, priceTo: e.target.value })}
            />
          </div>
          <AppTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
          <Button type="submit">Add service</Button>
        </form>
      </AppCard>

      {!services.length && (
        <EmptyState title="No services yet">
          Add your first offering so customers can book you.
        </EmptyState>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <AppCard key={service.id} contentClassName="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Typography variant="subtitle1" className="font-medium">
                {service.title}
              </Typography>
              <Typography variant="body2" className="capitalize text-muted-foreground">
                {service.category.replaceAll("_", " ")} · ₹{service.priceFrom}–₹{service.priceTo}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={service.isActive ? "approved" : "draft"} />
              <Button variant="ghost" onClick={() => deleteService(service.id)}>
                Delete
              </Button>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}
