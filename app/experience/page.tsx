import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { formatPeriod } from "@/components/public/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Timeline pengalaman kerja profesional.",
};

export default async function ExperiencePage() {
  const [profile, experiences] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getExperiences(),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Experience" title="Timeline perjalanan profesional." description="Pengalaman kerja ditampilkan langsung dari tabel Experience." />
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <div className="space-y-5">
            {experiences.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm md:grid-cols-[220px_1fr]">
                <div>
                  <p className="text-sm font-semibold text-black/50">{formatPeriod(item.startDate, item.endDate, item.isCurrent)}</p>
                  {item.type ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/35">{item.type}</p> : null}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-1 font-medium text-black/58">{item.company}{item.location ? ` - ${item.location}` : ""}</p>
                  {item.description ? <p className="mt-4 whitespace-pre-line leading-7 text-black/62">{item.description}</p> : null}
                  {item.responsibilities ? <p className="mt-4 whitespace-pre-line leading-7 text-black/62">{item.responsibilities}</p> : null}
                </div>
              </article>
            ))}
          </div>
          {experiences.length === 0 ? <EmptyState title="Experience belum tersedia" description="Tambahkan data Experience melalui dashboard admin." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}
