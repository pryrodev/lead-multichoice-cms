import Contact from "@/components/site/pages/contact";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("contact"); }
export default Contact;
