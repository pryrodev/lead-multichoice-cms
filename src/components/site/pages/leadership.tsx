"use client";

const heroImage = "/site/meeting.jpg";
import { PageHero } from "@/components/site/ui";
import { LeadershipProfile } from "@/components/site/sections";
import { useI18n } from "@/i18n/I18nProvider";



export default function Leadership() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.leadership")}
        title={tc("Experience that connects business, trade and digital transformation.")}
        image={heroImage}
        visualKey="leadership.hero"
        alt="Business leaders in a meeting"
      />
      <section className="container-site py-12 md:py-16">
        <LeadershipProfile full />
      </section>
    </>
  );
}
