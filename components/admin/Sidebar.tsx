"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Cpu,
  GraduationCap,
  Briefcase,
  FolderDot,
  FileText,
  Mail,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Technologies", href: "/admin/technologies", icon: Cpu },
  { name: "Skills", href: "/admin/skills", icon: GraduationCap },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Projects", href: "/admin/projects", icon: FolderDot },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-16 items-center px-4 font-bold text-xl tracking-tight">
        CMS Portfolio
      </div>
      <div className="h-full overflow-y-auto flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
