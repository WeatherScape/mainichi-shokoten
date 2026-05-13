import { FrameShell } from "@/components/artwork/FrameShell";
import type { FrameStyle, Material } from "@/lib/types";
import { cn } from "@/lib/utils";

export type DemoArtworkVariant =
  | "watercolor"
  | "pastel"
  | "pen"
  | "pencil"
  | "acrylic"
  | "digital";

export type DemoArtwork = {
  id: string;
  material: Material;
  note: string;
  frameStyle: FrameStyle;
  variant: DemoArtworkVariant;
  imageSrc: string;
  textureLabel: string;
};

export const DEMO_ARTWORKS: DemoArtwork[] = [
  {
    id: "watercolor",
    material: "透明水彩",
    note: "朝の光がにじむ感じを残しました。",
    frameStyle: "blank",
    variant: "watercolor",
    imageSrc: "/demo-art/watercolor.png",
    textureLabel: "淡いにじみ"
  },
  {
    id: "pastel",
    material: "オイルパステル",
    note: "湯気より、あたたかい色を描きました。",
    frameStyle: "wood",
    variant: "pastel",
    imageSrc: "/demo-art/pastel.png",
    textureLabel: "重ねた厚み"
  },
  {
    id: "pen",
    material: "ペン画",
    note: "カップの影だけを線で追いました。",
    frameStyle: "mat",
    variant: "pen",
    imageSrc: "/demo-art/pen.png",
    textureLabel: "細い観察線"
  },
  {
    id: "pencil",
    material: "色鉛筆",
    note: "白い余白を多めに残しました。",
    frameStyle: "blank",
    variant: "pencil",
    imageSrc: "/demo-art/pencil.png",
    textureLabel: "やわらかな紙目"
  },
  {
    id: "acrylic",
    material: "アクリル",
    note: "机の上の光をはっきり描きました。",
    frameStyle: "black",
    variant: "acrylic",
    imageSrc: "/demo-art/acrylic.png",
    textureLabel: "くっきりした面"
  },
  {
    id: "digital",
    material: "デジタル",
    note: "静かな朝の空気を重ねました。",
    frameStyle: "mat",
    variant: "digital",
    imageSrc: "/demo-art/digital.png",
    textureLabel: "薄い光の層"
  }
];

export function DemoArtworkCard({
  artwork,
  locked = false
}: {
  artwork: DemoArtwork;
  locked?: boolean;
}) {
  return (
    <article
      className={cn(
        "group border border-line bg-wall p-3 shadow-paper transition duration-300",
        locked ? "opacity-70" : "hover:-translate-y-0.5 hover:border-sage/70 hover:shadow-hush"
      )}
    >
      <FrameShell frameStyle={artwork.frameStyle}>
        <div className={cn("aspect-square overflow-hidden bg-paper", locked && "locked-blur")}>
          <img
            src={artwork.imageSrc}
            alt={`${artwork.material}で描いたコーヒーカップ`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </FrameShell>
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="border border-line bg-paper px-2 py-1">コーヒーカップ</span>
          <span className="border border-line bg-paper px-2 py-1">{artwork.material}</span>
          <span className="border border-line bg-paper px-2 py-1 text-sage">
            {artwork.textureLabel}
          </span>
        </div>
        <p className="text-sm leading-7 text-ink">{artwork.note}</p>
      </div>
    </article>
  );
}

export function DemoArtworkGrid({ locked = false }: { locked?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {DEMO_ARTWORKS.map((artwork) => (
        <DemoArtworkCard key={artwork.id} artwork={artwork} locked={locked} />
      ))}
    </div>
  );
}
