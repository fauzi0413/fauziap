"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const labels: Record<string, string> = {
  admin: "Dashboard",
  profile: "Profile",
  technologies: "Technology",
  skills: "Skill",
  projects: "Project",
  experience: "Experience",
  education: "Education",
  certificates: "Certificate",
  research: "Research",
  blog: "Blog",
  messages: "Contact Message",
  analytics: "Visitor Analytics",
  media: "Media Library",
  resume: "Resume Setting",
  settings: "Site Setting",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
      <Link href="/admin" className="hover:text-gray-950 dark:hover:text-white">
        Admin
      </Link>
      {segments.slice(1).map((segment, index) => {
        const href = `/${segments.slice(0, index + 2).join("/")}`;
        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <Link href={href} className="hover:text-gray-950 dark:hover:text-white">
              {labels[segment] ?? segment}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
