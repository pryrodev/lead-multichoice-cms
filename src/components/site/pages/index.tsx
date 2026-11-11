"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Handshake, SearchCheck, Truck } from "lucide-react";
import { motion } from "motion/react";
import { services } from "@/content/services";
import { procurementModels } from "@/content/site";
import { ButtonLink, CallToActionSection, SectionHeading } from "@/components/site/ui";
import { ProcurementResourceCarousel } from "@/components/site/ProcurementResourceCarousel";
import { PartnerTicker } from "@/components/site/PartnerTicker";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { InsightsGrid } from "@/components/site/InsightsGrid";
import { useI18n } from "@/i18n/I18nProvider";
import { defaultHomePageContent, type HomePageContent } from "@/lib/cms/homepage";
import {
  defaultProcurementResources,
  type ProcurementResource,
} from "@/lib/cms/procurement-resources";

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

export default function Home({
  contentOverride,
  initialContent,
  resources = defaultProcurementResources.resources,
}: {
  contentOverride?: HomePageContent;
  initialContent?: HomePageContent;
  resources?: ProcurementResource[];
} = {}) {
  const { language, tc } = useI18n();
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
  return (
    <>
      <section
        data-no-reveal
        className="photo-parallax relative isolate flex min-h-[540px] flex-col justify-end overflow-visible bg-brand-primary md:min-h-[70vh]"
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
            <source src="/video/hero-logistics-web.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="photo-parallax-shade absolute inset-0 -z-10" aria-hidden />
        <div className="container-site pb-12 pt-24 md:pb-14 md:pt-28">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow mb-4 flex items-center gap-3 text-brass-light text-[16px]"
            >
              <span className="h-px w-8 bg-current" aria-hidden />
              {cmsText("Market Access | Supplier Engagement | Trade Facilitation")}
            </motion.p>
            <h1 className="max-w-4xl text-[20px] leading-[1.04] text-background md:text-[40px] lg:text-[50px]">
              {cmsText(
                "Connecting international suppliers with purchasing entities across Rwanda and East Africa.",
              )}
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="mt-5 max-w-2xl text-[16px] text-background/85 md:text-[18px] text-justify">
                {cmsText(
                  "We connect international manufacturers, authorised distributors and suppliers with purchasing entities in Rwanda and the wider East African region. We facilitate introductions and coordinate procurement, logistics, delivery and after-sales support.",
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="light" arrow>
                  {cmsText("I am an international supplier")}
                </ButtonLink>
                <ButtonLink href="/contact" variant="ghostLight">
                  {cmsText("I represent a purchasing entity")}
                </ButtonLink>
              </div>
            </motion.div>
          </div>
        </div>
        <PartnerTicker />
      </section>

      <section className="container-site grid gap-8 py-12 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionHeading
          eyebrow={cmsText("About Us")}
          title={cmsText(
            "A Rwanda-based partner connecting international suppliers with local entities.",
          )}
          titleClassName="text-[16px] leading-snug md:text-[2.7rem] lg:text-[2.7rem]"
          introClassName="text-left md:text-justify"
          intro={cmsText(
            "Based in Rwanda, Lead Multi-choice connects international manufacturers, authorised distributors and suppliers with purchasing entities, institutions and commercial organizations in Rwanda and the wider East African region.",
          )}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="group flex flex-col rounded-lg border border-border bg-background p-5 transition-all duration-200 hover:border-brand-primary/40 hover:shadow-sm sm:p-6">
            <div
              className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-md bg-muted"
              aria-hidden="true"
            >
              <Image
                src="/site/warehouse.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <h3 className="mt-5 text-[20px] font-semibold leading-snug tracking-tight text-foreground">
              {cmsText("For international suppliers")}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {cmsText(
                "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation.",
              )}
            </p>
          </article>
          <article className="group flex flex-col rounded-lg border border-border bg-background p-5 transition-all duration-200 hover:border-brand-primary/40 hover:shadow-sm sm:p-6">
            <div
              className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-md bg-muted"
              aria-hidden="true"
            >
              <Image
                src="/site/meeting.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <h3 className="mt-5 text-[20px] font-semibold leading-snug tracking-tight text-foreground">
              {cmsText("For Rwanda's purchasing entities")}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {cmsText(
                "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world through credible representatives.",
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="container-site py-4 md:py-6" aria-labelledby="procurement-models-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{cmsText("Procurement models")}</p>
            <h2
              id="procurement-models-heading"
              className="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl"
            >
              {cmsText("Ways we support procurement and project needs.")}
            </h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {procurementModels.map((model) => (
            <article
              key={model.id}
              className="h-full rounded-md border border-border bg-transparent p-4 md:p-5"
            >
              <h3 className="font-display text-base font-semibold text-foreground">
                {cmsText(model.name)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cmsText(model.description)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <PhotoScrollSection
        image="/site/meeting.jpg"
        visualKey="home.marketAccess"
        overlayClassName="bg-brand-primary/55"
        className="py-14 text-brand-white md:py-20"
      >
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3 text-brass-light">{cmsText("Rwanda market access")}</p>
            <h2 className="text-balance text-[30px] leading-tight text-brand-white md:text-[42px]">
              {cmsText("From procurement opportunity to delivery acceptance and payment.")}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] text-brand-white/85 md:text-[18px]">
              {cmsText(
                "We identify relevant partners, facilitate introductions, and coordinate procurement, logistics, delivery and after-sales follow-up within the agreed scope.",
              )}
            </p>
          </div>
          <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {bridgeSteps.map(({ title, text, icon: Icon }, index) => (
              <li
                key={title}
                className="min-w-0 rounded-lg border border-brand-white/30 bg-brand-primary/80 p-5 backdrop-blur-sm md:p-6"
              >
                <div className="flex items-center justify-between">
                  <Icon className="text-brass-light" size={23} aria-hidden />
                  <span className="font-display text-[13px] font-bold tabular-nums text-brass-light">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-[20px] text-brand-white">{cmsText(title)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-white/85 [overflow-wrap:anywhere] md:text-[13px]">
                  {cmsText(text)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </PhotoScrollSection>

      <section className="container-site py-12 md:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={cmsText("What we do")}
            title={cmsText("Local coordination across the global supply chain.")}
            className="max-w-none"
            titleClassName="lg:whitespace-nowrap lg:text-[clamp(1.75rem,2.8vw,2.25rem)]"
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-corporate hover:text-brand-primary"
          >
            {cmsText("Explore all services")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="group rounded border border-border p-6 transition-colors hover:border-corporate hover:bg-surface md:p-7"
            >
              <p className="font-display text-[13px] font-bold tabular-nums text-brass">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-[20px] group-hover:text-corporate">
                {cmsText(service.title)}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <PhotoScrollSection
        image="/site/warehouse.jpg"
        visualKey="home.tenders"
        overlayClassName="bg-brand-primary/20"
        className="bg-warm py-10 md:py-12"
      >
        <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="rounded-lg bg-brand-primary/85 p-5 text-brand-white backdrop-blur-sm md:p-6">
            <SectionHeading
              eyebrow={cmsText("Selected opportunities")}
              title={cmsText("Explore procurement opportunities.")}
              titleClassName="text-[23px] md:text-[30px]"
              intro={cmsText(
                "Review selected tender and consultancy listings published on Job in Rwanda.",
              )}
              inverted
            />
          </div>
          <ProcurementResourceCarousel resources={resources} />
        </div>
      </PhotoScrollSection>

      <InsightsGrid />

      <CallToActionSection visualKey="home.cta" photoBackground="/site/hero-port.jpg" />
    </>
  );
}
