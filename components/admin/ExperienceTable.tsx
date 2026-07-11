"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExperienceDialog } from "@/components/admin/ExperienceDialog";
import { deleteExperienceAction } from "@/actions/experience";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2, Briefcase, CalendarDays } from "lucide-react";
import type { Experience, ExperienceTechnology, Technology } from "@prisma/client";

export type ExperienceWithRelations = Experience & {
  technologies: (ExperienceTechnology & { technology: Technology })[];
};

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; experience: ExperienceWithRelations } };

function formatDateRange(start: Date, end: Date | null, isCurrent: boolean): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  if (isCurrent || !end) return `${fmt(start)} — Sekarang`;
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function ExperienceTable({
  initialData,
  technologies,
}: {
  initialData: ExperienceWithRelations[];
  technologies: Technology[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((exp) =>
      [exp.title, exp.company, exp.location, exp.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (exp: ExperienceWithRelations) => setDialog({ open: true, mode: { type: "edit", experience: exp } }),
    []
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus pengalaman kerja di "${label}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    const res = await deleteExperienceAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`Pengalaman di "${label}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus data.");
    }
  };

  return (
    <>
      {dialog.open && (
        <ExperienceDialog
          mode={dialog.mode}
          open={dialog.open}
          technologies={technologies}
          onClose={closeDialog}
          onSuccess={onSuccess}
        />
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
          <label className="flex h-10 max-w-sm flex-1 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm text-gray-500 dark:border-gray-700">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari posisi, perusahaan…"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} entri
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengalaman
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="w-12">Logo</TableHead>
                <TableHead>Posisi &amp; Perusahaan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Lokasi &amp; Tipe</TableHead>
                <TableHead>Teknologi</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                    {query
                      ? `Tidak ada hasil untuk "${query}".`
                      : 'Belum ada riwayat pengalaman. Klik "Tambah Pengalaman" untuk mulai.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((exp, i) => (
                  <TableRow key={exp.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>

                    {/* Logo */}
                    <TableCell>
                      {exp.companyLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={exp.companyLogo}
                          alt={exp.company}
                          className="h-8 w-8 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    {/* Title + Company */}
                    <TableCell>
                      <p className="font-semibold text-gray-900 dark:text-white">{exp.title}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{exp.company}</p>
                    </TableCell>

                    {/* Date range */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                      </span>
                      {exp.isCurrent && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                          Aktif
                        </span>
                      )}
                    </TableCell>

                    {/* Location + Type */}
                    <TableCell>
                      <div className="space-y-1">
                        {exp.location && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">{exp.location}</p>
                        )}
                        {exp.type && (
                          <span className="inline-flex rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {exp.type}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Technologies */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.slice(0, 3).map(({ technology }) => (
                          <span
                            key={technology.id}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {technology.name}
                          </span>
                        ))}
                        {exp.technologies.length > 3 && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-800">
                            +{exp.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(exp)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exp.id, exp.company)}
                          disabled={deletingId === exp.id}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
