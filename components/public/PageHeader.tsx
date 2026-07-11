export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:pt-24">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-black/58">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
