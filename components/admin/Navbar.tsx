"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger can go here later */}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {session?.user?.name || session?.user?.email}
        </div>
        
        <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
