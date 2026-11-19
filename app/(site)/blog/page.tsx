import BlogPage from "@/components/site/pages/blog";
import { getPublishedBlog } from "@/lib/cms/server";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("blog"); }

export default async function Page() {
  const content = await getPublishedBlog();
  return <BlogPage articles={content.articles} />;
}
