import type { Metadata } from "next";
import { ArrowUpRight, Microscope, Blocks, FileText } from "lucide-react";
import { portfolioService } from "@/services/portfolio";
import { researchService } from "@/services/research";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Riset & Publikasi",
  description: "Daftar riset, publikasi ilmiah, dan dataset.",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = value(params.q)?.toLowerCase() ?? "";
  const categoryFilter = value(params.category) ?? "";
  
  const [profile, researches] = await Promise.all([
    portfolioService.getProfile(),
    researchService.getAll({ isPublic: true }),
  ]);
  
  const filtered = researches.filter((item) => {
    const matchQuery = !query || item.title.toLowerCase().includes(query);
    const matchCategory = !categoryFilter || item.category === categoryFilter;
    return matchQuery && matchCategory;
  });

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader 
          eyebrow="Riset & Publikasi" 
          title="Eksplorasi penelitian dan dataset yang telah dipublikasikan." 
          description="Karya tulis ilmiah, skripsi, tesis, serta dataset publik yang saya susun selama perjalanan akademis maupun profesional."
          backHref="/"
          backLabel="Kembali ke menu utama"
        />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <form className="flex flex-col md:flex-row gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <input 
              name="q" 
              defaultValue={query} 
              placeholder="Cari publikasi atau dataset..." 
              className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-black" 
            />
            <select 
              name="category" 
              defaultValue={categoryFilter} 
              className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-black md:w-80 bg-white"
            >
              <option value="">Semua Kategori</option>
              <option value="PUBLICATION">Jurnal / Makalah Ilmiah (Publication)</option>
              <option value="DATASET">Dataset / Kumpulan Data (Dataset)</option>
              <option value="ARTICLE">Artikel / Posting Blog (Article)</option>
            </select>
            <button 
              type="submit" 
              className="h-11 shrink-0 rounded-md bg-black px-6 font-semibold text-white transition hover:bg-black/90"
            >
              Filter
            </button>
          </form>
          <div className="mt-8 flex flex-col gap-6 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            {filtered.map((item) => (
              <article key={item.id} className="flex gap-4 border-b border-black/10 pb-6 rounded transition hover:bg-black/[0.02] p-4 last:border-0 last:pb-0">
                <div className="shrink-0 mt-1">
                  {item.image ? (
                    <div className="h-12 w-12 overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="Thumbnail" className="h-full w-full object-cover border border-black/10 rounded-sm bg-black/5" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
                      {item.category === "DATASET" ? (
                        <Blocks className="h-6 w-6 text-blue-500" />
                      ) : (
                        <FileText className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col w-full">
                  <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  {item.authors && (
                    <p className="mt-0.5 text-[15px] text-gray-900">{item.authors}</p>
                  )}
                  <p className="mt-0.5 text-[14px] text-black/60 font-medium">
                    <span className="inline-flex rounded bg-blue-50 px-1 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 mr-2 uppercase">
                      {item.category}
                    </span>
                    Diterbitkan oleh {item.publisher} pada {item.publishDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                  </p>
                  
                  {item.description && (
                    <p className="mt-2 text-[14px] text-black/70 leading-relaxed text-justify">
                      <span className="text-black font-bold">Abstrak - </span>
                      {item.description}
                    </p>
                  )}
                  
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex max-w-fit items-center gap-2 rounded-full border border-black/40 bg-transparent px-4 py-1.5 text-[14px] font-semibold text-black/75 transition hover:bg-black/5 hover:text-black hover:border-black/60"
                    >
                      Lihat publikasi
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? <EmptyState title="Publikasi belum tersedia" description="Pencarian tidak menemukan hasil." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}
