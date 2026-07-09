export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          Portfolio CMS
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
