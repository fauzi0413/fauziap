import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { ProjectCard } from "@/components/public/ProjectCard";
import { formatPeriod } from "@/components/public/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume dinamis yang dibentuk dari data portfolio CMS.",
};

export default async function ResumePage() {
  const [profile, skills, experiences, educations, projects, certificates] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getSkills(),
    portfolioService.getExperiences(),
    portfolioService.getEducations(),
    portfolioService.getProjects({ pageSize: 3 }),
    portfolioService.getCertificates(),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Resume" title={profile?.fullName ?? "Resume dinamis"} description={profile?.shortBio ?? "Resume ini dibentuk dari data Profile, Experience, Education, Skill, Project, dan Certificate."} />
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-5">
            <Box title="Profile">
              <p className="leading-7 text-black/62">{profile?.fullBio ?? profile?.shortBio ?? "Profile belum diisi."}</p>
            </Box>
            <Box title="Hard Skills">
              <div className="flex flex-wrap gap-2">
                {skills.filter(s => s.type === "HARD").map((skill) => <span key={skill.id} className="rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold">{skill.technology?.name}</span>)}
              </div>
              {skills.filter(s => s.type === "HARD").length === 0 ? <EmptyState title="Belum ada Hard Skill" description="Data Hard Skill belum tersedia." /> : null}
            </Box>
            <Box title="Soft Skills">
              <div className="flex flex-wrap gap-2">
                {skills.filter(s => s.type === "SOFT").map((skill) => <span key={skill.id} className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium">{skill.name}</span>)}
              </div>
              {skills.filter(s => s.type === "SOFT").length === 0 ? <EmptyState title="Belum ada Soft Skill" description="Data Soft Skill belum tersedia." /> : null}
            </Box>
            <Box title="Certificates">
              {certificates.slice(0, 5).map((item) => <p key={item.id} className="border-b border-black/10 py-2 text-sm font-semibold last:border-b-0">{item.name}</p>)}
            </Box>
          </aside>
          <div className="space-y-5">
            <Box title="Experience">
              {experiences.map((item) => (
                <div key={item.id} className="border-b border-black/10 py-4 last:border-b-0">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-black/55">{item.company} - {formatPeriod(item.startDate, item.endDate, item.isCurrent)}</p>
                </div>
              ))}
            </Box>
            <Box title="Education">
              {educations.map((item) => (
                <div key={item.id} className="border-b border-black/10 py-4 last:border-b-0">
                  <p className="font-semibold">{item.institution}</p>
                  <p className="text-sm text-black/55">{[item.degree, item.major].filter(Boolean).join(" - ")}</p>
                </div>
              ))}
            </Box>
            <Box title="Selected Projects">
              <div className="grid gap-4 md:grid-cols-3">
                {projects.items.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            </Box>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
