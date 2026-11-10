import type { Metadata } from "next";
import Procurement from "@/components/site/pages/procurement-opportunities";
import { getPublishedProcurementResources } from "@/lib/cms/server";

export const metadata: Metadata = { title: "Procurement Opportunities", description: "Official procurement resources in Rwanda, including Rwanda Medical Supply tenders and the UMUCYO government e-procurement portal." };
export default async function ProcurementPage() {
  const { resources } = await getPublishedProcurementResources();
  return <Procurement resources={resources} />;
}
