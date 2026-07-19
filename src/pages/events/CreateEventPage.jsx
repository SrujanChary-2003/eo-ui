import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { useVendors } from "../../hooks/useVendors";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";

const STEPS = ["Details", "Services", "Vendors", "Review"];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { catalog, loadCatalog, create, update, selectVendors } = useEvents(false);
  const { vendors, load } = useVendors(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    eventType: "ganesh_festival",
    description: "",
    eventDate: "",
    location: "",
    city: "",
    guestCount: "",
    budget: "",
    requiredCategories: [],
  });
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (step !== 2) return;
    const category = form.requiredCategories[0];
    load(category ? { category } : {}).catch(() => {});
  }, [step, form.requiredCategories, load]);

  const filteredVendors = useMemo(() => {
    if (!form.requiredCategories.length) return vendors;
    return vendors.filter((v) =>
      (v.services || []).some((s) => form.requiredCategories.includes(s.category))
    );
  }, [vendors, form.requiredCategories]);

  const toggleCategory = (value) => {
    setForm((prev) => {
      const exists = prev.requiredCategories.includes(value);
      return {
        ...prev,
        requiredCategories: exists
          ? prev.requiredCategories.filter((c) => c !== value)
          : [...prev.requiredCategories, value],
      };
    });
  };

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.serviceId === service.id);
      if (exists) return prev.filter((s) => s.serviceId !== service.id);
      return [
        ...prev,
        {
          serviceId: service.id,
          title: service.title,
          category: service.category,
          vendorName: service._vendorName,
        },
      ];
    });
  };

  const saveDetails = async () => {
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        guestCount: Number(form.guestCount) || 0,
        budget: Number(form.budget) || 0,
      };
      if (eventId) {
        await update(eventId, payload);
      } else {
        const event = await create(payload);
        setEventId(event.id);
      }
      setStep(1);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save event"));
    } finally {
      setLoading(false);
    }
  };

  const saveCategories = async () => {
    if (!form.requiredCategories.length) {
      setError("Pick at least one service you need");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await update(eventId, { requiredCategories: form.requiredCategories });
      setStep(2);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save services"));
    } finally {
      setLoading(false);
    }
  };

  const saveVendors = async () => {
    if (!selectedServices.length) {
      setError("Select at least one vendor service");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await selectVendors(
        eventId,
        selectedServices.map((s) => ({ serviceId: s.serviceId }))
      );
      setStep(3);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save vendors"));
    } finally {
      setLoading(false);
    }
  };

  const submitEvent = async () => {
    setError("");
    setLoading(true);
    try {
      await update(eventId, { submit: true });
      navigate(`/events/${eventId}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not submit event"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create event"
        subtitle="Tell us what you're planning, pick the services you need, then choose vendors."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, idx) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs ${
              idx === step ? "bg-violet-500/30 text-violet-200" : "bg-white/5 text-slate-400"
            }`}
          >
            {idx + 1}. {label}
          </span>
        ))}
      </div>

      {error && <div className="mb-4"><Alert message={error} /></div>}

      {step === 0 && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <Input label="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ganesh Festival at Home" required />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Event type</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            >
              {(catalog.eventTypes || []).map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input label="Date & time" type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Venue / address" required />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Guest count" type="number" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} />
            <Input label="Budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button onClick={saveDetails} disabled={loading || !form.title || !form.eventDate || !form.location}>
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <p className="mb-4 text-sm text-slate-400">What do you need for this event?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(catalog.serviceCategories || []).map((cat) => {
              const active = form.requiredCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleCategory(cat.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active ? "border-violet-500 bg-violet-500/20 text-violet-100" : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={saveCategories} disabled={loading}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {!filteredVendors.length && (
            <Alert message="No approved vendors match yet. Ask vendors to list services, or continue after admin approves vendors." />
          )}
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
              <h3 className="font-semibold text-white">{vendor.businessName}</h3>
              <p className="text-sm text-slate-400">{vendor.city || "—"} · {vendor.description || "No description"}</p>
              <div className="mt-4 space-y-2">
                {(vendor.services || [])
                  .filter((s) => form.requiredCategories.includes(s.category))
                  .map((service) => {
                    const selected = selectedServices.some((s) => s.serviceId === service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService({ ...service, _vendorName: vendor.businessName })}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                          selected ? "border-violet-500 bg-violet-500/15" : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <span>
                          <span className="font-medium text-white">{service.title}</span>
                          <span className="ml-2 capitalize text-slate-400">{service.category.replaceAll("_", " ")}</span>
                        </span>
                        <span className="text-slate-300">₹{service.priceFrom}–₹{service.priceTo}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={saveVendors} disabled={loading}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-white">{form.title}</h3>
          <p className="mt-1 text-sm capitalize text-slate-400">
            {form.eventType.replaceAll("_", " ")} · {form.location}
          </p>
          <div className="mt-4">
            <p className="text-sm text-slate-400">Selected services</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              {selectedServices.map((s) => (
                <li key={s.serviceId}>{s.title} · {s.vendorName}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={submitEvent} disabled={loading}>
              {loading ? "Submitting..." : "Submit for approval"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
