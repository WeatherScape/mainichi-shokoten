import { FrameShell } from "@/components/artwork/FrameShell";
import type { FrameStyle, Material } from "@/lib/types";
import { cn } from "@/lib/utils";

export const DEMO_SAMPLE_THEME = "白い花";

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
  textureLabel: string;
};

export const DEMO_ARTWORKS: DemoArtwork[] = [
  {
    id: "watercolor",
    material: "透明水彩",
    note: "花びらのふちが光に溶ける感じを残しました。",
    frameStyle: "blank",
    variant: "watercolor",
    textureLabel: "淡いにじみ"
  },
  {
    id: "pastel",
    material: "オイルパステル",
    note: "白い花のあたたかさを、厚みのある色で重ねました。",
    frameStyle: "wood",
    variant: "pastel",
    textureLabel: "重ねた厚み"
  },
  {
    id: "pen",
    material: "ペン画",
    note: "花の影だけを細い線で追いました。",
    frameStyle: "mat",
    variant: "pen",
    textureLabel: "細い観察線"
  },
  {
    id: "pencil",
    material: "色鉛筆",
    note: "紙の白を花びらに残しました。",
    frameStyle: "blank",
    variant: "pencil",
    textureLabel: "やわらかな紙目"
  },
  {
    id: "acrylic",
    material: "アクリル",
    note: "背景の色で白い花を立たせました。",
    frameStyle: "black",
    variant: "acrylic",
    textureLabel: "くっきりした面"
  },
  {
    id: "digital",
    material: "デジタル",
    note: "透ける白を少しずつ重ねました。",
    frameStyle: "mat",
    variant: "digital",
    textureLabel: "薄い光の層"
  }
];

function DemoSampleArt({ variant }: { variant: DemoArtworkVariant }) {
  return (
    <div className={cn("demo-flower-art", `demo-flower-${variant}`)}>
      <span className="demo-flower-stem" />
      <span className="demo-flower-leaf demo-flower-leaf-left" />
      <span className="demo-flower-leaf demo-flower-leaf-right" />
      <span className="demo-flower-petal demo-flower-petal-a" />
      <span className="demo-flower-petal demo-flower-petal-b" />
      <span className="demo-flower-petal demo-flower-petal-c" />
      <span className="demo-flower-petal demo-flower-petal-d" />
      <span className="demo-flower-core" />
      <span className="demo-flower-shadow" />
    </div>
  );
}

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
          <DemoSampleArt variant={artwork.variant} />
        </div>
      </FrameShell>
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="border border-line bg-paper px-2 py-1">表現サンプル</span>
          <span className="border border-line bg-paper px-2 py-1">{DEMO_SAMPLE_THEME}</span>
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
