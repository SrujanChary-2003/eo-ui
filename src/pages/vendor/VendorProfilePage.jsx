import { useEffect, useState } from "react";
import { Typography } from "@onesaz/ui";
import { useEvents } from "../../hooks/useEvents";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import { useImageCrop } from "../../hooks/useImageCrop";
import Alert from "../../components/ui/Alert";
import AppCard from "../../components/ui/AppCard";
import AppCombobox from "../../components/ui/AppCombobox";
import AppTextarea from "../../components/ui/AppTextarea";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ImageCropper from "../../components/media/ImageCropper";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";
import { mediaUrl } from "../../utils/mediaUrl";
import { asArray, formatLabel, resourceId } from "../../utils/safe";

export default function VendorProfilePage() {
  const {
    profile,
    message,
    error,
    saveProfile,
    toggleAvailability,
    uploadProof,
    removeProof,
    clearMessage,
  } = useVendorWorkspace();
  const { catalog, loadCatalog } = useEvents(false);
  const cropper = useImageCrop();

  const [form, setForm] = useState({
    businessName: "",
    description: "",
    phone: "",
    city: "",
    address: "",
    isAvailable: true,
  });
  const [meta, setMeta] = useState({ caption: "", category: "photography", eventName: "" });
  const [localError, setLocalError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      businessName: profile.businessName || "",
      description: profile.description || "",
      phone: profile.phone || "",
      city: profile.city || "",
      address: profile.address || "",
      isAvailable: profile.isAvailable !== false,
    });
  }, [profile]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setLocalError("");
    clearMessage();
    try {
      await saveProfile(form);
    } catch (err) {
      setLocalError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setLocalError("Only image files are allowed");
      return;
    }
    setLocalError("");
    cropper.onFileSelect(file);
  };

  const onConfirmCrop = async () => {
    setUploading(true);
    setLocalError("");
    try {
      const image = await cropper.getCroppedDataUrl();
      await uploadProof({
        image,
        caption: meta.caption,
        category: meta.category,
        eventName: meta.eventName,
      });
      cropper.reset();
      setMeta({ caption: "", category: meta.category, eventName: "" });
    } catch (err) {
      setLocalError(getApiErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const categoryOptions = asArray(catalog?.serviceCategories).map((c) => ({
    value: c.value,
    label: c.label,
  }));

  return (
    <div>
      <PageHeader
        title="Business profile"
        subtitle="Customers see this when booking your services. Upload cropped proof photos from events you conducted."
        actions={<StatusBadge status={profile?.approvalStatus || "pending"} />}
      />

      {(localError || error) && <div className="mb-4"><Alert message={localError || error} /></div>}
      {message && <div className="mb-4"><Alert type="success" message={message} /></div>}

      <AppCard>
        <form onSubmit={onSave} className="space-y-4">
          <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <AppTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
            <Button type="button" variant="secondary" onClick={() => toggleAvailability(!form.isAvailable)}>
              {form.isAvailable ? "Mark unavailable" : "Mark available"}
            </Button>
          </div>
        </form>
      </AppCard>

      <AppCard className="mt-8">
        <Typography variant="h6">Event proof gallery</Typography>
        <Typography variant="body2" className="mt-1 text-muted-foreground">
          Upload photos from past work. Crop before upload for a clean showcase.
        </Typography>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input label="Caption" value={meta.caption} onChange={(e) => setMeta({ ...meta, caption: e.target.value })} placeholder="Floral stage setup" />
          <Input label="Event name" value={meta.eventName} onChange={(e) => setMeta({ ...meta, eventName: e.target.value })} placeholder="Ganesh Festival 2025" />
          <AppCombobox
            label="Category"
            options={categoryOptions}
            value={meta.category}
            onChange={(value) => setMeta({ ...meta, category: value })}
            placeholder="Select category"
          />
        </div>

        <div className="mt-4">
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-border px-4 py-2.5 text-sm text-foreground hover:bg-muted/40">
            Choose image
            <input type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {asArray(profile?.portfolio).map((item, index) => {
            const proofId = resourceId(item);
            return (
            <div key={proofId || `proof-${index}`} className="overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={mediaUrl(item.url)}
                alt={item.caption || "Proof"}
                className="h-40 w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml," +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect fill="#0f172a" width="100%" height="100%"/><text x="50%" y="50%" fill="#94a3b8" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14">Image unavailable</text></svg>`
                    );
                }}
              />
              <div className="space-y-2 p-3">
                <Typography variant="body2" className="font-medium">
                  {item.caption || "Untitled"}
                </Typography>
                <Typography variant="caption" className="capitalize text-muted-foreground">
                  {item?.eventName || "Past event"} · {formatLabel(item?.category)}
                </Typography>
                {proofId ? (
                <Button variant="ghost" className="w-full" onClick={() => removeProof(proofId)}>Remove</Button>
                ) : null}
              </div>
            </div>
            );
          })}
        </div>
      </AppCard>

      <ImageCropper
        imageSrc={cropper.sourceUrl}
        crop={cropper.crop}
        zoom={cropper.zoom}
        onCropChange={cropper.setCrop}
        onZoomChange={cropper.setZoom}
        onCropComplete={cropper.onCropComplete}
        onCancel={cropper.reset}
        onConfirm={onConfirmCrop}
        confirming={uploading}
        title="Crop your event proof"
      />
    </div>
  );
}
