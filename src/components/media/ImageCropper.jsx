import Cropper from "react-easy-crop";
import { Typography } from "@onesaz/ui";
import Button from "../ui/Button";

export default function ImageCropper({
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onConfirm,
  confirming = false,
  aspect = 4 / 3,
  title = "Crop proof image",
}) {
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xl">
        <Typography variant="h6" className="mb-3">
          {title}
        </Typography>
        <div className="relative h-72 overflow-hidden rounded-xl bg-muted sm:h-96">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-xs text-muted-foreground">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={confirming}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={confirming}>
            {confirming ? "Uploading..." : "Use cropped image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
