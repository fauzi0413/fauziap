import Link from "next/link";

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-black/15 bg-white/60 p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-black/55">{description}</p>
      {href && action ? (
        <Link
          href={href}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-semibold text-white"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
