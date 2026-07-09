import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminBlogPage() {
  return (
    <ModulePlaceholder
      title="Blog"
      description="Kelola artikel dengan draft/publish, cover image, kategori, tag, preview, dan SEO metadata."
      fields={["Title", "Slug", "Rich Content", "Excerpt", "Cover Image", "Category", "Tags", "Draft", "Published", "SEO Title", "SEO Description", "Reading Time"]}
    />
  );
}
