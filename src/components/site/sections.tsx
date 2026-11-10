"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { leader, processStages } from "@/content/site";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { cn } from "@/lib/utils";
import { CheckList, ExternalLink, btn } from "./ui";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProcessTimeline({ inverted }: { inverted?: boolean }) {
  const { tc } = useI18n();
  return (
    <ol className="relative grid gap-0 lg:grid-cols-5 lg:gap-6">
      <span
        className={cn(
          "absolute left-[19px] top-2 bottom-2 w-px lg:left-0 lg:right-0 lg:top-[19px] lg:bottom-auto lg:h-px lg:w-auto",
          inverted ? "bg-background/20" : "bg-border",
        )}
        aria-hidden
      />
      {processStages.map((s) => (
        <li key={s.n} className="relative flex gap-5 pb-8 lg:block lg:pb-0">
          <span
            className={cn(
              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-[13px] font-bold tabular-nums",
              inverted
                ? "border-brass-light bg-brand-primary text-brass-light"
                : "border-brass bg-background text-brass",
            )}
          >
            {s.n}
          </span>
          <div className="lg:mt-6">
            <h3 className={cn("text-[21px]", inverted && "text-background")}>{tc(s.title)}</h3>
            <p
              className={cn(
                "mt-2 text-[15.5px]",
                inverted ? "text-background/70" : "text-muted-foreground",
              )}
            >
              {tc(s.text)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProcurementResourceCard({ r }: { r: ProcurementResource }) {
  const { t, tc } = useI18n();
  return (
    <article className="flex h-full flex-col rounded border border-border bg-background p-5 sm:p-7">
      <div className="min-w-0">
        <p className="eyebrow">{t("resources.external")}</p>
        <h3 className="mt-5 text-xl leading-snug [overflow-wrap:anywhere] sm:text-[22px]">{r.name}</h3>
        <p className="mt-3 text-[15px] leading-6 text-muted-foreground [overflow-wrap:anywhere]">{tc(r.description)}</p>
      </div>
      <div className="mt-5">
        <ExternalLink href={r.url} className={btn("primary", "max-w-full whitespace-normal text-center [overflow-wrap:anywhere]")}>
          {tc(r.cta)}
        </ExternalLink>
      </div>
    </article>
  );
}

export function PortraitPlaceholder({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-full items-end overflow-hidden rounded bg-surface",
        className,
      )}
      role="img"
      aria-label={t("leadership.portraitAlt")}
    >
      <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="100" cy="95" r="38" fill="var(--steel)" opacity="0.25" />
        <path d="M30 250 C35 175 165 175 170 250 Z" fill="var(--steel)" opacity="0.25" />
      </svg>
      <p className="relative m-4 rounded bg-background/90 px-3 py-1.5 text-[12px] text-muted-foreground">
        {t("leadership.portraitPending")}
      </p>
    </div>
  );
}

export function LeadershipProfile({ full }: { full?: boolean }) {
  const { t, tc } = useI18n();
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14 lg:gap-20">
      <div>
        <PortraitPlaceholder />
      </div>
      <div className="max-w-2xl">
        <p className="eyebrow">{leader.title}</p>
        <h3 className="mt-3 text-[30px] md:text-[36px]">{leader.name}</h3>
        <div className="mt-6 max-w-prose space-y-4 text-[15px] leading-7 text-charcoal text-justify">
          {leader.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{tc(paragraph)}</p>
          ))}
        </div>
        {full ? (
          <>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-primary transition-colors hover:text-brand-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4"
              >
                {t("leadership.readMore")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent className="flex h-[min(90dvh,760px)] max-h-[90dvh] max-w-5xl flex-col gap-0 overflow-hidden rounded-md border-brand-primary/15 bg-warm p-0">
              <DialogHeader className="gap-0 border-b border-brand-primary/15 px-5 py-3 pr-12 text-left sm:px-7">
                <p className="eyebrow mb-1 text-brand-primary">{leader.title}</p>
                <DialogTitle className="font-display text-xl text-charcoal sm:text-2xl">
                  {leader.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {t("leadership.expertise")} and {t("leadership.qualifications")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden sm:grid-cols-[minmax(190px,0.72fr)_1.28fr] sm:grid-rows-1">
                <aside className="border-b border-brand-primary/15 bg-brand-primary/[0.035] p-5 sm:overflow-hidden sm:border-b-0 sm:border-r sm:p-6">
                  <PortraitPlaceholder className="aspect-[4/3] sm:aspect-[4/5]" />
                </aside>
                <div className="min-h-0 overscroll-contain overflow-y-auto p-6 sm:p-8">
                  <div className="space-y-7">
                    <div className="space-y-4 text-[15px] leading-7 text-charcoal text-justify">
                      {leader.bio.map((paragraph, index) => (
                        <p key={index}>{tc(paragraph)}</p>
                      ))}
                    </div>
                    <section className="border-t border-brand-primary/15 pt-5">
                      <h4 className="eyebrow mb-3 text-steel">{t("leadership.expertise")}</h4>
                      <ul className="flex flex-wrap gap-2">
                        {leader.tags.map((tag) => (
                          <li key={tag} className="rounded-sm border border-brand-primary/15 bg-background px-3 py-1.5 text-[13px] text-charcoal">
                            {tc(tag)}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="border-t border-brand-primary/15 pt-5">
                      <h4 className="eyebrow mb-3 text-steel">{t("leadership.qualifications")}</h4>
                      <CheckList items={leader.credentials.map(tc)} />
                    </section>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="mt-8 border-t border-border pt-6">
            <h4 className="eyebrow mb-3 text-steel">{t("leadership.expertise")}</h4>
            <ul className="flex flex-wrap gap-2">
              {leader.tags.map((tag) => (
                <li key={tag} className="rounded-sm border border-brand-primary/15 bg-background px-3 py-1.5 text-[13px] text-charcoal">
                  {tc(tag)}
                </li>
              ))}
            </ul>
            <h4 className="eyebrow mb-3 mt-6 text-steel">{t("leadership.qualifications")}</h4>
            <CheckList items={leader.credentials.map(tc)} />
          </div>
          </>
        ) : (
          <Link
            href="/leadership"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-corporate hover:text-brand-primary"
          >
            {t("leadership.meetLeadership")} <ArrowRight size={16} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
