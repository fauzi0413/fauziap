import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import Link from "next/link";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { formatPeriod } from "@/components/public/format";
import { RelatedProjectsGallery } from "@/components/public/RelatedProjectsGallery";
import { RelatedExperiencesList } from "@/components/public/RelatedExperiencesList";

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
        <PageHeader eyebrow="Education" title="Riwayat pendidikan." description="Rekam jejak akademis dan pengembangan ilmu pengetahuan yang membentuk landasan berpikir serta penyelesaian masalah secara terstruktur." />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            {educations.map((item) => {
              const metaInfo = [item.degree, item.major].filter(Boolean).join(" - ");
              return (
                <article id={item.id} key={item.id} className="scroll-mt-24 flex flex-col sm:flex-row items-start gap-4 border-b border-black/10 py-6 first:pt-2 last:border-b-0 last:pb-2">
                  <div className="shrink-0 mt-1">
                    {item.institutionLogo && item.institutionLogo.startsWith("http") ? (
                      <div className="h-12 w-12 overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.institutionLogo} alt={item.institution} className="h-full w-full object-contain border border-black/10 rounded-sm bg-black/5" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-black/5 border border-black/10">
                        <span className="text-lg font-bold text-black/40">{item.institution.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <h2 className="text-[17px] font-semibold text-gray-900 leading-snug">{item.institution}</h2>
                    {metaInfo ? <p className="mt-0.5 text-[15px] font-medium text-gray-900">{metaInfo}</p> : null}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-black/55">
                      <span>{formatPeriod(item.startDate, item.endDate)}</span>
                      {(item.gpa || item.predicate) && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-black/20" />
                          <span className="font-bold text-gray-900 dark:text-gray-900">
                            {[item.gpa ? `GPA ${item.gpa}` : null, item.predicate].filter(Boolean).join(" · ")}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {item.description && (
                      <div className="mt-4 text-[14px] leading-relaxed text-black/70 whitespace-pre-line">
                        {item.description}
                      </div>
                    )}
                    
                    {/* @ts-ignore */}
                    {item.finalProject && (
                      <div className="mt-5 rounded-md border border-gray-100 bg-gray-50/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 mb-1">
                          Hasil Tugas Akhir
                        </p>
                        {/* @ts-ignore */}
                        <p className="text-[14px] font-medium text-gray-900 leading-snug">
                          {/* @ts-ignore */}
                          {item.finalProject.url ? (
                            // @ts-ignore
                            <a href={item.finalProject.url} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">
                              {/* @ts-ignore */}
                              {item.finalProject.title}
                            </a>
                          ) : (
                            // @ts-ignore
                            item.finalProject.title
                          )}
                        </p>
                      </div>
                    )}

                    {item.projects && item.projects.length > 0 && (
                      <RelatedProjectsGallery projects={item.projects} limit={3} />
                    )}

                    {/* @ts-ignore - experiences dynamically added to prisma return */}
                    {item.experiences && item.experiences.length > 0 && (
                      <RelatedExperiencesList experiences={item.experiences as any} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          {educations.length === 0 ? <EmptyState title="Education belum tersedia" description="Tambahkan data Education melalui dashboard admin." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}
