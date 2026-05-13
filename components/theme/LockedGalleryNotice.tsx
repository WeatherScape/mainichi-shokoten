import { LockKeyhole } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function LockedGalleryNotice({ themeId }: { themeId: string }) {
  return (
    <div className="wall-band border border-line px-6 py-12 text-center shadow-paper">
      <div className="mx-auto grid h-12 w-12 place-items-center border border-line bg-wall text-sage">
        <LockKeyhole size={20} aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-light text-ink">
        飾ると、みんなの見え方がひらきます。
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
        今日のテーマを描いて飾ると、同じテーマを見つめた人たちの作品が見られます。
        先に比べるためではなく、自分の線を置いてから出会うための小さな扉です。
      </p>
      <ButtonLink className="mt-7" href={`/new?themeId=${themeId}`}>
        今日のテーマを描いて飾る
      </ButtonLink>
    </div>
  );
}
