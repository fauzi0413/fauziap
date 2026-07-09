"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 w-full items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900 md:px-6">
      <div className="min-w-0">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <label className="hidden h-10 w-72 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 md:flex">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search portfolio content..."
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </label>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <ThemeSwitcher />
        <div className="hidden items-center gap-2 rounded-md border border-gray-200 px-3 py-2 dark:border-gray-800 lg:flex">
          <User className="h-4 w-4 text-gray-500" />
          <div className="max-w-44 truncate text-sm font-medium text-gray-700 dark:text-gray-300">
            {session?.user?.name || session?.user?.email || "Administrator"}
          </div>
        </div>
        
        <Button variant="outline" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
