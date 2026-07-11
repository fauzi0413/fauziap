"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EducationDialog } from "@/components/admin/EducationDialog";
import { deleteEducationAction } from "@/actions/education";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2, GraduationCap, CalendarDays } from "lucide-react";
import type { Education } from "@prisma/client";

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; education: Education } };

function formatDateRange(start: Date, end: Date | null): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  return end ? `${fmt(start)} — ${fmt(end)}` : `${fmt(start)} — Sekarang`;
}

export default function EducationTable({ initialData }: { initialData: Education[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((edu) =>
      [edu.institution, edu.degree, edu.major, edu.gpa]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (education: Education) => setDialog({ open: true, mode: { type: "edit", education } }),
    [],
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus data pendidikan "${label}"?`)) return;
    setDeletingId(id);
    const res = await deleteEducationAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`"${label}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus.");
    }
  };

  return (
    <>
      {dialog.open && (
        <EducationDialog
          mode={dialog.mode}
          open={dialog.open}
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
              placeholder="Cari institusi, jurusan…"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} entri
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pendidikan
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
                <TableHead>Institusi</TableHead>
                <TableHead>Jenjang &amp; Jurusan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead className="w-20 text-center">IPK</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                    {query
                      ? `Tidak ada hasil untuk "${query}".`
                      : "Belum ada riwayat pendidikan. Klik \"Tambah Pendidikan\" untuk mulai."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((edu, i) => (
                  <TableRow key={edu.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>

                    {/* Logo */}
                    <TableCell>
                      {edu.institutionLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={edu.institutionLogo}
                          alt={edu.institution}
                          className="h-8 w-8 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    {/* Institution */}
                    <TableCell className="font-medium">{edu.institution}</TableCell>

                    {/* Degree + Major */}
                    <TableCell>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{edu.degree}</p>
                      {edu.major && (
                        <p className="text-xs text-gray-400">{edu.major}</p>
                      )}
                    </TableCell>

                    {/* Date range */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </span>
                      {!edu.endDate && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                          Aktif
                        </span>
                      )}
                    </TableCell>

                    {/* GPA */}
                    <TableCell className="text-center">
                      {edu.gpa ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          {edu.gpa}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(edu)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(edu.id, edu.institution)}
                          disabled={deletingId === edu.id}
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
