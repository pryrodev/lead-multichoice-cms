import { PageShell } from "@/components/layout/page";
import { SiteVisualsEditor } from "@/components/cms/site-visuals-editor";

export default function SiteVisualsPage() {
  return (
    <PageShell title="Website images" subtitle="Manage public page hero and parallax backgrounds">
      <SiteVisualsEditor />
    </PageShell>
  );
}
