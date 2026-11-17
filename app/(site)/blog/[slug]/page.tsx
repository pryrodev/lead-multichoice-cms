import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticlePage from "@/components/site/pages/blog-article";
import { getPublishedBlog } from "@/lib/cms/server";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getPublishedBlog();
  return content.articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = await getPublishedBlog();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { articles } = await getPublishedBlog();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <BlogArticlePage slug={slug} article={article} />;
}
