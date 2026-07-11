"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CertificateDialog } from "@/components/admin/CertificateDialog";
import { deleteCertificateAction } from "@/actions/certificate";
import { toast } from "sonner";
import { Edit, Plus, Search, Trash2, Award, ExternalLink, Eye, EyeOff } from "lucide-react";
import type { Certificate } from "@prisma/client";

type DialogState =
  | { open: false }
  | { open: true; mode: { type: "create" } }
  | { open: true; mode: { type: "edit"; certificate: Certificate } };

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

export default function CertificateTable({ initialData }: { initialData: Certificate[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initialData;
    return initialData.filter((cert) =>
      [cert.name, cert.issuer, cert.credentialId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [initialData, query]);

  const openCreate = useCallback(() => setDialog({ open: true, mode: { type: "create" } }), []);
  const openEdit = useCallback(
    (certificate: Certificate) => setDialog({ open: true, mode: { type: "edit", certificate } }),
    []
  );
  const closeDialog = useCallback(() => setDialog({ open: false }), []);
  const onSuccess = useCallback(() => router.refresh(), [router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus sertifikat "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    const res = await deleteCertificateAction(id);
    setDeletingId(null);

    if (res.success) {
      toast.success(`Sertifikat "${name}" berhasil dihapus.`);
      router.refresh();
    } else {
      toast.error("error" in res ? res.error : "Gagal menghapus sertifikat.");
    }
  };

  return (
    <>
      {dialog.open && (
        <CertificateDialog
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
              placeholder="Cari sertifikat, issuer, ID…"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {filteredData.length} / {initialData.length} sertifikat
            </span>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Sertifikat
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="w-16">Preview</TableHead>
                <TableHead>Nama &amp; Penerbit</TableHead>
                <TableHead>Masa Berlaku</TableHead>
                <TableHead>Credential ID</TableHead>
                <TableHead className="w-24 text-center">Publik</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                    {query
                      ? `Tidak ada hasil untuk "${query}".`
                      : 'Belum ada sertifikat. Klik "Tambah Sertifikat" untuk mulai.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cert, i) => (
                  <TableRow key={cert.id}>
                    <TableCell className="text-gray-400">{i + 1}</TableCell>

                    {/* Image Preview */}
                    <TableCell>
                      {cert.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="h-10 w-14 rounded border border-gray-100 object-cover dark:border-gray-800"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    {/* Name & Issuer */}
                    <TableCell>
                      <p className="line-clamp-1 font-semibold text-gray-900 dark:text-white">
                        {cert.name}
                      </p>
                      <p className="line-clamp-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {cert.issuer}
                      </p>
                    </TableCell>

                    {/* Validity Period */}
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span>{formatDate(cert.issueDate)}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        {cert.expiryDate ? (
                          <span>{formatDate(cert.expiryDate)}</span>
                        ) : (
                          <span className="font-medium text-green-600 dark:text-green-400">Selamanya</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Credential ID */}
                    <TableCell>
                      {cert.credentialId ? (
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {cert.credentialId}
                          </code>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 transition hover:text-blue-500"
                              title="Lihat Kredensial Asli"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* isPublic */}
                    <TableCell className="text-center">
                      {cert.isPublic ? (
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
                        <Button variant="ghost" size="icon" onClick={() => openEdit(cert)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cert.id, cert.name)}
                          disabled={deletingId === cert.id}
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
