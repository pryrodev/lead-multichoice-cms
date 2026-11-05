"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { insights, insightUi } from "@/content/insights";
import { PageHero } from "@/components/site/ui";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";
import { useI18n } from "@/i18n/I18nProvider";

export default function BlogArticlePage({ slug }: { slug: string }) {
  const { language } = useI18n();
  const article = insights[language].find((item) => item.slug === slug);
  const copy = insightUi[language];
  const visualKey = slug === "market-context"
    ? "blog.marketContext"
    : slug === "supplier-readiness"
      ? "blog.supplierReadiness"
      : "blog.deliveryCoordination";
  const visuals = useSiteVisuals();

  if (!article) {
    return (
      <section className="container-site py-20 text-center">
        <h1 className="text-3xl">{copy.eyebrow}</h1>
        <p className="mt-3 text-muted-foreground">{copy.all}</p>
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> {copy.all}
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        intro={article.summary}
        image={article.image}
        visualKey={visualKey}
        alt={article.imageAlt}
      />
      <article className="container-site max-w-4xl py-12 md:py-16">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> {copy.all}
        </Link>
        <p className="text-[17px] leading-8 text-charcoal md:text-lg">{article.body}</p>
      </article>
    </>
  );
}
