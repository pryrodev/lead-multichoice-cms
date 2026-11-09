"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { insights, insightUi } from "@/content/insights";
import { useI18n } from "@/i18n/I18nProvider";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";

export function InsightsGrid({ singleLineTitle = false }: { singleLineTitle?: boolean }) {
  const { language } = useI18n();
  const visuals = useSiteVisuals();
  const copy = insightUi[language];
  const articles = insights[language];

  return (
    <section className="container-site py-12 md:py-16" aria-label={copy.eyebrow}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3 text-brass">{copy.eyebrow}</p>
          <h2
            className={cn(
              singleLineTitle
                ? "max-w-none whitespace-nowrap"
                : "max-w-2xl text-balance text-[30px] md:text-[40px]",
            )}
            style={singleLineTitle ? { whiteSpace: "nowrap", fontSize: "clamp(0.875rem, 3.2vw, 2.5rem)" } : undefined}
          >
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{copy.intro}</p>
        </div>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline">{copy.all}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <article key={article.slug} className="group overflow-hidden rounded-lg border border-border bg-background">
            {(() => {
              const visualKey = article.slug === "market-context"
                ? "blog.marketContext"
                : article.slug === "supplier-readiness"
                  ? "blog.supplierReadiness"
                  : "blog.deliveryCoordination";
              const image = visuals[visualKey] || article.image;
              return (
            <Link href={`/blog/${article.slug}`} aria-label={`${copy.read}: ${article.title}`} className="relative block aspect-[16/9] overflow-hidden bg-brand-primary/10">
              <Image src={image} alt={article.imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </Link>
              );
            })()}
            <div className="p-5 md:p-6">
              <p className="eyebrow text-brass">{article.category}</p>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                <Link href={`/blog/${article.slug}`} className="transition-colors group-hover:text-brand-primary">{article.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
              <Link href={`/blog/${article.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline">{copy.read}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
