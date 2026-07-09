import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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
        <PageHeader eyebrow="Certificates" title="Sertifikasi dan kredensial." description="Cari dan buka credential URL sertifikat yang tersimpan di database." />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <form className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <input name="q" defaultValue={query} placeholder="Cari sertifikat..." className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-black" />
          </form>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {filtered.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
                <div className="aspect-[16/10] bg-black/[0.04]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-black/55">{item.issuer}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/35">{item.issueDate.toLocaleDateString("id-ID")}</p>
                  {item.credentialUrl ? <a href={item.credentialUrl} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Credential <ArrowUpRight className="h-4 w-4" /></a> : null}
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
