"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink as ExtIcon } from "lucide-react";
import { leader, processStages, procurementResources } from "@/content/site";
import { cn } from "@/lib/utils";
import { CheckList, ExternalLink, btn } from "./ui";
import { useI18n } from "@/i18n/I18nProvider";

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

export function ProcurementResourceCard({ r }: { r: (typeof procurementResources)[number] }) {
  const { t, tc } = useI18n();
  return (
    <article className="flex flex-col justify-between rounded border border-border bg-background p-7 md:p-9">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{t("resources.external")}</p>
          <span className="font-mono text-[12.5px] text-muted-foreground">{r.domain}</span>
        </div>
        <h3 className="mt-5 text-[25px]">{r.name}</h3>
        <p className="mt-3 text-muted-foreground">{tc(r.description)}</p>
      </div>
      <div className="mt-8">
        <ExternalLink href={r.url} className={btn("primary")}>
          {tc(r.cta)}
        </ExternalLink>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-muted-foreground">
          <ExtIcon size={13} aria-hidden /> {t("resources.leaving")}
        </p>
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
        <div className="mt-6 space-y-5 text-charcoal">
          {(full ? leader.bio : leader.bio.slice(0, 1)).map((p) => (
            <p key={p.slice(0, 20)}>{tc(p)}</p>
          ))}
        </div>
        {full ? (
          <div className="mt-10 border-t border-border pt-8">
            <h4 className="eyebrow mb-4 text-steel">{t("leadership.expertise")}</h4>
            <ul className="flex flex-wrap gap-2">
              {leader.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-sm border border-border bg-warm px-3 py-1.5 text-[13.5px] text-charcoal"
                >
                  {tc(t)}
                </li>
              ))}
            </ul>
            <h4 className="eyebrow mb-4 mt-8 text-steel">{t("leadership.qualifications")}</h4>
            <CheckList items={leader.credentials.map(tc)} />
          </div>
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
