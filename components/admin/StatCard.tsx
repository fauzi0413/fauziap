import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
            {value}
          </p>
        </div>
        <div className="rounded-md bg-gray-950 p-3 text-white dark:bg-white dark:text-gray-950">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}
