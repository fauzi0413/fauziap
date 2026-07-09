export function formatPeriod(startDate: Date, endDate?: Date | null, isCurrent?: boolean) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(startDate)} - ${isCurrent ? "Sekarang" : endDate ? formatter.format(endDate) : "Selesai"}`;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / 220), 1);
}
