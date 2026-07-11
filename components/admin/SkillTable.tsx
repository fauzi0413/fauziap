"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SkillDialog } from "@/components/admin/SkillDialog";
import { deleteSkillAction } from "@/actions/skill";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2, Eye, EyeOff } from "lucide-react";
import type { Skill, Technology } from "@prisma/client";

export type SkillWithTechnology = Skill & { technology: Technology };

const LEVEL_COLOR: Record<string, string> = {
  Beginner:     "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  Elementary:   "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Intermediate: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Advanced:     "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  Expert:       "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
};

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; skill: SkillWithTechnology } };

export default function SkillTable({
  initialData,
  technologies,
}: {
  initialData: SkillWithTechnology[];
  technologies: Technology[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((skill) =>
      [skill.technology.name, skill.level, skill.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (skill: SkillWithTechnology) => setDialog({ open: true, mode: { type: "edit", skill } }),
    [],
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus skill "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    const res = await deleteSkillAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`Skill "${name}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus skill.");
    }
  };

  return (
    <>
      {dialog.open && (
        <SkillDialog
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
              placeholder="Cari skill…"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} skill
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Skill
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Teknologi</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="w-24 text-center">Urutan</TableHead>
                <TableHead className="w-28 text-center">Publik</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-gray-400">
                    {query ? `Tidak ada hasil untuk "${query}".` : "Belum ada skill. Klik \"Tambah Skill\" untuk mulai."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((skill, i) => (
                  <TableRow key={skill.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>

                    {/* Icon */}
                    <TableCell>
                      {skill.technology.icon?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={skill.technology.icon}
                          alt={skill.technology.name}
                          className="h-7 w-7 rounded object-contain"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* Technology name */}
                    <TableCell className="font-medium">{skill.technology.name}</TableCell>

                    {/* Level badge */}
                    <TableCell>
                      {skill.level ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR[skill.level] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {skill.level}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      {skill.category ? (
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {skill.category}
                        </code>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>

                    {/* Display order */}
                    <TableCell className="text-center text-sm text-gray-500">
                      {skill.displayOrder}
                    </TableCell>

                    {/* isPublic */}
                    <TableCell className="text-center">
                      {skill.isPublic ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                          <Eye className="h-3 w-3" /> Publik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(skill)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(skill.id, skill.technology.name)}
                          disabled={deletingId === skill.id}
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
