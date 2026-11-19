import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BackToTopButton } from "@/components/site/BackToTopButton";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteVisualsProvider } from "@/components/site/SiteVisualsProvider";
import About from "@/components/site/pages/about";
import BlogPage from "@/components/site/pages/blog";
import BlogArticlePage from "@/components/site/pages/blog-article";
import Contact from "@/components/site/pages/contact";
import Home from "@/components/site/pages";
import Industries from "@/components/site/pages/industries";
import Leadership from "@/components/site/pages/leadership";
import MarketAccessInvestment from "@/components/site/pages/market-access-investment";
import MediaPage from "@/components/site/pages/media";
import Procurement from "@/components/site/pages/procurement-opportunities";
import Services from "@/components/site/pages/services";
import WhyUs from "@/components/site/pages/why-us";
import { RequestTracker } from "@/components/client-portal/request-tracker";
import { PortalUnavailable } from "@/components/client-portal/portal-unavailable";
import { QueryProvider } from "@/components/providers/query-provider";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getSessionUser } from "@/lib/auth/session";
import { defaultHomePageContent, mergeHomePageContent, type HomePageContent } from "@/lib/cms/homepage";
import { defaultBlogContent, mergeBlogContent } from "@/lib/cms/blog";
import { defaultIndustriesContent, mergeIndustriesContent } from "@/lib/cms/industries";
import { defaultMediaGallery, mergeMediaGallery } from "@/lib/cms/media-gallery";
import { defaultPartners, mergePartners } from "@/lib/cms/partners";
import { defaultProcurementResources, mergeProcurementResources } from "@/lib/cms/procurement-resources";
import { mergeSiteCopy, type SiteCopyContent } from "@/lib/cms/site-copy";
import { defaultSiteNavigation, mergeSiteNavigation } from "@/lib/cms/site-navigation";
import { defaultSiteSeoContent, mergeSiteSeo } from "@/lib/cms/site-seo";
import { defaultSiteVisuals, mergeSiteVisuals } from "@/lib/cms/site-visuals";
import {
  getPublishedBlog,
  getPublishedHomePage,
  getPublishedIndustries,
  getPublishedMediaGallery,
  getPublishedPartners,
  getPublishedProcurementResources,
  getPublishedSiteCopy,
  getPublishedSiteNavigation,
  getPublishedSiteSeo,
  getPublishedSiteVisuals,
} from "@/lib/cms/server";
import { getDb } from "@/lib/db";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";
import { DraftPreviewToolbar, draftPreviewViews } from "@/components/cms/draft-preview-toolbar";

export const metadata: Metadata = {
  title: "CMS draft preview",
  robots: { index: false, follow: false },
};

type PreviewSection = "home" | "site-copy" | "site-visuals" | "procurement-resources" | "partners" | "blog" | "industries" | "media-gallery" | "site-seo" | "site-navigation";
type PageProps = { params: Promise<{ section: string }>; searchParams: Promise<{ view?: string; article?: string }> };

const editorPaths: Record<PreviewSection, string> = {
  home: "/admin/content/home",
  "site-copy": "/admin/content/copy",
  "site-visuals": "/admin/content/visuals",
  "procurement-resources": "/admin/content/resources",
  partners: "/admin/content/partners",
  blog: "/admin/content/blog",
  industries: "/admin/content/industries",
  "media-gallery": "/admin/content/gallery",
  "site-seo": "/admin/content/seo",
  "site-navigation": "/admin/content/navigation",
};

const previewSlugs = ["home", "site-copy", "site-visuals", "procurement-resources", "partners", "blog", "industries", "media-gallery", "site-seo", "site-navigation"] as const;

function parseContent<T>(value: unknown, fallback: T, merge: (value: unknown) => T): T {
  if (value == null) return fallback;
  try {
    return merge(typeof value === "string" ? JSON.parse(value) as unknown : value);
  } catch {
    return fallback;
  }
}

export default async function CmsDraftPreview({ params, searchParams }: PageProps) {
  const [{ section }, { view: requestedView, article: articleSlug }, user] = await Promise.all([params, searchParams, getSessionUser()]);
  if (!user || user.role !== "admin") redirect(`/portal/login?next=${encodeURIComponent(`/cms-preview/${section}`)}`);
  if (!previewSlugs.includes(section as PreviewSection)) notFound();
  const previewSection = section as PreviewSection;
  const view = draftPreviewViews.some((item) => item.id === requestedView) ? requestedView! : previewSection === "procurement-resources" ? "procurement-opportunities" : previewSection === "industries" ? "industries" : previewSection === "blog" ? "blog" : previewSection === "media-gallery" ? "media" : "home";

  const [pages, published] = await Promise.all([
    getDb().sitePage.findMany({
      where: { slug: { in: [...previewSlugs] } },
      select: { slug: true, draftContent: true, publishedContent: true },
    }),
    Promise.all([
      getPublishedHomePage(), getPublishedSiteCopy(), getPublishedSiteVisuals(),
      getPublishedProcurementResources(), getPublishedPartners(), getPublishedBlog(),
      getPublishedIndustries(), getPublishedMediaGallery(), getPublishedSiteSeo(), getPublishedSiteNavigation(),
    ]),
  ]);
  const pageMap = new Map(pages.map((page) => [page.slug, page]));
  const read = <T,>(slug: PreviewSection, fallback: T, merge: (value: unknown) => T): T => {
    const page = pageMap.get(slug);
    return parseContent(page?.draftContent ?? page?.publishedContent, fallback, merge);
  };
  const [publishedHome, publishedCopy, publishedVisuals, publishedResources, publishedPartners, publishedBlog, publishedIndustries, publishedGallery, publishedSeo, publishedNavigation] = published;

  const home = read("home", publishedHome ?? defaultHomePageContent, mergeHomePageContent);
  const siteCopy: SiteCopyContent | null = pageMap.has("site-copy")
    ? read("site-copy", publishedCopy ?? mergeSiteCopy(null), mergeSiteCopy)
    : publishedCopy;
  const visuals = read("site-visuals", publishedVisuals ?? defaultSiteVisuals, mergeSiteVisuals);
  const resources = read("procurement-resources", publishedResources ?? defaultProcurementResources, mergeProcurementResources);
  const partners = read("partners", publishedPartners ?? defaultPartners, mergePartners);
  const blog = read("blog", publishedBlog ?? defaultBlogContent, mergeBlogContent);
  const industries = read("industries", publishedIndustries ?? defaultIndustriesContent, mergeIndustriesContent);
  const gallery = read("media-gallery", publishedGallery ?? defaultMediaGallery, mergeMediaGallery);
  const seo = read("site-seo", publishedSeo ?? defaultSiteSeoContent, mergeSiteSeo);
  const navigation = read("site-navigation", publishedNavigation ?? defaultSiteNavigation, mergeSiteNavigation);

  let content: ReactNode;
  switch (view) {
    case "about": content = <About />; break;
    case "market-access-investment": content = <MarketAccessInvestment />; break;
    case "services": content = <Services />; break;
    case "industries": content = <Industries content={industries} />; break;
    case "why-us": content = <WhyUs />; break;
    case "leadership": content = <Leadership />; break;
    case "procurement-opportunities": content = <Procurement resources={resources.resources} />; break;
    case "blog": {
      const draftArticle = articleSlug ? blog.articles.find((article) => article.slug === articleSlug) : undefined;
      content = draftArticle
        ? <BlogArticlePage slug={draftArticle.slug} article={draftArticle} listHref={`/cms-preview/${previewSection}?view=blog`} />
        : <BlogPage articles={blog.articles} articleHrefBase={`/cms-preview/${previewSection}?view=blog&article=`} listHref={`/cms-preview/${previewSection}?view=blog`} />;
      break;
    }
    case "media": content = <MediaPage stories={gallery.stories} />; break;
    case "contact": content = <Contact />; break;
    case "track": content = <QueryProvider>{isClientPortalEnabled() ? <RequestTracker /> : <PortalUnavailable />}</QueryProvider>; break;
    default: content = <Home initialContent={home} partners={partners.partners} />;
  }

  return (
    <I18nProvider siteCopyOverrides={siteCopy}>
      <SiteVisualsProvider value={visuals}>
        <DraftPreviewToolbar section={previewSection} view={view} editorHref={editorPaths[previewSection]} />
        <SiteHeader homePageContent={home} navigation={navigation} siteSeo={seo} previewSection={previewSection} />
        <main id="main">{content}</main>
        <SiteFooter />
        <ScrollReveal />
        <BackToTopButton />
      </SiteVisualsProvider>
    </I18nProvider>
  );
}
