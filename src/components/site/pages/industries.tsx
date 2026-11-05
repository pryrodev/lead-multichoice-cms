"use client";

const heroImage = "/site/truck.jpg";
import { industries } from "@/content/services";
import { CallToActionSection, CheckList, PageHero } from "@/components/site/ui";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";



export default function Industries() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.industries")}
        title={tc("Sector knowledge. Coordinated execution.")}
        intro={tc("We coordinate, source and represent — across five sectors.")}
        image={heroImage}
        visualKey="industries.hero"
        alt="Cargo truck on the road for regional trade"
      >
        <ul className="mt-10 flex flex-wrap gap-2">
          {industries.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className="inline-block rounded-sm border border-border bg-background px-3 py-1.5 text-[13.5px] text-charcoal hover:border-corporate hover:text-corporate"
              >
                {tc(i.title)}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>
      <div className="divide-y divide-border">
        {industries.map((ind, i) => {
          const content = (
            <>
              <img
                src={ind.image}
                alt={ind.alt}
                width={1280}
                height={960}
                loading="lazy"
                className="aspect-[16/11] w-full rounded object-cover"
              />
              <div>
                <span className="font-display text-[13px] font-bold tabular-nums text-brass">
                  0{i + 1}
                </span>
                <h2 className="mt-3 text-[28px] md:text-[36px]">{tc(ind.title)}</h2>
                <p className="mt-4 text-charcoal">{tc(ind.text)}</p>
                <h3 className="eyebrow mb-4 mt-8 text-steel">{t("industries.howSupport")}</h3>
                <CheckList items={ind.points.map(tc)} />
              </div>
            </>
          );
          const panel = (
            <div className="container-site grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
              {content}
            </div>
          );

          if (i % 2 === 1) {
            const visualKey = ind.id === "energy" ? "industries.energy" as const : "industries.logistics" as const;
            const image = ind.id === "energy" ? "/site/warehouse.jpg" : "/site/truck.jpg";
            return (
              <PhotoScrollSection
                key={ind.id}
                id={ind.id}
                image={image}
                visualKey={visualKey}
                overlayClassName="bg-brand-white/88"
                className="py-12 md:py-16"
              >
                {panel}
              </PhotoScrollSection>
            );
          }

          return (
            <section key={ind.id} id={ind.id} className="scroll-mt-24 py-12 md:py-16">
              <div className="container-site grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
                {content}
              </div>
            </section>
          );
        })}
      </div>
      <CallToActionSection photoBackground="/site/warehouse.jpg" visualKey="industries.cta" />
    </>
  );
}
