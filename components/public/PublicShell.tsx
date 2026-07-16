import Link from "next/link";
import type { Profile, SiteSetting } from "@prisma/client";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { portfolioService } from "@/services/portfolio";
import { siteSettingService } from "@/services/site-setting";
import { VisitorTracker } from "@/components/public/VisitorTracker";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "About", href: "/about" },
  { label: "Education", href: "/education" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
];

export async function PublicShell({
  profile: initialProfile,
  settings: initialSettings,
  children,
}: {
  profile?: Profile | null;
  settings?: SiteSetting | null;
  children: React.ReactNode;
}) {
  const profile = initialProfile !== undefined ? initialProfile : await portfolioService.getProfile();
  const settings = initialSettings !== undefined ? initialSettings : await siteSettingService.getSetting();
  const name = settings?.siteName || profile?.fullName || "Portfolio";

  if (settings?.maintenanceMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f4] px-5 text-center text-[#111111]">
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Sedang Dalam Perbaikan</h1>
        <p className="max-w-md text-black/60">
          Situs ini sedang dalam masa pemeliharaan (maintenance) untuk sementara waktu. Silakan kembali lagi nanti.
        </p>
        <p className="text-sm text-black/55 mt-4">Anda bisa menghubungi email saya di <a href={`mailto:${profile?.email}`} target="_blank" rel="noopener noreferrer" className="font-semibold">{profile?.email}</a></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#111111]">
      <VisitorTracker />
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f7f4]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            {name}
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-black/60 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/preview-resume"
            target="_blank"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            View CV
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>
      {children}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">{name}</p>
            <p className="mt-1 text-sm text-black/55">
              {settings?.footerText || "Personal Portfolio CMS powered by Next.js."}
            </p>
          </div>
          <div className="flex flex-col md:items-end text-sm text-black/55">
            <p>&copy; {new Date().getFullYear()} {settings?.copyrightName || "Developer"}</p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.githubUrl ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-black/10 p-2 transition hover:bg-white"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </a>
            ) : null}
            {profile?.linkedinUrl ? (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-black/10 p-2 transition hover:bg-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            ) : null}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-black/10 p-2 transition hover:bg-white"
                aria-label="Contact"
              >
                <Mail className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
