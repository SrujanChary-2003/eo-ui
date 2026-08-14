import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Chip, HStack, Typography, VStack } from "@onesaz/ui";
import { useEvents } from "../../hooks/useEvents";
import { useVendors } from "../../hooks/useVendors";
import { useGlobalLoading } from "../../hooks/useGlobalLoading";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AppCombobox from "../../components/ui/AppCombobox";
import AppTextarea from "../../components/ui/AppTextarea";
import AppCard from "../../components/ui/AppCard";
import { PageHeader } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";
import { toastError, toastSuccess } from "../../utils/toast";
import { asArray, formatLabel, resourceId } from "../../utils/safe";

const STEPS = ["Details", "Services", "Vendors", "Review"];

const VENUE_OPTIONS = [
  { value: "home", label: "Home / Residence" },
  { value: "hall", label: "Community / Banquet hall" },
  { value: "outdoor", label: "Outdoor / Open ground" },
  { value: "temple", label: "Temple / Religious venue" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  title: "",
  eventType: "ganesh_festival",
  description: "",
  eventDate: "",
  location: "",
  city: "",
  guestCount: "",
  budget: "",
  contactPhone: "",
  venueType: "home",
  specialRequirements: "",
  requiredCategories: [],
};

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { catalog, loadCatalog, create, update, selectVendors, resetCurrent } = useEvents(false);
  const { vendors, load } = useVendors(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Saving event...");
  /** Single draft id for this wizard — never create more than one record. */
  const [eventId, setEventId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedServices, setSelectedServices] = useState([]);

  useGlobalLoading(saving, loadingMessage);

  useEffect(() => {
    resetCurrent();
    loadCatalog();
  }, [loadCatalog, resetCurrent]);

  useEffect(() => {
    if (step !== 2) return;
    const category = form.requiredCategories[0];
    load(category ? { category } : {}).catch(() => {});
  }, [step, form.requiredCategories, load]);

  const eventTypeOptions = useMemo(
    () => asArray(catalog?.eventTypes).map((t) => ({ value: t.value, label: t.label })),
    [catalog.eventTypes]
  );

  const filteredVendors = useMemo(() => {
    if (!form.requiredCategories.length) return asArray(vendors);
    return asArray(vendors).filter((v) =>
      asArray(v?.services).some((s) => form.requiredCategories.includes(s?.category))
    );
  }, [vendors, form.requiredCategories]);

  const detailsPayload = () => ({
    title: form.title.trim(),
    eventType: form.eventType,
    description: form.description,
    eventDate: form.eventDate,
    location: form.location.trim(),
    city: form.city,
    guestCount: Number(form.guestCount) || 0,
    budget: Number(form.budget) || 0,
    contactPhone: form.contactPhone,
    venueType: form.venueType,
    specialRequirements: form.specialRequirements,
    requiredCategories: form.requiredCategories,
  });

  /** Create once on first save; every later stage PATCHes the same draft. */
  const persistDraft = async (extra = {}) => {
    const payload = { ...detailsPayload(), ...extra };
    if (eventId) {
      return update(eventId, payload);
    }
    const event = await create(payload);
    const id = event?.id || event?._id;
    if (!id) {
      throw new Error("Event was created but no id was returned");
    }
    setEventId(String(id));
    return event;
  };

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
    setLoadingMessage("Saving event details...");
    setSaving(true);
    try {
      await persistDraft();
      toastSuccess("Details saved");
      setStep(1);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not save event");
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveCategories = async () => {
    if (!form.requiredCategories.length) {
      const msg = "Pick at least one service you need";
      setError(msg);
      toastError(msg);
      return;
    }
    if (!eventId) {
      const msg = "Save event details first";
      setError(msg);
      toastError(msg);
      setStep(0);
      return;
    }
    setError("");
    setLoadingMessage("Saving required services...");
    setSaving(true);
    try {
      await update(eventId, { requiredCategories: form.requiredCategories });
      toastSuccess("Services saved");
      setStep(2);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not save services");
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveVendors = async () => {
    if (!selectedServices.length) {
      const msg = "Select at least one vendor service";
      setError(msg);
      toastError(msg);
      return;
    }
    if (!eventId) {
      const msg = "Save event details first";
      setError(msg);
      toastError(msg);
      setStep(0);
      return;
    }
    setError("");
    setLoadingMessage("Saving vendor selections...");
    setSaving(true);
    try {
      await selectVendors(
        eventId,
        selectedServices.map((s) => ({ serviceId: s.serviceId }))
      );
      toastSuccess("Vendors saved");
      setStep(3);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not save vendors");
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const submitEvent = async () => {
    if (!eventId) {
      const msg = "Complete previous steps first";
      setError(msg);
      toastError(msg);
      return;
    }
    setError("");
    setLoadingMessage("Submitting event for approval...");
    setSaving(true);
    try {
      await update(eventId, { submit: true });
      toastSuccess("Event submitted for approval");
      navigate(`/events/${eventId}`);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not submit event");
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveDraftAndExit = async () => {
    if (!eventId) {
      navigate("/events");
      return;
    }
    setLoadingMessage("Saving draft...");
    setSaving(true);
    try {
      await persistDraft();
      toastSuccess("Draft saved");
      navigate(`/events/${eventId}`);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Could not save draft");
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create event"
        subtitle="Complete each step — your draft is saved once, then updated as you continue."
        actions={
          <Button variant="secondary" onClick={saveDraftAndExit} disabled={saving}>
            Save draft & exit
          </Button>
        }
      />

      <HStack className="mb-8 flex-wrap gap-2">
        {STEPS.map((label, idx) => (
          <Badge
            key={label}
            color={idx === step ? "default" : "normal"}
            variant={idx === step ? "contained" : "soft"}
          >
            {idx + 1}. {label}
          </Badge>
        ))}
      </HStack>

      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}

      {step === 0 && (
        <AppCard>
          <VStack spacing={4} className="gap-4">
            <Input
              label="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ganesh Festival at Home"
              required
            />
            <AppCombobox
              label="Event type"
              options={eventTypeOptions}
              value={form.eventType}
              onChange={(value) => setForm({ ...form, eventType: value || "ganesh_festival" })}
              required
            />
            <AppCombobox
              label="Venue type"
              options={VENUE_OPTIONS}
              value={form.venueType}
              onChange={(value) => setForm({ ...form, venueType: value || "home" })}
            />
            <Input
              label="Date & time"
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              required
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Venue / address"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                label="Contact phone"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                placeholder="+91 ..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Guest count"
                type="number"
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              />
              <Input
                label="Budget"
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
            <AppTextarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
            <AppTextarea
              label="Special requirements"
              value={form.specialRequirements}
              onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
              placeholder="Parking, power backup, decoration notes..."
              rows={3}
            />
            <Button
              onClick={saveDetails}
              loading={saving}
              disabled={!form.title || !form.eventDate || !form.location}
            >
              Save & continue
            </Button>
          </VStack>
        </AppCard>
      )}

      {step === 1 && (
        <AppCard>
          <Typography variant="body2" className="mb-4 text-muted-foreground">
            What do you need for this event?
          </Typography>
          <div className="grid gap-3 sm:grid-cols-2">
            {asArray(catalog?.serviceCategories).map((cat) => {
              const active = form.requiredCategories.includes(cat.value);
              return (
                <Chip
                  key={cat.value}
                  label={cat.label}
                  variant={active ? "contained" : "outlined"}
                  color={active ? "default" : "default"}
                  onClick={() => toggleCategory(cat.value)}
                  className="cursor-pointer justify-start px-4 py-3"
                />
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(0)} disabled={saving}>
              Back
            </Button>
            <Button onClick={saveCategories} loading={saving}>
              Save & continue
            </Button>
          </div>
        </AppCard>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {!filteredVendors.length && (
            <Alert message="No approved vendors match yet. Ask vendors to list services, or continue after admin approves vendors." />
          )}
          {asArray(filteredVendors).map((vendor, vendorIndex) => (
            <AppCard key={resourceId(vendor, `vendor-${vendorIndex}`)} contentClassName="p-5">
              <Typography variant="h6">{vendor?.businessName || "Vendor"}</Typography>
              <Typography variant="body2" className="text-muted-foreground">
                {vendor?.city || "—"} · {vendor?.description || "No description"}
              </Typography>
              <div className="mt-4 space-y-2">
                {asArray(vendor?.services)
                  .filter((s) => form.requiredCategories.includes(s?.category))
                  .map((service, serviceIndex) => {
                    const serviceId = resourceId(service);
                    const selected = selectedServices.some((s) => s.serviceId === serviceId);
                    return (
                      <button
                        key={serviceId || `service-${serviceIndex}`}
                        type="button"
                        onClick={() => serviceId && toggleService({ ...service, _vendorName: vendor.businessName })}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                          selected
                            ? "border-accent bg-accent/10"
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <span>
                          <span className="font-medium text-foreground">{service?.title || "Service"}</span>
                          <span className="ml-2 capitalize text-muted-foreground">
                            {formatLabel(service?.category)}
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          ₹{service?.priceFrom ?? 0}–₹{service?.priceTo ?? 0}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </AppCard>
          ))}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} disabled={saving}>
              Back
            </Button>
            <Button onClick={saveVendors} loading={saving}>
              Save & continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <AppCard>
          <Typography variant="h5">{form.title || "Untitled event"}</Typography>
          <Typography variant="body2" className="mt-1 capitalize text-muted-foreground">
            {formatLabel(form.eventType) || "Event"} · {form.venueType || "Venue"} · {form.location || "Location TBA"}
          </Typography>
          <div className="mt-4">
            <Typography variant="body2" className="text-muted-foreground">
              Selected services
            </Typography>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              {asArray(selectedServices).map((s, index) => (
                <li key={s?.serviceId || `selected-${index}`}>
                  {s?.title || "Service"} · {s?.vendorName || "Vendor"}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} disabled={saving}>
              Back
            </Button>
            <Button variant="secondary" onClick={saveDraftAndExit} loading={saving}>
              Keep as draft
            </Button>
            <Button onClick={submitEvent} loading={saving}>
              Submit for approval
            </Button>
          </div>
        </AppCard>
      )}
    </div>
  );
}
