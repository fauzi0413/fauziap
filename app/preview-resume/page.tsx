import { resumeSettingService } from "@/services/resume-setting";
import { portfolioService } from "@/services/portfolio";
import { experienceService } from "@/services/experience";
import { educationService } from "@/services/education";
import { skillService } from "@/services/skill";
import { projectService } from "@/services/project";
import { certificateService } from "@/services/certificate";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/ui/print-button";

export const dynamic = "force-dynamic";

export default async function PreviewResumePage() {
  const [
    settings,
    profile,
    experiences,
    educations,
    skills,
    projects,
    certificates
  ] = await Promise.all([
    resumeSettingService.getSetting(),
    portfolioService.getProfile(),
    experienceService.getAll(),
    educationService.getAll(),
    skillService.getAll(),
    projectService.getAll(),
    certificateService.getAll()
  ]);

  // Try to get user email if not in profile
  const user = await prisma.user.findFirst();
  const email = user?.email || "";

  let order: string[] = [];
  try {
    order = settings.sectionOrder ? JSON.parse(settings.sectionOrder) : [];
  } catch {
    order = ["experience", "education", "skills", "projects", "certificates"];
  }

  // Format Date for ATS
  const formatDate = (date: Date | null) => {
    if (!date) return "Present";
    const d = new Date(date);
    return `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
  };

  // Sections config mapping
  const components: Record<string, React.ReactNode> = {
    experience: settings.showExperience && experiences.length > 0 && (
      <section key="experience" className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-lg font-bold uppercase tracking-wider text-black">
          Experience
        </h2>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-bold text-black">{exp.title}</h3>
                <span className="text-sm font-medium text-black">
                  {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-black italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
              </div>
              {/* ATS loves standard bullets */}
              {(exp.description || exp.responsibilities) && (
                <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-black">
                  {exp.description && <li className="pl-1">{exp.description}</li>}
                  {exp.responsibilities && <li className="pl-1">{exp.responsibilities}</li>}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    education: settings.showEducation && educations.length > 0 && (
      <section key="education" className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-lg font-bold uppercase tracking-wider text-black">
          Education
        </h2>
        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-bold text-black">{edu.institution}</h3>
                <span className="text-sm font-medium text-black">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-black">
                <span>{edu.degree}{edu.major ? ` in ${edu.major}` : ""}</span>
                <div className="flex gap-2">
                  {edu.gpa && <span className="text-sm">GPA: {edu.gpa}</span>}
                  {edu.predicate && <span className="text-sm">({edu.predicate})</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    skills: settings.showSkills && skills.length > 0 && (
      <section key="skills" className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-lg font-bold uppercase tracking-wider text-black">
          Skills
        </h2>
        <div className="text-sm text-black">
          {skills.some(s => s.type === "HARD") && (
            <div className="mb-1">
              <span className="font-bold">Hard Skills: </span>
              <span>{skills.filter(s => s.type === "HARD").map((s) => s.technology?.name).filter(Boolean).join(", ")}</span>
            </div>
          )}
          {skills.some(s => s.type === "SOFT") && (
            <div className="mb-1">
              <span className="font-bold">Soft Skills: </span>
              <span>{skills.filter(s => s.type === "SOFT").map((s) => s.name).filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
      </section>
    ),

    projects: settings.showProjects && projects.length > 0 && (
      <section key="projects" className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-lg font-bold uppercase tracking-wider text-black">
          Projects
        </h2>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-black">{proj.title}</h3>
                  {proj.repositoryUrl && (
                    <a href={proj.repositoryUrl} className="text-sm underline text-black">
                      [Repository]
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} className="text-sm underline text-black">
                      [Demo]
                    </a>
                  )}
                </div>
              </div>
              {proj.shortDescription && (
                <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-black">
                  <li className="pl-1">{proj.shortDescription}</li>
                  {/* Join project technologies as a bullet point */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <li className="pl-1">
                      <strong>Tech Stack: </strong>
                      {proj.technologies.map(t => t.technology.name).join(", ")}
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    certificates: settings.showCertificates && certificates.length > 0 && (
      <section key="certificates" className="mb-6 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-lg font-bold uppercase tracking-wider text-black">
          Certifications
        </h2>
        <div className="space-y-2 text-sm text-black">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <div>
                <span className="font-bold">{cert.name}</span>
                <span> – {cert.issuer}</span>
                {cert.credentialId && <span> (ID: {cert.credentialId})</span>}
              </div>
              <span>{formatDate(cert.issueDate)}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  };

  // Compile Contacts
  const contacts = [
    profile?.email || email, // Use profile email first, fallback to account email
    profile?.phone,
    profile?.location,
    profile?.linkedinUrl ? profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "") : null,
    profile?.githubUrl ? profile.githubUrl.replace(/^https?:\/\/(www\.)?/, "") : null,
    profile?.websiteUrl ? profile.websiteUrl.replace(/^https?:\/\/(www\.)?/, "") : null,
  ].filter(Boolean);

  return (
    <>
      <PrintButton />

      <div className="min-h-screen bg-gray-200 py-10 print:bg-white print:py-0 font-sans">
        {/* A4 Container */}
        <div className="mx-auto max-w-[210mm] bg-white p-[15mm] shadow-xl xl:p-[20mm] print:m-0 print:max-w-none print:shadow-none print:p-0">
          
          {/* ── ATS Header ── */}
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-black">
              {profile?.fullName || "Nama Anda"}
            </h1>
            {profile?.title && (
              <p className="mt-1 text-black font-medium">{profile.title}</p>
            )}
            
            {/* Contact Pipes */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black">
              {contacts.map((contact, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="hover:underline">{contact}</span>
                  {i !== contacts.length - 1 && <span className="text-gray-400">|</span>}
                </div>
              ))}
            </div>
          </header>

          {/* ── Summary / Bio ── */}
          {profile?.shortBio && (
            <section className="mb-6 text-sm text-black text-justify" style={{ textJustify: "inter-word" }}>
              <p>{profile.shortBio}</p>
            </section>
          )}

          {/* ── Ordered Sections ── */}
          <div className="flex flex-col gap-0">
            {order.map((key) => components[key] || null)}
          </div>
          
        </div>
      </div>
    </>
  );
}
