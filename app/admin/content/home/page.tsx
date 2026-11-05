import { HomepageEditor } from "@/components/cms/homepage-editor";
import { PageShell } from "@/components/layout/page";

export default function HomepageCmsPage() {
  return <PageShell title="Website content" subtitle="Edit homepage copy, translations, and hero media"><HomepageEditor /></PageShell>;
}
