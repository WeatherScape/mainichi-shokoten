import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  title,
  body,
  href,
  action
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="border border-line bg-wall px-6 py-10 text-center shadow-paper">
      <p className="text-lg font-medium text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">{body}</p>
      {href && action ? (
        <ButtonLink className="mt-6" href={href}>
          {action}
        </ButtonLink>
      ) : null}
    </div>
  );
}
