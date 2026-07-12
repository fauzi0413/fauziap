import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { formatPeriod } from "@/components/public/format";
import { RelatedProjectsGallery } from "@/components/public/RelatedProjectsGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Timeline pengalaman kerja profesional.",
};

export default async function ExperiencePage() {
  const [profile, experiences, skills] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getExperiences(),
    portfolioService.getSkills(),
  ]);

  const skillOrderMap = new Map();
  skills.forEach(s => {
    if (s.technologyId) skillOrderMap.set(s.technologyId, s.displayOrder);
  });

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Experience" title="Timeline perjalanan profesional." description="Rekam jejak perjalanan karier, peran, serta kontribusi saya di berbagai perusahaan dan instansi." />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            {experiences.map((item) => {
              const companyMeta = [
                item.company, 
                item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase() : null
              ].filter(Boolean).join(" · ");
              const periodStr = formatPeriod(item.startDate, item.endDate, item.isCurrent);
              
              const sortedTechnologies = [...(item.technologies || [])].sort((a, b) => {
                const orderA = skillOrderMap.get(a.technologyId) ?? 999;
                const orderB = skillOrderMap.get(b.technologyId) ?? 999;
                return orderA - orderB || a.technology.name.localeCompare(b.technology.name);
              });

              return (
                <article id={item.id} key={item.id} className="scroll-mt-24 flex flex-col sm:flex-row items-start gap-4 border-b border-black/10 py-6 first:pt-2 last:border-b-0 last:pb-2">
                  <div className="shrink-0 mt-1">
                    {item.companyLogo && item.companyLogo.startsWith("http") ? (
                      <div className="h-12 w-12 overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.companyLogo} alt={item.company} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-black/5 border border-black/10">
                        <span className="text-lg font-bold text-black/40">{item.company.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[17px] font-semibold text-gray-900 leading-snug">{item.title}</h2>
                    <p className="mt-0.5 text-[15px] font-medium text-gray-900">{companyMeta}</p>
                    <p className="mt-1 text-[13px] text-black/55">{periodStr}</p>
                    {item.location && <p className="text-[13px] text-black/55">{item.location}</p>}
                    
                    {(item.description || item.responsibilities) && (
                      <div className="mt-4 text-[14px] leading-relaxed text-black/70">
                        {item.description && <p className="whitespace-pre-line">{item.description}</p>}
                        {item.responsibilities && <p className="mt-3 whitespace-pre-line">{item.responsibilities}</p>}
                      </div>
                    )}
                    
                    {/* Skills/Technologies Render */}
                    {sortedTechnologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {sortedTechnologies.map((tech) => (
                          <div 
                            key={tech.technology.id} 
                            className="flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-[13px] font-medium text-black/70"
                          >
                            {tech.technology.icon && tech.technology.icon.startsWith("http") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={tech.technology.icon} alt={tech.technology.name} className="h-4 w-4 object-contain" />
                            ) : (
                              tech.technology.icon ? <span>{tech.technology.icon}</span> : null
                            )}
                            {tech.technology.name}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* @ts-ignore - dynamically added projects relation */}
                    {item.projects && item.projects.length > 0 && (
                      <RelatedProjectsGallery projects={item.projects as any} limit={3} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          {experiences.length === 0 ? <EmptyState title="Experience belum tersedia" description="Tambahkan data Experience melalui dashboard admin." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}
