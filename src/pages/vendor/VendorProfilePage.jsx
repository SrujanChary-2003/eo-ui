import { useEffect, useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { useVendorWorkspace } from "../../hooks/useVendorWorkspace";
import { useImageCrop } from "../../hooks/useImageCrop";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ImageCropper from "../../components/media/ImageCropper";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";
import { getApiErrorMessage } from "../../utils/authErrors";
import { mediaUrl } from "../../utils/mediaUrl";

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
    if (file) cropper.onFileSelect(file);
    e.target.value = "";
  };

  const onConfirmCrop = async () => {
    setUploading(true);
    setLocalError("");
    try {
      const blob = await cropper.getCroppedBlob();
      const formData = new FormData();
      formData.append("image", blob, `proof-${Date.now()}.jpg`);
      formData.append("caption", meta.caption);
      formData.append("category", meta.category);
      formData.append("eventName", meta.eventName);
      await uploadProof(formData);
      cropper.reset();
      setMeta({ caption: "", category: meta.category, eventName: "" });
    } catch (err) {
      setLocalError(getApiErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Business profile"
        subtitle="Customers see this when booking your services. Upload cropped proof photos from events you conducted."
        actions={<StatusBadge status={profile?.approvalStatus || "pending"} />}
      />

      {(localError || error) && <div className="mb-4"><Alert message={localError || error} /></div>}
      {message && <div className="mb-4"><Alert type="success" message={message} /></div>}

      <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
          <textarea
            className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
          <Button type="button" variant="secondary" onClick={() => toggleAvailability(!form.isAvailable)}>
            {form.isAvailable ? "Mark unavailable" : "Mark available"}
          </Button>
        </div>
      </form>

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Event proof gallery</h2>
        <p className="mt-1 text-sm text-slate-400">Upload photos from past work. Crop before upload for a clean showcase.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input label="Caption" value={meta.caption} onChange={(e) => setMeta({ ...meta, caption: e.target.value })} placeholder="Floral stage setup" />
          <Input label="Event name" value={meta.eventName} onChange={(e) => setMeta({ ...meta, eventName: e.target.value })} placeholder="Ganesh Festival 2025" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm text-white"
              value={meta.category}
              onChange={(e) => setMeta({ ...meta, category: e.target.value })}
            >
              {(catalog.serviceCategories || []).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5">
            Choose image
            <input type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(profile?.portfolio || []).map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
              <img src={mediaUrl(item.url)} alt={item.caption || "Proof"} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-3">
                <p className="text-sm font-medium text-white">{item.caption || "Untitled"}</p>
                <p className="text-xs capitalize text-slate-400">
                  {item.eventName || "Past event"} · {String(item.category || "").replaceAll("_", " ")}
                </p>
                <Button variant="ghost" className="w-full" onClick={() => removeProof(item.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
