import { PageShell } from "@/components/layout/page";
import { SiteSeoEditor } from "@/components/cms/site-seo-editor";

export default function SiteSeoPage() {
  return <PageShell title="Page SEO & URLs" subtitle="Edit search titles, descriptions, and public page paths."><SiteSeoEditor /></PageShell>;
}
