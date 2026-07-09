import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminResearchPage() {
  return (
    <ModulePlaceholder
      title="Research"
      description="Kelola penelitian, dataset, metode, metrik evaluasi, repository, publikasi, dan paper."
      fields={["Title", "Abstract", "Dataset", "Method", "Model", "Result", "Evaluation Metric", "Publication", "Repository URL", "Paper File"]}
    />
  );
}
