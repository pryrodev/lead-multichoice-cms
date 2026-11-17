import { PageShell } from "@/components/layout/page";
import { BlogEditor } from "@/components/cms/blog-editor";

export default function BlogContentPage() {
  return <PageShell title="Blog" subtitle="Create, edit, and publish articles on the public website."><BlogEditor /></PageShell>;
}
