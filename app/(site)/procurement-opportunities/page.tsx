import type { Metadata } from "next";
import Procurement from "@/components/site/pages/procurement-opportunities";
import { getPublishedProcurementResources } from "@/lib/cms/server";

export const metadata: Metadata = { 
  title: "Strategic Sourcing & Procurement Opportunities | Lead Multi-Choice", 
  description: "Strategic sourcing principles, 7-step procurement lifecycle, supplier market access considerations, and official Rwanda procurement resources including UMUCYO and Rwanda Medical Supply tenders." 
};
export default async function ProcurementPage() {
  const { resources } = await getPublishedProcurementResources();
  return <Procurement resources={resources} />;
}
