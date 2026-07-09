"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  FileBadge,
  LayoutDashboard,
  User,
  Cpu,
  GraduationCap,
  Briefcase,
  FolderDot,
  FileText,
  Mail,
  Images,
  Microscope,
  ScrollText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Technology", href: "/admin/technologies", icon: Cpu },
  { name: "Skill", href: "/admin/skills", icon: Boxes },
  { name: "Project", href: "/admin/projects", icon: FolderDot },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Certificate", href: "/admin/certificates", icon: FileBadge },
  { name: "Research", href: "/admin/research", icon: Microscope },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Contact Message", href: "/admin/messages", icon: Mail },
  { name: "Visitor Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Media Library", href: "/admin/media", icon: Images },
  { name: "Resume Setting", href: "/admin/resume", icon: ScrollText },
  { name: "Site Setting", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-72 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex">
      <div className="flex h-16 items-center border-b border-gray-100 px-5 dark:border-gray-800">
        <div>
          <p className="text-lg font-semibold tracking-tight">Portfolio CMS</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin workspace</p>
        </div>
      </div>
      <div className="h-full overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          Content
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-gray-950 font-medium text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
