import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticlePage from "@/components/site/pages/blog-article";
import { insights } from "@/content/insights";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.en.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = insights.en.find((item) => item.slug === slug);
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
  if (!insights.en.some((article) => article.slug === slug)) notFound();
  return <BlogArticlePage slug={slug} />;
}
