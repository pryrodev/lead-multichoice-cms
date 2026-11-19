"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="relative isolate overflow-hidden bg-brand-primary/75 text-primary-foreground">
      <div className="border-t border-background/10">
        <div className="container-site flex flex-col gap-2 py-4 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Lead Multi-Choice ®. {t("footer.allRightsReserved")}
          </p>
          <p>
            <a
              href="https://www.santechconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-foreground underline-offset-4 hover:underline"
            >
              {t("footer.developedBy")} Santech
            </a>
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="footer-imigongo" />
    </footer>
  );
}
