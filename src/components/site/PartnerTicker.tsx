"use client";

import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { partnerTickerLabels } from "@/content/insights";
import { useI18n } from "@/i18n/I18nProvider";
import type { WebsitePartner } from "@/lib/cms/partners";

export function PartnerTicker({ organizations, compact = false }: { organizations: WebsitePartner[]; compact?: boolean }) {
  const { language } = useI18n();
  const controls = useAnimationControls();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set({ x: "0%" });
      return;
    }

    void controls.start({
      x: "-50%",
      transition: { duration: 48, ease: "linear", repeat: Infinity, repeatType: "loop" },
    });

    return () => controls.stop();
  }, [controls, shouldReduceMotion]);

  if (organizations.length === 0) return null;

  function resumeMarquee() {
    if (shouldReduceMotion) return;
    void controls.start({
      x: "-50%",
      transition: { duration: 48, ease: "linear", repeat: Infinity, repeatType: "loop" },
    });
  }

  return (
    <div className={`container-site relative z-10 ${compact ? "pb-2 pt-1 md:pb-3 md:pt-2" : "pb-8 pt-4 md:pb-10 md:pt-6"}`}>
      <section className="scroll-mt-28" aria-label={partnerTickerLabels[language] ?? partnerTickerLabels.en}>
        <div className={`mx-auto flex max-w-5xl items-center gap-4 md:gap-6 ${compact ? "mb-1 md:mb-2" : "mb-4 md:mb-5"}`}>
          <span className="h-px flex-1 bg-brand-white/35" aria-hidden="true" />
          <p className="eyebrow whitespace-nowrap text-brand-white/80">{partnerTickerLabels[language] ?? partnerTickerLabels.en}</p>
          <span className="h-px flex-1 bg-brand-white/35" aria-hidden="true" />
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => controls.stop()}
          onMouseLeave={resumeMarquee}
          onFocusCapture={() => controls.stop()}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resumeMarquee();
          }}
        >
          <motion.div
            className="flex w-max items-center"
            initial={{ x: "0%" }}
            animate={controls}
            aria-label={partnerTickerLabels[language] ?? partnerTickerLabels.en}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex w-max shrink-0 items-center gap-8 pr-8"
              >
                {organizations.map((organization) => (
                  <li key={`${copy}-${organization.name}`} className="shrink-0">
                    <a
                      href={organization.href}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={copy === 1 ? -1 : undefined}
                      className={`flex items-center gap-3 rounded-sm text-brand-white/90 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-primary ${compact ? "min-h-9" : "min-h-12"}`}
                    >
                      <span className={`relative block shrink-0 ${compact ? "h-8 w-24 md:h-9 md:w-28" : "h-10 w-28 md:h-12 md:w-32"}`}>
                        <Image
                          src={organization.logo}
                          alt={organization.name}
                          fill
                          sizes="(min-width: 768px) 128px, 112px"
                          unoptimized
                          className="object-contain"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
