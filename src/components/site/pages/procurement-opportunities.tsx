"use client";

const heroImage = "/site/warehouse.jpg";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { ButtonLink, PageHero } from "@/components/site/ui";
import { ProcurementResourceCarousel } from "@/components/site/ProcurementResourceCarousel";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";

export default function Procurement({ resources }: { resources: ProcurementResource[] }) {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("footer.procurementResources")}
        title={tc("Selected procurement opportunities.")}
        intro={tc("Browse selected tender and consultancy listings published on Job in Rwanda.")}
        image={heroImage}
        visualKey="procurement.hero"
        alt="Organised warehouse shelves"
      />
      <section className="container-site py-12">
        <ProcurementResourceCarousel resources={resources} />
      </section>
      <PhotoScrollSection
        image="/site/hero-port.jpg"
        visualKey="procurement.portals"
        overlayClassName="bg-brand-white/88"
        className="py-12"
      >
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-[28px] md:text-[34px]">
              {tc("About these opportunity listings")}
            </h2>
            <div className="mt-5 space-y-4 text-charcoal">
              <p>
                {tc(
                  "These listings are hosted by Job in Rwanda and link to individual consultancy and tender opportunities. Open each listing to review the full notice, requirements and deadline.",
                )}
              </p>
              <p>
                {tc(
                  "Lead Multi-Choice ® does not own or administer these listings and cannot guarantee an award or issue procurement decisions. Confirm the requirements, submission process and closing date in each original listing.",
                )}
              </p>
            </div>
          </div>
          <div className="rounded bg-brand-primary p-8 text-background md:p-10">
            <p className="eyebrow text-brass-light">{tc("Coordination support")}</p>
            <h2 className="mt-4 text-[26px] text-background">
              {tc("Need help acting on an opportunity?")}
            </h2>
            <p className="mt-4 text-background/75">
              {tc(
                "Suppliers and institutional buyers can contact Lead Multi-Choice ® to discuss appropriate coordination support, from supplier introductions to logistics and delivery follow-up.",
              )}
            </p>
            <ButtonLink href="/contact" variant="light" className="mt-8" arrow>
              {t("header.discussOpportunity")}
            </ButtonLink>
          </div>
        </div>
      </PhotoScrollSection>
    </>
  );
}
