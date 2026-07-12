import Link from "next/link";
import type { Profile, SiteSetting } from "@prisma/client";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CvModal } from "@/components/public/CvModal";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "About", href: "/about" },
  { label: "Education", href: "/education" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
];

export function PublicShell({
  profile,
  settings,
  children,
}: {
  profile: Profile | null;
  settings?: SiteSetting | null;
  children: React.ReactNode;
}) {
  const name = settings?.siteName || profile?.fullName || "Portfolio";

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#111111]">
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
          <CvModal>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/80">
              View CV
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </CvModal>
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
