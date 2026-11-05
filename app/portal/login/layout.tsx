import type { ReactNode } from "react";
import { BackToTopButton } from "@/components/site/BackToTopButton";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function PortalLoginLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <ScrollReveal />
      <BackToTopButton />
    </I18nProvider>
  );
}
