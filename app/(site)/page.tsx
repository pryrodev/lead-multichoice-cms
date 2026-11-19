import type { Metadata } from "next";
import Home from "@/components/site/pages/index";
import { getPublishedHomePage, getPublishedPartners } from "@/lib/cms/server";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata(): Promise<Metadata> { return getPublicPageMetadata("home"); }

export default async function Homepage() {
  const [content, partnerContent] = await Promise.all([getPublishedHomePage(), getPublishedPartners()]);
  return <Home initialContent={content} partners={partnerContent.partners} />;
}
