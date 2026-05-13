import Link from "next/link";
import { MATERIALS } from "@/lib/constants";
import type { Material } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MaterialFilter({
  themeId,
  current
}: {
  themeId: string;
  current?: string;
}) {
  const items: Array<Material | "すべて"> = ["すべて", ...MATERIALS];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {items.map((material) => {
        const active = material === "すべて" ? !current : current === material;
        const href =
          material === "すべて"
            ? `/gallery/${themeId}`
            : `/gallery/${themeId}?material=${encodeURIComponent(material)}`;

        return (
          <Link
            key={material}
            href={href}
            className={cn(
              "shrink-0 border px-3 py-2 text-sm transition",
              active
                ? "border-sage bg-sage text-white"
                : "border-line bg-wall text-muted hover:border-sage hover:text-ink"
            )}
          >
            {material}
          </Link>
        );
      })}
    </div>
  );
}
