import { PageShell } from "@/components/layout/page";
import { SiteCopyEditor } from "@/components/cms/site-copy-editor";

export default function SiteCopyPage() {
  return (
    <PageShell title="Website copy" subtitle="Edit text and translations across public pages">
      <SiteCopyEditor />
    </PageShell>
  );
}
