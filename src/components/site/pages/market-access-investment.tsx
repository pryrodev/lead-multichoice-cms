"use client";

import { Globe2, Handshake, Search, Truck, Users, ClipboardCheck } from "lucide-react";
import { ButtonLink, PageHero, SectionHeading } from "@/components/site/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { marketAccessContent } from "@/content/market-access-investment";

const supportIcons = [Search, Users, Handshake, Truck, ClipboardCheck];

export default function MarketAccessInvestment() {
  const { language, tc } = useI18n();
  const copy = marketAccessContent[language] ?? marketAccessContent.en;

  return (
    <>
      <PageHero
        eyebrow={tc(copy.eyebrow)}
        title={tc(copy.heroTitle)}
        intro={tc(copy.heroIntro)}
        image="/site/hero-port.jpg"
        visualKey="marketAccess.hero"
        alt="Containers at an international freight terminal"
      />

      <section className="container-site py-12 md:py-16">
        <SectionHeading title={tc(copy.marketsTitle)} intro={tc(copy.marketsIntro)} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.markets.map((market) => (
            <article
              key={market.name}
              className="rounded border border-border bg-background p-6 md:p-7 shadow-xs hover:border-brand-primary/40 transition-colors"
            >
              <Globe2 className="text-brand-primary" size={23} aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{tc(market.name)}</h3>
              <p className="mt-5 font-display text-3xl font-bold text-brand-primary">
                {tc(market.population)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tc(market.text)}</p>
            </article>
          ))}
        </div>
        <aside className="mt-6 rounded border-l-4 border-brass bg-warm p-5 md:p-6 shadow-xs">
          <h3 className="font-semibold text-foreground">{tc(copy.neighborTitle)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tc(copy.neighborText)}</p>
        </aside>
      </section>

      <PhotoScrollSection
        image="/site/meeting.jpg"
        visualKey="marketAccess.support"
        overlayClassName="bg-brand-white/88"
        className="bg-warm py-12 md:py-16"
      >
        <div className="container-site">
          <SectionHeading title={tc(copy.supportTitle)} intro={tc(copy.supportIntro)} />
          {copy.supportSubintro && (
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brass">
              {tc(copy.supportSubintro)}
            </p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.support.map((item, index) => {
              const Icon = supportIcons[index] ?? Search;
              return (
                <article
                  key={item.title}
                  className="rounded border border-border bg-background p-6 shadow-xs hover:border-brand-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="text-brand-primary" size={23} aria-hidden="true" />
                    <span className="font-display text-sm font-bold tabular-nums text-brass">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{tc(item.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tc(item.text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </PhotoScrollSection>

      <section className="container-site grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div>
          <p className="eyebrow mb-3 text-brass font-semibold">{tc(copy.tagline)}</p>
          <h2 className="text-[28px] md:text-[38px] font-bold text-foreground">{tc(copy.deliveryTitle)}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {tc(copy.deliveryText)}
          </p>
        </div>
        <ButtonLink href="/contact#business-enquiry" variant="primary" arrow className="shrink-0">
          {tc(copy.contact)}
        </ButtonLink>
      </section>
    </>
  );
}
