import Procurement from "@/components/site/pages/procurement-opportunities";
import { getPublishedProcurementResources } from "@/lib/cms/server";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("procurement-opportunities"); }
export default async function ProcurementPage() {
  const { resources } = await getPublishedProcurementResources();
  return <Procurement resources={resources} />;
}
