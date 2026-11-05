"use client";

import Link from "next/link";
import { ArrowRight, Check, Globe2, Handshake, SearchCheck, Truck } from "lucide-react";
import { motion } from "motion/react";
import { services } from "@/content/services";
import { procurementResources } from "@/content/site";
import { ButtonLink, ExternalLink, SectionHeading, btn } from "@/components/site/ui";
import { PartnerTicker } from "@/components/site/PartnerTicker";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { InsightsGrid } from "@/components/site/InsightsGrid";
import { useI18n } from "@/i18n/I18nProvider";
import { defaultHomePageContent, type HomePageContent } from "@/lib/cms/homepage";



const bridgeSteps = [
  {
    title: "Identify",
    text: "Find relevant buyers, suppliers and sourcing opportunities.",
    icon: SearchCheck,
  },
  {
    title: "Verify",
    text: "Support due diligence and confirm the right points of contact.",
    icon: Check,
  },
  {
    title: "Connect",
    text: "Facilitate direct conversations between the parties.",
    icon: Handshake,
  },
  {
    title: "Coordinate",
    text: "Help align procurement, logistics and delivery follow-up.",
    icon: Truck,
  },
];

export default function Home({ contentOverride, initialContent }: { contentOverride?: HomePageContent; initialContent?: HomePageContent } = {}) {
  const { language, tc } = useI18n();
  const cmsPage = contentOverride ?? initialContent ?? defaultHomePageContent;
  const cmsText = (text: string) => cmsPage.translations[language][text as keyof typeof cmsPage.translations.en] ?? tc(text);
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
              className="eyebrow mb-4 flex items-center gap-3 text-brass-light"
            >
              <span className="h-px w-8 bg-current" aria-hidden />
              {cmsText("Market Access | Supplier Engagement | Trade Facilitation")}
            </motion.p>
            <h1 className="max-w-4xl text-[38px] leading-[1.04] text-background md:text-[56px] lg:text-[64px]">
              {cmsText("Connecting Rwanda's buyers with trusted global suppliers.")}
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="mt-5 max-w-2xl text-[16px] text-background/85 md:text-[18px]">
                {cmsText(
                  "We bridge Rwanda's purchasing market and the global supply ecosystem, helping buyers and international suppliers find each other and coordinate with confidence.",
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

      <section className="container-site grid gap-8 py-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:py-16">
        <SectionHeading
          eyebrow={cmsText("About LEAD MULTICHOICE")}
          title={cmsText("A Rwanda-based bridge between buyers and global supply.")}
          intro={cmsText("Based in Rwanda, LEAD MULTICHOICE connects local purchasing entities with credible international manufacturers and distributors, coordinating supplier verification, representation and procurement follow-through.")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded border border-border bg-background p-6 md:p-7">
            <Globe2 className="text-corporate" size={25} aria-hidden />
            <h3 className="mt-5 text-[20px]">{cmsText("For international suppliers")}</h3>
            <p className="mt-3 text-[15.5px] text-muted-foreground">
              {cmsText(
                "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation.",
              )}
            </p>
          </article>
          <article className="rounded border border-border bg-background p-6 md:p-7">
            <Handshake className="text-corporate" size={25} aria-hidden />
            <h3 className="mt-5 text-[20px]">{cmsText("For Rwanda's purchasing entities")}</h3>
            <p className="mt-3 text-[15.5px] text-muted-foreground">
              {cmsText(
                "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world.",
              )}
            </p>
          </article>
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
              {cmsText("Local support from supplier search through delivery.")}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] text-brand-white/85 md:text-[18px]">
              {cmsText("We structure the connection, facilitate engagement and keep the work moving across the parties involved.")}
            </p>
          </div>
          <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {bridgeSteps.map(({ title, text, icon: Icon }, index) => (
              <li key={title} className="rounded-lg border border-brand-white/30 bg-brand-primary/80 p-5 backdrop-blur-sm md:p-6">
                <div className="flex items-center justify-between">
                  <Icon className="text-brass-light" size={23} aria-hidden />
                  <span className="font-display text-[13px] font-bold tabular-nums text-brass-light">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-[20px] text-brand-white">{cmsText(title)}</h3>
                <p className="mt-2 text-[14.5px] text-brand-white/80">{cmsText(text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </PhotoScrollSection>

      <section className="container-site py-12 md:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={cmsText("What we do")}
            title={cmsText("Local coordination across the supply journey.")}
            className="max-w-none"
            titleClassName="lg:whitespace-nowrap lg:text-[clamp(1.875rem,3.1vw,2.625rem)]"
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
              <h3 className="mt-3 text-[20px] group-hover:text-corporate">{cmsText(service.title)}</h3>
              <p className="mt-2 text-[14.5px] text-muted-foreground">{cmsText(service.summary)}</p>
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
              eyebrow={cmsText("Featured contracts & tenders")}
              title={cmsText("Stay connected to procurement opportunities.")}
              intro={cmsText("Browse live notices on Rwanda's official procurement portals. Check the source for complete documents and deadlines.")}
              inverted
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {procurementResources.map((resource) => (
              <article key={resource.id} className="rounded border border-border bg-background p-5">
                <p className="eyebrow">{cmsText("Official procurement portal")}</p>
                <h3 className="mt-3 text-[18px]">{resource.name}</h3>
                <p className="mt-2 text-[14px] text-muted-foreground">{cmsText(resource.description)}</p>
                <ExternalLink
                  href={resource.url}
                  className={btn("outline", "mt-5 min-h-10 px-4 py-2 text-[13px]")}
                >
                  {cmsText(resource.cta)}
                </ExternalLink>
              </article>
            ))}
          </div>
        </div>
      </PhotoScrollSection>

      <InsightsGrid />

      <PhotoScrollSection image="/site/hero-port.jpg" visualKey="home.cta" overlayClassName="bg-brand-primary/55" className="text-brand-white">
        <div className="container-site py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-4 flex items-center justify-center gap-3 text-brass-light">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {cmsText("Start a conversation")}
            </p>
            <h2 className="text-balance text-[30px] leading-tight text-brand-white md:text-[44px]">
              {cmsText("Looking for a supplier or a route into Rwanda?")}
            </h2>
            <p className="mt-5 text-brand-white/90">
              {cmsText("Tell us what you are sourcing or the market you want to reach.")}
            </p>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact#business-enquiry" variant="light" arrow>
              {cmsText("Partner with Us")}
            </ButtonLink>
            <ButtonLink href="/procurement-opportunities" variant="ghostLight">
              {cmsText("Explore Opportunities")}
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghostLight" className="w-full">
              {cmsText("Contact Us")}
            </ButtonLink>
          </div>
          <dl className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-brand-white/25 pt-6">
            <div>
              <dt className="text-[12px] uppercase tracking-[0.14em] text-brand-white/70">{cmsText("Based in")}</dt>
              <dd className="mt-1 font-display font-semibold">Kigali</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-[0.14em] text-brand-white/70">{cmsText("Since")}</dt>
              <dd className="mt-1 font-display font-semibold">2015</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-[0.14em] text-brand-white/70">{cmsText("Reach")}</dt>
              <dd className="mt-1 font-display font-semibold">East Africa</dd>
            </div>
          </dl>
        </div>
      </PhotoScrollSection>
    </>
  );
}
