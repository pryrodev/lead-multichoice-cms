import About from "@/components/site/pages/about";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("about"); }
export default About;
