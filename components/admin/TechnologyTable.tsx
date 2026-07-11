"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TechnologyDialog } from "@/components/admin/TechnologyDialog";
import { deleteTechnologyAction } from "@/actions/technology";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import type { Technology } from "@prisma/client";

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; tech: Technology } };

export default function TechnologyTable({ initialData }: { initialData: Technology[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((tech) =>
      [tech.name, tech.slug, tech.icon].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (tech: Technology) => setDialog({ open: true, mode: { type: "edit", tech } }),
    [],
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus teknologi "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setDeletingId(id);
    const res = await deleteTechnologyAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`"${name}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus teknologi.");
    }
  };

  return (
    <>
      {/* Dialog */}
      {dialog.open && (
        <TechnologyDialog
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
              placeholder="Cari teknologi…"
              className="w-full bg-transparent outline-none"
            />
          </label>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} item
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah
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
                <TableHead>Nama</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Diperbarui</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                    {query ? `Tidak ada hasil untuk "${query}".` : "Belum ada teknologi."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((tech, i) => (
                  <TableRow key={tech.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>
                    <TableCell>
                      {tech.icon ? (
                        tech.icon.startsWith("http") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="h-7 w-7 rounded object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.removeAttribute("hidden");
                            }}
                          />
                        ) : (
                          <span className="text-xs text-gray-500">{tech.icon}</span>
                        )
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {tech.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {tech.updatedAt.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(tech)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tech.id, tech.name)}
                          disabled={deletingId === tech.id}
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
