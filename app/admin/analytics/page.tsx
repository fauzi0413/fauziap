import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminAnalyticsPage() {
  return (
    <ModulePlaceholder
      title="Visitor Analytics"
      description="Lihat kunjungan website, halaman yang dibuka, perangkat, lokasi, browser, dan referer."
      fields={["Visitors", "Page Path", "Browser", "OS", "Device", "Country", "City", "Referer", "Daily Chart"]}
    />
  );
}
