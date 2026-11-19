import WhyUs from "@/components/site/pages/why-us";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("why-us"); }
export default WhyUs;
