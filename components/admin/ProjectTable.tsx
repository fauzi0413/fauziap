"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteProjectAction } from "@/actions/project";
import { toast } from "sonner";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Star,
  Globe,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Project, ProjectImage, ProjectTechnology, Technology } from "@prisma/client";

export type ProjectWithRelations = Project & {
  technologies: (ProjectTechnology & { technology: Technology })[];
  images: ProjectImage[];
  // These fields are added in the pending migration — extend type manually until client is regenerated
  isPublished: boolean;
  isFeatured: boolean;
};

type DialogState = { open: false } | { open: true; project: ProjectWithRelations };

export default function ProjectTable({ initialData }: { initialData: ProjectWithRelations[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((p) =>
      [p.title, p.slug, p.shortDescription]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [initialData, query]);

  const openConfirm = useCallback((project: ProjectWithRelations) => {
    setConfirmDialog({ open: true, project });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    const res = await deleteProjectAction(id);
    setDeletingId(null);
    setConfirmDialog({ open: false });

    if (res.success) {
      toast.success(`Project "${title}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus project.");
    }
  };

  return (
    <>
      {/* Confirm Delete Modal */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDialog({ open: false })} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <h3 className="font-semibold text-gray-950 dark:text-white">Hapus Project?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Project <span className="font-medium text-gray-800 dark:text-gray-200">&quot;{confirmDialog.project.title}&quot;</span> beserta semua gallery dan data terkait akan dihapus permanen.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDialog({ open: false })} disabled={!!deletingId}>
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={!!deletingId}
                onClick={() => handleDelete(confirmDialog.project.id, confirmDialog.project.title)}
              >
                {deletingId ? "Menghapus…" : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
          <label className="flex h-10 max-w-sm flex-1 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm text-gray-500 dark:border-gray-700">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari project…"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} project
            </span>
            <Button size="sm" asChild>
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="w-16">Thumb</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Teknologi</TableHead>
                <TableHead className="w-20 text-center">Gallery</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                    {query ? `Tidak ada hasil untuk "${query}".` : 'Belum ada project. Klik "Tambah Project" untuk mulai.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((project, i) => (
                  <TableRow key={project.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>

                    {/* Thumbnail */}
                    <TableCell>
                      {project.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    {/* Title + slug */}
                    <TableCell>
                      <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                          {project.slug}
                        </code>
                        {project.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            <Star className="h-3 w-3" /> Featured
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Technologies */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map(({ technology }) => (
                          <span
                            key={technology.id}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {technology.name}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-gray-800">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Gallery count */}
                    <TableCell className="text-center">
                      <span className="text-sm text-gray-500">
                        {project.images.length > 0 ? `${project.images.length} foto` : <span className="text-gray-300">—</span>}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      {project.isPublished ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                          <Eye className="h-3 w-3" /> Publish
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <EyeOff className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {project.demoUrl && (
                          <Button variant="ghost" size="icon" asChild title="Lihat Demo">
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openConfirm(project)}
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
