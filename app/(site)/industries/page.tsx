import Industries from "@/components/site/pages/industries";
import { getPublishedIndustries } from "@/lib/cms/server";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("industries"); }
export default async function IndustriesPage() {
  const content = await getPublishedIndustries();
  return <Industries content={content} />;
}
