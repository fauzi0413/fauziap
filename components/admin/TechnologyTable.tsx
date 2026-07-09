"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteTechnologyAction } from "@/actions/technology";
import { toast } from "sonner";
import { Download, Edit, Search, Trash } from "lucide-react";
import type { Technology } from "@prisma/client";

export default function TechnologyTable({ initialData }: { initialData: Technology[] }) {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return initialData;

    return initialData.filter((tech) =>
      [tech.name, tech.slug, tech.icon].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [initialData, query]);
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technology?")) return;
    
    const res = await deleteTechnologyAction(id);
    if (res.success) {
      toast.success("Technology deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete technology");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <label className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm text-gray-500 dark:border-gray-800">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search technology..."
            className="w-full bg-transparent outline-none"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            {filteredData.length} / {initialData.length} items
          </span>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Icon/Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  No technology found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((tech, i) => (
                <TableRow key={tech.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{tech.icon ? tech.icon : "-"}</TableCell>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>{tech.slug}</TableCell>
                  <TableCell>{tech.updatedAt.toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(tech.id)} className="text-red-500 hover:text-red-600">
                        <Trash className="h-4 w-4" />
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
  );
}
