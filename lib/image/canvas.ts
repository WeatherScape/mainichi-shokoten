"use client";

import type { CropArea, ImageAdjustments } from "@/lib/types";

function createImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("画像を読み込めませんでした。")));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = source;
  });
}

export async function cropImage(file: File, cropArea: CropArea, maxWidth = 1600) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await createImage(objectUrl);
    const scale = Math.min(1, maxWidth / cropArea.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropArea.width * scale);
    canvas.height = Math.round(cropArea.height * scale);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("画像を加工できませんでした。");
    }

    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function applyImageAdjustments(
  image: HTMLCanvasElement | HTMLImageElement,
  adjustments: ImageAdjustments
) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("画像を補正できませんでした。");
  }

  const brightness = 100 + adjustments.brightness;
  const contrast = 100 + adjustments.contrast;
  const saturation = 100 + adjustments.saturation;

  context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function exportToWebP(canvas: HTMLCanvasElement, quality = 0.85) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("WebP画像を書き出せませんでした。"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

export async function prepareArtworkBlob(
  file: File,
  cropArea: CropArea,
  adjustments: ImageAdjustments
) {
  const cropped = await cropImage(file, cropArea);
  const adjusted = applyImageAdjustments(cropped, adjustments);
  return exportToWebP(adjusted, 0.85);
}
