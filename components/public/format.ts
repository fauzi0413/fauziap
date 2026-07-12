export function formatPeriod(startDate: Date, endDate?: Date | null, isCurrent?: boolean) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  });

  const periodStr = `${formatter.format(startDate)} - ${isCurrent ? "Sekarang" : endDate ? formatter.format(endDate) : "Selesai"}`;

  const end = isCurrent || !endDate ? new Date() : new Date(endDate);
  let months = (end.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += end.getMonth();
  months = Math.max(0, months + 1);
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  const durationParts = [];
  if (years > 0) durationParts.push(`${years} tahun`);
  if (remainingMonths > 0 || (years === 0 && remainingMonths === 0)) durationParts.push(`${remainingMonths} bulan`);
  
  return `${periodStr} · ${durationParts.join(" ")}`;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / 220), 1);
}
