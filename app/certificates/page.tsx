import type { Metadata } from "next";
import { ArrowUpRight, Award } from "lucide-react";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Daftar sertifikat profesional.",
};

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = value(params.q)?.toLowerCase() ?? "";
  const [profile, certificates] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getCertificates(),
  ]);
  const filtered = certificates.filter((item) =>
    [item.name, item.issuer, item.credentialId].filter(Boolean).join(" ").toLowerCase().includes(query),
  );

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader 
          eyebrow="Certificates" 
          title="Sertifikasi dan kredensial." 
          description="Rekam jejak profesional yang memvalidasi keahlian, kompetensi, dan komitmen saya terhadap pembelajaran berkelanjutan."
          backHref="/"
          backLabel="Kembali ke menu utama"
        />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <form className="flex flex-col md:flex-row gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <input 
              name="q" 
              defaultValue={query} 
              placeholder="Cari sertifikat..." 
              className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-black" 
            />
            <button 
              type="submit" 
              className="h-11 shrink-0 rounded-md bg-black px-6 font-semibold text-white transition hover:bg-black/90"
            >
              Cari
            </button>
          </form>
          <div className="mt-8 flex flex-col gap-6 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            {filtered.map((cert) => (
              <article key={cert.id} className="flex gap-4 border-b border-black/10 pb-6 rounded transition hover:bg-black/[0.02] p-4 last:border-0 last:pb-0">
                <div className="shrink-0 mt-1">
                  {cert.issuerLogo ? (
                    <div className="h-12 w-12 overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cert.issuerLogo} alt={cert.issuer} className="h-full w-full object-contain border border-black/10 rounded-sm bg-black/5" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-black/5 border border-black/10">
                      <Award className="h-6 w-6 text-black/40" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col w-full">
                  <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
                    {cert.name}
                  </h3>
                  <p className="mt-0.5 text-[15px] text-gray-900">{cert.issuer}</p>
                  <p className="max-w-md mt-0.5 text-[14px] text-black/60 font-medium">
                    Dikeluarkan {cert.issueDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                    {cert.expiryDate ? ` · Berakhir ${cert.expiryDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}` : ""}
                  </p>
                  
                  {cert.credentialId && (
                    <p className="mt-0.5 text-[14px] text-black/60 font-medium">ID Kredensial {cert.credentialId}</p>
                  )}
                  
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex max-w-fit items-center gap-2 rounded-full border border-black/40 bg-transparent px-4 py-1.5 text-[14px] font-semibold text-black/75 transition hover:bg-black/5 hover:text-black hover:border-black/60"
                    >
                      Tampilkan kredensial
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? <EmptyState title="Certificate belum tersedia" description="Tambahkan data Certificate melalui dashboard admin." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}
