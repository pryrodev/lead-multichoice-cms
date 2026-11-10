import { PageShell } from "@/components/layout/page";
import { ProcurementResourcesEditor } from "@/components/cms/procurement-resources-editor";

export default function ProcurementResourcesPage() {
  return <PageShell title="Procurement resources" subtitle="Manage official external links displayed on the public website."><ProcurementResourcesEditor /></PageShell>;
}
