import type { Metadata } from "next";
import BlogPage from "@/components/site/pages/blog";
import { getPublishedBlog } from "@/lib/cms/server";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical articles on trade facilitation, sourcing, supplier readiness and supply coordination in Rwanda.",
};

export default async function Page() {
  const content = await getPublishedBlog();
  return <BlogPage articles={content.articles} />;
}
