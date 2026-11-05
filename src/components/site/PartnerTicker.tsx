"use client";

import Image from "next/image";
import { partnerTickerLabels } from "@/content/insights";
import { useI18n } from "@/i18n/I18nProvider";

const ecosystemOrganizations = [
  {
    name: "Rwanda Development Board",
    href: "https://rdb.rw/",
    logo: "https://images.squarespace-cdn.com/content/v1/55ed8436e4b038f693789ca0/7f50683b-b00b-4fc4-8746-aab7d56cf8c9/RDB1.png",
    width: 136,
    height: 48,
  },
  {
    name: "National Bank of Rwanda",
    href: "https://www.bnr.rw/",
    logo: "https://www.bnr.rw/static/media/bnr-logo.7633d18322b2e9a1c715.png",
    width: 44,
    height: 44,
  },
  {
    name: "Bank of Kigali",
    href: "https://www.bk.rw/",
    logo: "https://www.rwandainkenya.gov.rw/fileadmin/user_upload/Kenya_user_upload/news_pictures/bk.png",
    width: 44,
    height: 44,
  },
  {
    name: "MTN Rwanda",
    href: "https://www.mtn.co.rw/",
    logo: "https://images.africanfinancials.com/f41c3ca9-rw-mtn-logo.png",
    width: 48,
    height: 48,
  },
];

export function PartnerTicker() {
  const { language } = useI18n();

  return (
    <div className="container-site relative z-10 pb-8 pt-4 md:pb-10 md:pt-6">
      <section aria-label={partnerTickerLabels[language]}>
        <div className="mx-auto mb-4 flex max-w-5xl items-center gap-4 md:mb-5 md:gap-6">
          <span className="h-px flex-1 bg-brand-white/35" aria-hidden="true" />
          <p className="eyebrow whitespace-nowrap text-brand-white/80">{partnerTickerLabels[language]}</p>
          <span className="h-px flex-1 bg-brand-white/35" aria-hidden="true" />
        </div>

        <ul className="flex items-center justify-between gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ecosystemOrganizations.map((organization) => (
            <li key={organization.name} className="shrink-0">
              <a
                href={organization.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center gap-3 rounded-sm text-brand-white/90 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-primary"
              >
                <Image
                  src={organization.logo}
                  alt=""
                  width={organization.width}
                  height={organization.height}
                  unoptimized
                  className="max-h-10 max-w-28 object-contain md:max-h-12 md:max-w-32"
                  style={{ width: "auto", height: "auto" }}
                />
                <span className="max-w-28 text-xs font-semibold leading-tight text-brand-white md:max-w-36 md:text-sm">
                  {organization.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
