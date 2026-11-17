import { PageShell } from "@/components/layout/page";
import { SiteVisualsEditor } from "@/components/cms/site-visuals-editor";

export default function SiteVisualsPage() {
  return (
    <PageShell title="Website media" subtitle="Manage hero videos and public page background images">
      <SiteVisualsEditor />
    </PageShell>
  );
}
