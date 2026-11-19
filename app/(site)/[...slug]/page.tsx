import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import About from "@/components/site/pages/about";
import Contact from "@/components/site/pages/contact";
import Industries from "@/components/site/pages/industries";
import Leadership from "@/components/site/pages/leadership";
import MarketAccessInvestment from "@/components/site/pages/market-access-investment";
import MediaPage from "@/components/site/pages/media";
import BlogPage from "@/components/site/pages/blog";
import Procurement from "@/components/site/pages/procurement-opportunities";
import Services from "@/components/site/pages/services";
import WhyUs from "@/components/site/pages/why-us";
import { QueryProvider } from "@/components/providers/query-provider";
import { RequestTracker } from "@/components/client-portal/request-tracker";
import { PortalUnavailable } from "@/components/client-portal/portal-unavailable";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";
import { getPublicPageMetadata } from "@/lib/cms/metadata";
import type { SeoPageId } from "@/lib/cms/site-seo";
import { getPublishedBlog, getPublishedIndustries, getPublishedMediaGallery, getPublishedProcurementResources, getPublishedSiteSeo } from "@/lib/cms/server";

type CatchAllProps = { params: Promise<{ slug: string[] }> };

async function findSeoPage(slugParts: string[]) {
  const seo = await getPublishedSiteSeo();
  const requestedPath = slugParts.join("/");
  return seo.pages.find((entry) => entry.pageId !== "home" && entry.slug === requestedPath);
}

export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await findSeoPage(slug);
  return page ? getPublicPageMetadata(page.pageId) : { title: "Page not found" };
}

export default async function SeoPageAlias({ params }: CatchAllProps) {
  const { slug } = await params;
  const page = await findSeoPage(slug);
  if (!page) notFound();

  let content: ReactNode;
  switch (page.pageId as Exclude<SeoPageId, "home">) {
    case "about": content = <About />; break;
    case "market-access-investment": content = <MarketAccessInvestment />; break;
    case "services": content = <Services />; break;
    case "industries": content = <Industries content={await getPublishedIndustries()} />; break;
    case "why-us": content = <WhyUs />; break;
    case "leadership": content = <Leadership />; break;
    case "procurement-opportunities": content = <Procurement resources={(await getPublishedProcurementResources()).resources} />; break;
    case "blog": content = <BlogPage articles={(await getPublishedBlog()).articles} />; break;
    case "media": content = <MediaPage stories={(await getPublishedMediaGallery()).stories} />; break;
    case "contact": content = <Contact />; break;
    case "track": content = isClientPortalEnabled() ? <QueryProvider><RequestTracker /></QueryProvider> : <PortalUnavailable />; break;
    default: notFound();
  }
  return content;
}
