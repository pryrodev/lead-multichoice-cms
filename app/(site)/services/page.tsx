import Services from "@/components/site/pages/services";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("services"); }
export default Services;
