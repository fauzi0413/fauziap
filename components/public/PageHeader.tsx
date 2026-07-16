import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:pt-24">
      {backHref && (
        <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-black/40 transition hover:text-black">
          <ArrowLeft className="h-4 w-4" />
          {backLabel ?? "Kembali"}
        </Link>
      )}
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-black/58 text-justify">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
