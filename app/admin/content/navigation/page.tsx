import { PageShell } from "@/components/layout/page";
import { SiteNavigationEditor } from "@/components/cms/site-navigation-editor";

export default function SiteNavigationPage() {
  return <PageShell title="Navigation" subtitle="Manage header menu groups, links, labels, and order."><SiteNavigationEditor /></PageShell>;
}
