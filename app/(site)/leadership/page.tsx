import Leadership from "@/components/site/pages/leadership";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("leadership"); }
export default Leadership;
