import { useEffect, useRef, useState } from "react";
import { Avatar, Typography, VStack } from "@onesaz/ui";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useImageCrop, blobToDataUrl } from "../hooks/useImageCrop";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AppTextarea from "../components/ui/AppTextarea";
import AppCard from "../components/ui/AppCard";
import ImageCropper from "../components/media/ImageCropper";
import { PageHeader } from "../components/ui/PageBits";
import { mediaUrl } from "../utils/mediaUrl";
import { toastError } from "../utils/toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { save, uploadPhoto, removePhoto, loading, clearMessage } = useProfile();
  const cropper = useImageCrop();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: "",
    bio: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      city: user.city || "",
      address: user.address || "",
      bio: user.bio || "",
    });
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    clearMessage();
    try {
      await save(form);
    } catch {
      /* toasted in hook */
    }
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      toastError("Only image files are allowed");
      return;
    }
    cropper.onFileSelect(file);
  };

  const onConfirmAvatar = async () => {
    setUploading(true);
    clearMessage();
    try {
      const blob = await cropper.getCroppedBlob();
      const image = await blobToDataUrl(blob);
      await uploadPhoto(image);
      cropper.reset();
    } catch {
      /* toasted in useProfile */
    } finally {
      setUploading(false);
    }
  };

  const initials = `${(user?.firstName || "U").slice(0, 1)}${(user?.lastName || "").slice(0, 1)}`;

  return (
    <div>
      <PageHeader title="My profile" subtitle="Update your personal details and profile photo." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AppCard contentClassName="flex flex-col items-center gap-4 p-6 text-center">
          <Avatar
            src={mediaUrl(user?.avatarUrl)}
            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
            fallback={initials}
            size="2xl"
            bordered
          />
          <div>
            <Typography variant="h6">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" className="capitalize text-muted-foreground">
              {user?.role} · {user?.email}
            </Typography>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
          <div className="flex w-full flex-col gap-2">
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Change photo
            </Button>
            {user?.avatarUrl ? (
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    clearMessage();
                    await removePhoto();
                  } catch {
                    /* toasted in hook */
                  }
                }}
              >
                Remove photo
              </Button>
            ) : null}
          </div>
        </AppCard>

        <AppCard>
          <form onSubmit={onSave}>
            <VStack className="gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
              <Input label="Email" value={user?.email || ""} disabled />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 ..."
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <Input
                label="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <AppTextarea
                label="Bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Tell others a bit about yourself"
              />
              <Button type="submit" loading={loading}>
                Save changes
              </Button>
            </VStack>
          </form>
        </AppCard>
      </div>

      <ImageCropper
        imageSrc={cropper.sourceUrl}
        crop={cropper.crop}
        zoom={cropper.zoom}
        onCropChange={cropper.setCrop}
        onZoomChange={cropper.setZoom}
        onCropComplete={cropper.onCropComplete}
        onCancel={cropper.reset}
        onConfirm={onConfirmAvatar}
        confirming={uploading}
        title="Crop profile photo"
      />
    </div>
  );
}
