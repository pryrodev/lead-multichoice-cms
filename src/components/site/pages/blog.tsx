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
        title={copy.title}
        intro={copy.intro}
        image="/site/meeting.jpg"
        visualKey="blog.hero"
        alt="Colleagues discussing business and sourcing information"
      />
      <InsightsGrid />
    </>
  );
}
