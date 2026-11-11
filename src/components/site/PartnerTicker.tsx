"use client";

import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { partnerTickerLabels } from "@/content/insights";
import { useI18n } from "@/i18n/I18nProvider";

const ecosystemOrganizations = [
  {
    name: "Rwanda Public Procurement Authority",
    href: "https://www.rppa.gov.rw/",
    logo: "https://www.rppa.gov.rw/fileadmin/user_upload/RPPA/News_Images/New_replace_Logo_123.jpg",
  },
  {
    name: "Rwanda Development Board",
    href: "https://rdb.rw/",
    logo: "https://images.squarespace-cdn.com/content/v1/55ed8436e4b038f693789ca0/7f50683b-b00b-4fc4-8746-aab7d56cf8c9/RDB1.png",
  },
  {
    name: "Private Sector Federation",
    href: "https://psf.org.rw/",
    logo: "/psf.png",
  },
  {
    name: "Rwanda Food and Drugs Authority",
    href: "https://www.rwandafda.gov.rw/",
    logo: "https://www.rwandafda.gov.rw/fileadmin/user_upload/RwandaFDA/rwandafda_logo.png",
  },
  {
    name: "Rwanda Standards Board",
    href: "https://www.rsb.gov.rw/",
    logo: "https://www.rsb.gov.rw/fileadmin/user_upload/Icons_logo/Logo-01.png",
  },
  {
    name: "Rwanda Revenue Authority",
    href: "https://www.rra.gov.rw/",
    logo: "https://www.rra.gov.rw/typo3conf/ext/rra_ui/Resources/Public/images/Rwanda-Revenue-Authority-logo.png",
  },
  {
    name: "National Bank of Rwanda",
    href: "https://www.bnr.rw/",
    logo: "https://www.bnr.rw/static/media/bnr-logo.7633d18322b2e9a1c715.png",
  },
  {
    name: "Bank of Kigali",
    href: "https://www.bk.rw/",
    logo: "https://www.rwandainkenya.gov.rw/fileadmin/user_upload/Kenya_user_upload/news_pictures/bk.png",
  },
  {
    name: "MTN Rwanda",
    href: "https://www.mtn.co.rw/",
    logo: "https://www.mtn.co.rw/wp-content/uploads/2023/07/new-mtn-logo.jpg",
  },
];

export function PartnerTicker() {
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

  function resumeMarquee() {
    if (shouldReduceMotion) return;
    void controls.start({
      x: "-50%",
      transition: { duration: 48, ease: "linear", repeat: Infinity, repeatType: "loop" },
    });
  }

  return (
    <div className="container-site relative z-10 pb-8 pt-4 md:pb-10 md:pt-6">
      <section aria-label={partnerTickerLabels[language] ?? partnerTickerLabels.en}>
        <div className="mx-auto mb-4 flex max-w-5xl items-center gap-4 md:mb-5 md:gap-6">
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
                {ecosystemOrganizations.map((organization) => (
                  <li key={`${copy}-${organization.name}`} className="shrink-0">
                    <a
                      href={organization.href}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="flex min-h-12 items-center gap-3 rounded-sm text-brand-white/90 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-primary"
                    >
                      <span className="relative block h-10 w-28 shrink-0 md:h-12 md:w-32">
                        <Image
                          src={organization.logo}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 128px, 112px"
                          unoptimized
                          className="object-contain"
                        />
                      </span>
                      <span className="max-w-28 text-xs font-semibold leading-tight text-brand-white md:max-w-36 md:text-sm">
                        {organization.name}
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
