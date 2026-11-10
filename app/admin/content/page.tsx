import type { Metadata } from "next";
import { CmsDashboard } from "@/components/cms/cms-dashboard";
import { PageShell } from "@/components/layout/page";
import { getCmsDashboardItems } from "@/lib/cms/dashboard";

export const metadata: Metadata = {
  title: "Website CMS",
  description: "Manage website content, publishing status, and media assets.",
};

export default async function WebsiteCmsPage() {
  const items = await getCmsDashboardItems();

  return (
    <PageShell
      title="Website CMS"
      subtitle="Manage and publish the content on your public website."
    >
      <CmsDashboard items={items} />
    </PageShell>
  );
}
