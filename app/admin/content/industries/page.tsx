import { PageShell } from "@/components/layout/page";
import { IndustriesEditor } from "@/components/cms/industries-editor";

export default function IndustriesContentPage() {
  return <PageShell title="Industries" subtitle="Edit the public Industries page and its sector sections."><IndustriesEditor /></PageShell>;
}
