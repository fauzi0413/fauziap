"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResearchDialog } from "@/components/admin/ResearchDialog";
import { deleteResearchAction } from "@/actions/research";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2, Microscope, FileText, Blocks } from "lucide-react";
import type { Research } from "@prisma/client";

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; data: Research } };

export default function ResearchTable({ initialData }: { initialData: Research[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((item) =>
      [item.title, item.publisher, item.category, item.authors]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (data: Research) => setDialog({ open: true, mode: { type: "edit", data } }),
    []
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus entri "${label}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    const res = await deleteResearchAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`"${label}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus data.");
    }
  };

  return (
    <>
      {dialog.open && (
        <ResearchDialog
          mode={dialog.mode}
          open={dialog.open}
          onClose={closeDialog}
          onSuccess={onSuccess}
        />
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
          <label className="flex h-10 max-w-sm flex-1 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm text-gray-500 dark:border-gray-700">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, publisher, atau penulis..."
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} entri
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Riset
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="w-12">Thumbnail</TableHead>
                <TableHead>Judul & Penulis</TableHead>
                <TableHead>Kategori & Penerbit</TableHead>
                <TableHead>Tgl Publikasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                    {query
                      ? `Tidak ada hasil untuk "${query}".`
                      : 'Belum ada data riset. Klik "Tambah Riset" untuk mulai.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>
                    <TableCell>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt="thumbnail"
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          {item.category === "DATASET" ? (
                             <Blocks className="h-5 w-5 text-gray-400" />
                          ) : (
                             <FileText className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 max-w-[280px]">
                        {item.title}
                      </p>
                      {item.authors && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.authors}</p>
                      )}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1">
                          <span className="inline-flex max-w-fit rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {item.category}
                          </span>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {item.publisher}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell>
                      {item.publishDate.toLocaleDateString("id-ID", {
                         year: "numeric",
                         month: "short", 
                         day: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.isPublic
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {item.isPublic ? "Publik" : "Disembunyikan"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deletingId === item.id}
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
