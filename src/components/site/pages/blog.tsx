"use client";

import { PageHero } from "@/components/site/ui";
import { InsightsGrid } from "@/components/site/InsightsGrid";
import { useI18n } from "@/i18n/I18nProvider";
import { insightUi } from "@/content/insights";

export default function BlogPage() {
  const { language } = useI18n();
  const copy = insightUi[language];
  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={<span className="block text-[clamp(1.25rem,3.2vw,2.5rem)] leading-tight md:whitespace-nowrap">{copy.title}</span>}
        headingClassName="max-w-none"
        titleClassName="max-w-none"
        intro={copy.intro}
        introClassName="max-w-3xl"
        image="/site/meeting.jpg"
        visualKey="blog.hero"
        alt="Colleagues discussing business and sourcing information"
      />
      <InsightsGrid />
    </>
  );
}
