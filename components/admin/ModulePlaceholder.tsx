import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export function ModulePlaceholder({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: string[];
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader title={title} description={description} />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
          Struktur modul siap dikembangkan
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Halaman ini menjadi entry point CMS. Data table, form dialog, server
          action, dan validasi Zod dapat mengikuti pola Technology yang sudah
          ada.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div
              key={field}
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              {field}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
