import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { formatPeriod } from "@/components/public/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Education",
  description: "Timeline pendidikan dan pencapaian akademik.",
};

export default async function EducationPage() {
  const [profile, educations] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getEducations(),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Education" title="Riwayat pendidikan." description="Data pendidikan diambil dari tabel Education." />
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <div className="space-y-5">
            {educations.map((item) => (
              <article key={item.id} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold">{item.institution}</h2>
                    <p className="mt-1 text-black/58">{[item.degree, item.major].filter(Boolean).join(" - ")}</p>
                  </div>
                  <p className="text-sm font-semibold text-black/45">{formatPeriod(item.startDate, item.endDate)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.gpa ? <span className="rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold">IPK {item.gpa}</span> : null}
                </div>
                {item.description ? <p className="mt-4 whitespace-pre-line leading-7 text-black/62">{item.description}</p> : null}
              </article>
            ))}
          </div>
          {educations.length === 0 ? <EmptyState title="Education belum tersedia" description="Tambahkan data Education melalui dashboard admin." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}
