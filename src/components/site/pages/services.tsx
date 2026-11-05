"use client";

const port = "/site/hero-port.jpg";
import { services } from "@/content/services";
import { ButtonLink, CallToActionSection, CheckList, PageHero } from "@/components/site/ui";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";



const serviceNavKeys = {
  "market-access": "service.marketAccess",
  procurement: "service.procurement",
  logistics: "service.logistics",
  projects: "service.projects",
  "after-sales": "service.afterSales",
} as const;
type ServiceNavKey = (typeof serviceNavKeys)[keyof typeof serviceNavKeys];
const serviceNavLabel = (
  id: string,
  title: string,
  t: (key: ServiceNavKey) => string,
  tc: (text: string) => string,
) => {
  const key = serviceNavKeys[id as keyof typeof serviceNavKeys];
  return key ? t(key) : tc(title);
};

export default function Services() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.services")}
        title={tc("Five services. One local point of coordination.")}
        intro={tc("From first opportunity to after-sales — one partner.")}
        image={port}
        visualKey="services.hero"
        alt="Containers and cranes at a freight terminal"
      />
      <nav
        aria-label="Services on this page"
        className="sticky top-[84px] z-30 border-b border-border bg-background/95 backdrop-blur"
      >
        <ul className="container-site grid grid-cols-2 gap-1.5 py-2 sm:grid-cols-3 xl:grid-cols-5">
          {services.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={`${t("services.jumpTo")} ${tc(s.title)}`}
                className="flex min-h-10 min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-[12px] font-medium leading-tight text-muted-foreground transition-colors hover:bg-surface hover:text-brand-primary focus-visible:bg-surface focus-visible:text-brand-primary sm:text-[13px]"
              >
                <span className="shrink-0 tabular-nums text-brass">0{i + 1}</span>
                <span className="min-w-0">{serviceNavLabel(s.id, s.title, t, tc)}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {services.map((s, i) => {
        const content = (
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <img
              src={s.image}
              alt={s.alt}
              width={1280}
              height={960}
              loading="lazy"
              className={`aspect-[4/3] w-full rounded object-cover ${i % 2 ? "lg:order-2" : ""}`}
            />
            <div>
              <p className="eyebrow">
                {t("services.service")} 0{i + 1}
              </p>
              <h2 className="mt-4 text-[28px] md:text-[38px]">{tc(s.title)}</h2>
              <p className="mt-4 text-muted-foreground">{tc(s.summary)}</p>
              <div className="mt-8">
                <CheckList items={s.items.map(tc)} />
              </div>
              {s.note && (
                <p className="mt-6 rounded bg-surface p-4 text-[14.5px] text-charcoal">
                  {tc(s.note)}
                </p>
              )}
              <ButtonLink href="/contact" variant="outline" className="mt-8" arrow>
                {t("services.discuss")}
              </ButtonLink>
            </div>
          </div>
        );
        const className = `scroll-mt-36 py-12 md:py-16 ${i % 2 ? "bg-warm" : ""}`;

        if (i % 2 === 1) {
          const visualKey = s.id === "procurement" ? "services.procurement" as const : "services.projects" as const;
          const image = s.id === "procurement" ? "/site/meeting.jpg" : "/site/warehouse.jpg";
          return (
            <PhotoScrollSection
              key={s.id}
              id={s.id}
              image={image}
              visualKey={visualKey}
              overlayClassName="bg-brand-white/88"
              className={className}
            >
              {content}
            </PhotoScrollSection>
          );
        }

        return (
          <section key={s.id} id={s.id} className={className}>
            {content}
          </section>
        );
      })}
      <CallToActionSection photoBackground="/site/hero-port.jpg" visualKey="services.cta" />
    </>
  );
}
