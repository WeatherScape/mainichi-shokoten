import { GalleryHorizontal } from "lucide-react";

export function WeekShareCard({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <div className="border border-sage bg-sage/10 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center border border-sage bg-wall text-sage">
        <GalleryHorizontal size={20} aria-hidden="true" />
      </div>
      <p className="mt-4 text-2xl font-light text-ink">7日間、描きました。</p>
      <p className="mt-2 text-sm leading-7 text-muted">
        あなたの小さな個展が開きました。
      </p>
    </div>
  );
}
