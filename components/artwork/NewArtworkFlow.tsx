"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Palette, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FrameShell } from "@/components/artwork/FrameShell";
import { FRAME_STYLES, MATERIALS } from "@/lib/constants";
import { prepareArtworkBlob } from "@/lib/image/canvas";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { syncEarnedBadges } from "@/lib/supabase/client-helpers";
import { uploadArtworkImage } from "@/lib/supabase/storage";
import type { ArtworkStats, FrameStyle, ImageAdjustments, Material, Theme } from "@/lib/types";
import { calculateArtworkStats, cn, getUnlockedFrames } from "@/lib/utils";

export function NewArtworkFlow({
  theme,
  userId,
  initialStats
}: {
  theme: Theme;
  userId: string;
  initialStats: ArtworkStats;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<1 | 0.8>(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0
  });
  const [material, setMaterial] = useState<Material>("透明水彩");
  const [note, setNote] = useState("");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("blank");
  const [previewSrc, setPreviewSrc] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const unlockedFrames = useMemo(
    () => getUnlockedFrames(initialStats),
    [initialStats]
  );

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!file || !croppedPixels) {
      setPreviewSrc("");
      return;
    }

    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        setIsPreviewing(true);
        const blob = await prepareArtworkBlob(file, croppedPixels, adjustments);
        const url = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setPreviewSrc(url);
      } catch {
        // The final save path will surface the detailed error.
      } finally {
        if (!cancelled) {
          setIsPreviewing(false);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [adjustments, croppedPixels, file]);

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  function handleFile(nextFile?: File) {
    setError("");
    if (!nextFile) {
      return;
    }
    if (!nextFile.type.startsWith("image/")) {
      setError("画像ファイルを選んでください。");
      return;
    }

    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }

    setFile(nextFile);
    setImageSrc(URL.createObjectURL(nextFile));
  }

  function updateAdjustment(key: keyof ImageAdjustments, value: number) {
    setAdjustments((current) => ({ ...current, [key]: value }));
  }

  async function saveArtwork() {
    setError("");
    if (!file || !croppedPixels) {
      setError("画像を選び、見せたい範囲を整えてください。");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const blob = await prepareArtworkBlob(file, croppedPixels, adjustments);
        const imageUrl = await uploadArtworkImage(userId, blob);

        const { error: insertError } = await supabase.from("artworks").insert({
          user_id: userId,
          theme_id: theme.id,
          image_url: imageUrl,
          material,
          note: note.trim() || null,
          frame_style: frameStyle
        });

        if (insertError) {
          throw new Error(insertError.message);
        }

        const { data: artworkDates } = await supabase
          .from("artworks")
          .select("created_at")
          .eq("user_id", userId);

        const stats = calculateArtworkStats(
          (artworkDates ?? []).map((item) => ({ created_at: item.created_at }))
        );
        await syncEarnedBadges(userId, stats);

        router.push(`/gallery/${theme.id}`);
        router.refresh();
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "展示室に飾れませんでした。"
        );
      }
    });
  }

  const filter = `brightness(${100 + adjustments.brightness}%) contrast(${
    100 + adjustments.contrast
  }%) saturate(${100 + adjustments.saturation}%)`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <ImagePlus size={18} aria-hidden="true" />
            画像を選ぶ
          </div>
          <label className="block cursor-pointer border border-dashed border-line bg-paper px-5 py-8 text-center transition hover:border-sage">
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <span className="text-sm text-muted">
              スマホで撮った絵を選んでください。
            </span>
          </label>
        </section>

        <section className="border border-line bg-wall p-5 shadow-paper">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <SlidersHorizontal size={18} aria-hidden="true" />
              形と明るさを整える
            </div>
            <div className="flex border border-line bg-paper text-sm">
              <button
                type="button"
                onClick={() => setAspect(1)}
                className={cn(
                  "px-3 py-2",
                  aspect === 1 ? "bg-sage text-white" : "text-muted"
                )}
              >
                正方形
              </button>
              <button
                type="button"
                onClick={() => setAspect(0.8)}
                className={cn(
                  "px-3 py-2",
                  aspect === 0.8 ? "bg-sage text-white" : "text-muted"
                )}
              >
                4:5
              </button>
            </div>
          </div>

          <div className="relative h-[420px] overflow-hidden bg-paper">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedPixels(areaPixels)}
                objectFit="contain"
                style={{
                  mediaStyle: {
                    filter
                  }
                }}
              />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-sm text-muted">
                画像を選ぶと、ここでトリミングできます。
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            <label className="text-sm text-muted">
              拡大
              <input
                className="range-input mt-2 w-full"
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>
            {[
              ["brightness", "明るさ"],
              ["contrast", "コントラスト"],
              ["saturation", "彩度"]
            ].map(([key, label]) => (
              <label key={key} className="text-sm text-muted">
                {label}
                <input
                  className="range-input mt-2 w-full"
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  value={adjustments[key as keyof ImageAdjustments]}
                  onChange={(event) =>
                    updateAdjustment(
                      key as keyof ImageAdjustments,
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border border-line bg-wall p-5 shadow-paper md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
              <Palette size={18} aria-hidden="true" />
              画材
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMaterial(item)}
                  className={cn(
                    "border px-3 py-2 text-sm transition",
                    material === item
                      ? "border-sage bg-sage text-white"
                      : "border-line bg-paper text-muted hover:border-sage"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="note">
              ひとこと
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={120}
              placeholder="例：朝の光が少しだけ入っていました。"
              className="mt-3 min-h-40 w-full resize-none border border-line bg-paper px-3 py-3 text-sm leading-7 text-ink outline-none transition focus:border-sage"
            />
            <p className="mt-2 text-xs text-muted">{note.length}/120</p>
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-6 lg:sticky lg:top-24">
        <section className="border border-line bg-wall p-5 shadow-paper">
          <p className="text-sm font-medium text-ink">額縁を選ぶ</p>
          <div className="mt-4 grid gap-2">
            {FRAME_STYLES.map((frame) => {
              const unlocked = unlockedFrames.includes(frame.id);
              return (
                <button
                  key={frame.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => setFrameStyle(frame.id)}
                  className={cn(
                    "border px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50",
                    frameStyle === frame.id
                      ? "border-sage bg-sage text-white"
                      : "border-line bg-paper text-muted hover:border-sage"
                  )}
                >
                  <span className="block">{frame.label}</span>
                  <span className="block text-xs opacity-75">{frame.unlockLabel}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="wall-band border border-line p-5 shadow-paper">
          <p className="mb-4 text-sm font-medium text-ink">白壁プレビュー</p>
          <FrameShell frameStyle={frameStyle}>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="展示プレビュー"
                  className="h-full w-full object-contain"
                />
              ) : imageSrc ? (
                <div className="grid h-full place-items-center px-4 text-center text-sm text-muted">
                  {isPreviewing ? "プレビューを整えています。" : "範囲を動かすと、飾った姿を整えます。"}
                </div>
              ) : (
                <div className="grid h-full place-items-center px-4 text-center text-sm text-muted">
                  作品を選ぶと、ここに飾った姿が出ます。
                </div>
              )}
            </div>
          </FrameShell>
          <Button className="mt-5 w-full" disabled={isPending} onClick={saveArtwork}>
            {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
            展示室に飾る
          </Button>
          {error ? (
            <p className="mt-3 border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
