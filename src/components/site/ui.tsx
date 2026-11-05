"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";
import type { SiteVisualKey } from "@/lib/cms/site-visuals";

type Variant = "primary" | "outline" | "light" | "ghostLight";
const variants: Record<Variant, string> = {
  primary: "bg-corporate text-primary-foreground hover:bg-brand-primary",
  outline:
    "border border-brand-primary/25 text-brand-primary hover:border-brand-primary hover:bg-surface",
  light: "bg-background text-brand-primary hover:bg-brass-light",
  ghostLight:
    "border border-background/35 text-background hover:border-background hover:bg-background/10",
};
export const btn = (v: Variant = "primary", className?: string) =>
  cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded px-5 py-2.5 text-[14.5px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[v],
    className,
  );

export function ButtonLink({
  variant = "primary",
  className,
  children,
  arrow,
  ...props
}: Omit<ComponentProps<typeof Link>, "className" | "children"> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  arrow?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link {...props} className={btn(variant, className)}>
      {children}
      {arrow && <ArrowRight size={16} aria-hidden />}
    </Link>
  );
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight size={16} aria-hidden />
      <span className="sr-only"> (opens an external website in a new tab)</span>
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  inverted,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-4 flex items-center gap-3",
            align === "center" && "justify-center",
            inverted && "text-brass-light",
          )}
        >
          <span className="h-px w-8 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <H
        className={cn(
          H === "h1" ? "text-[38px] md:text-[56px] lg:text-[62px]" : "text-[30px] md:text-[42px]",
          "text-balance",
          inverted && "text-background",
        )}
      >
        {title}
      </H>
      {intro && (
        <p
          className={cn(
            "mt-5 text-[17px] md:text-[18px]",
            inverted ? "text-background/75" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
  visualKey,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  alt?: string;
  visualKey?: SiteVisualKey;
  children?: ReactNode;
}) {
  const visuals = useSiteVisuals();
  const heroImage = visualKey ? visuals[visualKey] || image : image;
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border",
        heroImage
          ? "photo-parallax flex min-h-[520px] items-center bg-brand-primary/80 md:min-h-[65vh]"
          : "bg-warm",
      )}
    >
      {heroImage && (
        <>
          <div className="photo-parallax-window" aria-hidden>
            <img
              src={heroImage}
              alt={alt ?? ""}
              width={1280}
              height={960}
              className="photo-parallax-image"
            />
          </div>
          <div className="photo-parallax-shade absolute inset-0 -z-10" aria-hidden />
        </>
      )}
      <div className="container-site relative py-16 md:py-24">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          inverted={Boolean(heroImage)}
        />
        {children}
      </div>
    </section>
  );
}

export function CallToActionSection({
  title = "Let's move your business into Rwanda.",
  text = "Supplier, buyer or partner — tell us what you need.",
  brandGradient = false,
  photoBackground = "/site/hero-port.jpg",
  visualKey,
}: {
  title?: string;
  text?: string;
  brandGradient?: boolean;
  photoBackground?: string;
  visualKey?: SiteVisualKey;
}) {
  const { t, tc } = useI18n();
  const visuals = useSiteVisuals();
  const ctaImage = visualKey ? visuals[visualKey] || photoBackground : photoBackground;
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-primary text-background",
        "photo-parallax isolate",
      )}
      style={
        brandGradient
          ? {
              background:
                "radial-gradient(125% 125% at 50% 10%, var(--brand-white) 40%, var(--brand-primary) 100%)",
            }
          : undefined
      }
    >
      {ctaImage && (
        <>
          <div className="photo-parallax-window" aria-hidden="true">
            <img src={ctaImage} alt="" width={1600} height={1000} className="photo-parallax-image" />
          </div>
          <div className="absolute inset-0 -z-10 bg-brand-primary/55" aria-hidden="true" />
        </>
      )}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(var(--brass-light) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div className="container-site relative py-16 md:py-20">
        <div
          className={cn(
            "mx-auto max-w-3xl text-center",
            brandGradient ? "text-brand-primary" : "text-background",
          )}
        >
          <p
            className={cn(
              "eyebrow mb-4 flex items-center justify-center gap-3",
              brandGradient ? "text-brand-primary" : "text-brass-light",
            )}
          >
            <span className="h-px w-8 bg-current" aria-hidden />
            {t("cta.startConversation")}
          </p>
          <h2
            className={cn(
              "text-[30px] md:text-[44px]",
              brandGradient ? "text-brand-primary" : "text-background",
            )}
          >
            {tc(title)}
          </h2>
          <p className={cn("mt-5", brandGradient ? "text-charcoal" : "text-background/75")}>
            {tc(text)}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact" variant={brandGradient ? "primary" : "light"} arrow>
              {t("header.discussOpportunity")}
            </ButtonLink>
            <ButtonLink href="/contact" variant={brandGradient ? "outline" : "ghostLight"}>
              {t("cta.contactTeam")}
            </ButtonLink>
          </div>
          <dl
            className={cn(
              "mx-auto mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6",
              brandGradient ? "border-brand-primary/15" : "border-background/15",
            )}
          >
            <div>
              <dt
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em]",
                  brandGradient ? "text-brand-primary/65" : "text-background/55",
                )}
              >
                {t("cta.basedIn")}
              </dt>
              <dd className="mt-1 font-display font-semibold">Kigali</dd>
            </div>
            <div>
              <dt
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em]",
                  brandGradient ? "text-brand-primary/65" : "text-background/55",
                )}
              >
                {t("cta.since")}
              </dt>
              <dd className="mt-1 font-display font-semibold">2015</dd>
            </div>
            <div>
              <dt
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em]",
                  brandGradient ? "text-brand-primary/65" : "text-background/55",
                )}
              >
                {t("cta.reach")}
              </dt>
              <dd className="mt-1 font-display font-semibold">{t("cta.eastAfrica")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-[15.5px] text-charcoal">
          <span className="mt-[11px] h-px w-3 shrink-0 bg-brass" aria-hidden />
          {i.replace(/\.$/, "")}
        </li>
      ))}
    </ul>
  );
}
