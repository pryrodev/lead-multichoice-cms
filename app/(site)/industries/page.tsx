import type { Metadata } from "next";
import Industries from "@/components/site/pages/industries";
import { getPublishedIndustries } from "@/lib/cms/server";

export const metadata: Metadata = { title: "Industries", description: "Coordination support for healthcare, energy, general supplies, IT equipment, logistics and projects in Rwanda." };
export default async function IndustriesPage() {
  const content = await getPublishedIndustries();
  return <Industries content={content} />;
}
