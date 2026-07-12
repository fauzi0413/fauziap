import { Sidebar } from "@/components/admin/Sidebar";
import { Navbar } from "@/components/admin/Navbar";
import { SessionProvider } from "@/providers/SessionProvider";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-950 dark:bg-gray-950 dark:text-white">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
