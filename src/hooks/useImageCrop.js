import { useCallback, useEffect, useState } from "react";

export async function getCroppedImageBlob(imageSrc, cropPixels, mimeType = "image/jpeg") {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.92
    );
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export function useImageCrop() {
  const [sourceUrl, setSourceUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  const onFileSelect = useCallback((file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSourceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }, []);

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const reset = useCallback(() => {
    setSourceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  }, []);

  const getCroppedBlob = useCallback(async () => {
    if (!sourceUrl || !croppedAreaPixels) {
      throw new Error("Nothing to crop");
    }
    return getCroppedImageBlob(sourceUrl, croppedAreaPixels);
  }, [sourceUrl, croppedAreaPixels]);

  return {
    sourceUrl,
    crop,
    zoom,
    croppedAreaPixels,
    setCrop,
    setZoom,
    onFileSelect,
    onCropComplete,
    getCroppedBlob,
    reset,
  };
}
