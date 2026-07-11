import { Loader2 } from "lucide-react";

export default function ResumeLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-900">
      <Loader2 className="mb-4 h-8 w-8 animate-spin" />
      <p className="text-sm font-medium tracking-wide">Menghasilkan Pratinjau Dokumen ATS...</p>
    </div>
  );
}
