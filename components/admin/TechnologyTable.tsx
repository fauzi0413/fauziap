"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteTechnologyAction } from "@/actions/technology";
import { TechnologyPayload } from "@/services/technology";
import { toast } from "sonner";
import { Trash, Edit } from "lucide-react";
import type { Technology } from "@prisma/client";

export default function TechnologyTable({ initialData }: { initialData: Technology[] }) {
  // In a real robust app, use optimisitc UI or useTransition here.
  
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
    <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Icon/Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((tech, i) => (
              <TableRow key={tech.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{tech.icon ? tech.icon : "-"}</TableCell>
                <TableCell className="font-medium">{tech.name}</TableCell>
                <TableCell>{tech.slug}</TableCell>
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
  );
}
