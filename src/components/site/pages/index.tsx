"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Check, ClipboardList, Handshake, Package, SearchCheck, Truck } from "lucide-react";
import { motion } from "motion/react";
import { services } from "@/content/services";
import { procurementModels } from "@/content/site";
import { CallToActionSection, SectionHeading } from "@/components/site/ui";
import { PartnerTicker } from "@/components/site/PartnerTicker";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { useEffect, useState } from "react";
import { defaultHomePageContent, HOME_SECTION_NAV_ITEMS, type HomePageContent, type HomeSectionNavId } from "@/lib/cms/homepage";
import { defaultPartners, type WebsitePartner } from "@/lib/cms/partners";

const bridgeSteps = [
  {
    title: "Identify",
    text: "Assess markets and sourcing options.",
    icon: SearchCheck,
  },
  {
    title: "Verify",
    text: "Verify buyer companies and procurement rules.",
    icon: Check,
  },
  {
    title: "Connect",
    text: "Link global suppliers with local buyers.",
    icon: Handshake,
  },
  {
    title: "Coordinate",
    text: "Ground handling in country.",
    icon: Truck,
  },
];

const procurementModelIcons = {
  "hardware-supply": Package,
  "framework-contracts": ClipboardList,
  "epc-turnkey-contracts": Building2,
  "consultancy-urgency": BadgeCheck,
} as const;

export default function Home({
  contentOverride,
  initialContent,
  partners = defaultPartners.partners,
}: {
  contentOverride?: HomePageContent;
  initialContent?: HomePageContent;
  partners?: WebsitePartner[];
} = {}) {
  const [activeSection, setActiveSection] = useState<HomeSectionNavId>("overview");
  const viewStyle = (sectionId: HomeSectionNavId) => activeSection === sectionId ? undefined : { display: "none" as const };
  useEffect(() => {
    const syncHash = () => {
      const section = HOME_SECTION_NAV_ITEMS.find((item) => item.anchor === window.location.hash.slice(1));
      if (section) setActiveSection(section.id);
    };
    const onSectionChange = (event: Event) => {
      const sectionId = (event as CustomEvent<{ sectionId?: string }>).detail?.sectionId;
      if (HOME_SECTION_NAV_ITEMS.some((item) => item.id === sectionId)) setActiveSection(sectionId as HomeSectionNavId);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("home-section-change", onSectionChange);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("home-section-change", onSectionChange);
    };
  }, []);
  const { language, tc } = useI18n();
  const visuals = useSiteVisuals();
  const cmsPage = contentOverride ?? initialContent ?? defaultHomePageContent;
  const cmsText = (text: string) => {
    if (language !== "en") {
      const localized = (cmsPage.translations as Record<string, Record<string, string> | undefined>)?.[language]?.[text];
      if (localized && localized.trim().length > 0) return localized;
      return tc(text);
    }
    return cmsPage.translations.en?.[text as keyof typeof cmsPage.translations.en] ?? text;
  };
  const heroPort = cmsPage.heroImageUrl || "/site/hero-port.jpg";
  const heroVideo = visuals["home.heroVideo"];
  return (
    <div className="home-page-views">
      <section
        id="home-hero"
        hidden={activeSection !== "overview"}
        style={viewStyle("overview")}
        data-no-reveal
        className="photo-parallax relative isolate flex h-full min-h-0 flex-col justify-between overflow-hidden bg-brand-primary"
      >
        <div className="photo-parallax-window" aria-hidden>
          <img
            src={heroPort}
            alt=""
            width={1280}
            height={1440}
            fetchPriority="high"
            className="photo-parallax-image"
          />
          {heroVideo && (
            <video
              className="photo-parallax-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroPort}
              aria-hidden="true"
            >
              <source src={heroVideo} />
            </video>
          )}
        </div>
        <div className="photo-parallax-shade absolute inset-0 -z-10" aria-hidden />
        <div className="container-site flex flex-1 items-center py-3 md:py-5">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow mb-2 flex items-center gap-3 text-brass-light text-[13px] md:mb-3 md:text-[16px]"
            >
              <span className="h-px w-8 bg-current" aria-hidden />
              {cmsText("Market Access | Supplier Engagement | Trade Facilitation")}
            </motion.p>
            <h1 className="max-w-4xl text-[clamp(1.65rem,4vw,3.125rem)] leading-[1.04] text-background">
              {cmsText(
                "Connecting international suppliers with purchasing entities across Rwanda and East Africa.",
              )}
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="mt-3 max-w-2xl text-[14px] text-background/85 md:mt-4 md:text-[18px] text-justify">
                {cmsText(
                  "We connect international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and beyond. We facilitate introductions and coordinate procurement, logistics, delivery and after-sales support.",
                )}
              </p>
            </motion.div>
          </div>
        </div>
        <PartnerTicker organizations={partners} compact />
      </section>

      <section id="home-models" hidden={activeSection !== "models"} style={viewStyle("models")} className="relative isolate flex h-full min-h-0 items-center overflow-hidden bg-brand-primary text-brand-white" aria-labelledby="procurement-models-heading">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img src={visuals["home.models"]} alt="" width={1600} height={1000} className="h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-[1] bg-brand-primary/70" aria-hidden="true" />
        <div className="container-site relative z-10 w-full py-4 md:py-8">
          <div className="mb-5 flex flex-col gap-2 md:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-3xl">
              <p className="eyebrow text-brass-light">{cmsText("Procurement models")}</p>
              <h2
                id="procurement-models-heading"
                className="mt-2 whitespace-nowrap font-display text-[clamp(0.8rem,4vw,3rem)] font-semibold tracking-tight text-brand-white"
              >
                {cmsText("Support for procurement and project needs.")}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
            {procurementModels.map((model, index) => {
              const ModelIcon = procurementModelIcons[model.id];
              return (
                <article
                  key={model.id}
                  className="flex min-h-36 min-w-0 flex-col border-t-2 border-brand-gold bg-brand-white/10 p-3 backdrop-blur-sm sm:min-h-40 sm:p-4 md:min-h-52 md:p-5"
                >
                  <div className="mb-5 flex items-center justify-between md:mb-8">
                    <ModelIcon className="text-brand-gold" size={22} strokeWidth={1.8} aria-hidden="true" />
                    <span className="font-display text-sm font-semibold tabular-nums text-brand-gold">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-sm font-semibold leading-snug text-brand-white sm:text-base md:text-lg">
                    {cmsText(model.name)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-white/85 sm:text-sm">
                    {cmsText(model.description)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PhotoScrollSection
        id="home-market-access"
        hidden={activeSection !== "market-access"}
        style={viewStyle("market-access")}
        image="/site/meeting.jpg"
        visualKey="home.marketAccess"
        overlayClassName="bg-brand-primary/55"
        className="flex h-full min-h-0 items-center overflow-hidden py-2 text-brand-white md:py-4"
      >
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3 text-brass-light">{cmsText("Rwanda market access")}</p>
            <h2 className="text-balance text-[clamp(1.5rem,3vw,2.625rem)] leading-tight text-brand-white">
              {cmsText("From procurement opportunity to delivery acceptance and payment.")}
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] text-brand-white/85 md:mt-3 md:text-[16px]">
              {cmsText(
                "We identify relevant opportunities, connect with manufacturers, and coordinate procurement, logistics, delivery, and after-sales services.",
              )}
            </p>
          </div>
          <ol className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:gap-3 lg:grid-cols-4">
            {bridgeSteps.map(({ title, text, icon: Icon }, index) => (
              <li
                key={title}
                className="min-w-0 rounded-md border border-brand-white/30 bg-brand-primary/80 p-3 backdrop-blur-sm md:p-4 lg:p-5"
              >
                <div className="flex items-center justify-between">
                  <Icon className="text-brass-light" size={23} aria-hidden />
                  <span className="font-display text-[13px] font-bold tabular-nums text-brass-light">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-2 text-[16px] text-brand-white md:mt-3 md:text-[18px]">{cmsText(title)}</h3>
                <p className="mt-1 text-xs leading-snug text-brand-white/85 [overflow-wrap:anywhere] md:mt-2 md:text-[13px]">
                  {cmsText(text)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </PhotoScrollSection>

      <section id="home-services" hidden={activeSection !== "services"} style={viewStyle("services")} className="relative isolate grid h-full min-h-0 content-center overflow-hidden bg-brand-primary py-3 text-brand-white md:py-6">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img src={visuals["home.services"]} alt="" width={1600} height={1000} className="h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-[1] bg-brand-primary/75" aria-hidden="true" />
        <div className="container-site relative z-10 w-full">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end md:gap-6">
            <SectionHeading
              eyebrow={cmsText("What we do")}
              title={cmsText("Procurement and deal acceleration.")}
              className="max-w-none"
              titleClassName="text-brand-white lg:whitespace-nowrap lg:text-[clamp(1.75rem,2.8vw,2.25rem)]"
              inverted
            />
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-white hover:text-brand-gold"
            >
              {cmsText("Explore all services")} <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-4">
          {services.slice(0, 3).map((service, index) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="group min-w-0 border-t-2 border-brand-gold bg-brand-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-brand-white/15 sm:p-3 md:p-5"
            >
              <p className="font-display text-[13px] font-bold tabular-nums text-brand-gold">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-sm font-medium text-brand-white group-hover:text-brand-gold sm:text-base md:mt-3 md:text-[20px]">
                {cmsText(service.title)}
              </h3>
              <p className="mt-1 text-xs leading-snug text-brand-white/85 sm:text-sm md:mt-2 md:text-sm">
                {cmsText(service.summary)}
              </p>
            </Link>
          ))}
          </div>
        </div>
      </section>

      <div className="h-full min-h-0" hidden={activeSection !== "contact"} style={viewStyle("contact")}><CallToActionSection compact id="home-contact" visualKey="home.cta" photoBackground="/site/hero-port.jpg" /></div>
    </div>
  );
}
