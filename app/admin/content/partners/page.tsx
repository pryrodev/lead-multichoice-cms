import { PageShell } from "@/components/layout/page";
import { PartnersEditor } from "@/components/cms/partners-editor";

export default function PartnersPage() {
  return (
    <PageShell
      title="Partners"
      subtitle="Manage the organizations displayed in the homepage partner ticker."
    >
      <PartnersEditor />
    </PageShell>
  );
}
