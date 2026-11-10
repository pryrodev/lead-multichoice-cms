"use client";

const truck = "/site/truck.jpg";
import { values } from "@/content/services";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";

export default function About() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.about")}
        title={tc("Your Local Partner. Your Regional Advantage.")}
        intro={tc(
          "Connecting International Business to Rwanda Through Trust, Integrity and Local Expertise.",
        )}
        image={truck}
        visualKey="about.hero"
        alt="Container truck on a highway through Rwanda's hills"
      />
      <section className="container-site py-12 md:py-16">
        <SectionHeading
          eyebrow={t("about.companyOverview")}
          title={tc("Registered in Rwanda since 2015")}
        />
        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          {tc(
            "Lead Multi-Choice ® is a private limited company registered with the Rwanda Development Board and headquartered in Remera, Kigali.",
          )}
        </p>
      </section>
      <PhotoScrollSection
        image="/site/meeting.jpg"
        visualKey="about.mission"
        overlayClassName="bg-brand-primary/50"
        className="py-12 text-background md:py-16"
      >
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brass-light md:text-[28px]">
              {t("about.mission")}
            </h2>
            <p className="mt-4 max-w-prose text-[18px] font-medium leading-relaxed md:text-xl">
              {tc(
                "To connect international businesses with opportunities in Rwanda through trusted trade facilitation, ethical business representation, reliable coordination and professional local support.",
              )}
            </p>
          </div>
          <div className="md:border-l md:border-background/15 md:pl-16">
            <h2 className="font-display text-2xl font-semibold text-brass-light md:text-[28px]">
              {t("about.vision")}
            </h2>
            <p className="mt-4 max-w-prose text-[18px] font-medium leading-relaxed md:text-xl">
              {tc(
                "To become a trusted and respected regional partner for international manufacturers, distributors and businesses seeking dependable market access, compliant trade facilitation and effective supply-chain coordination in Rwanda and the wider East African region.",
              )}
            </p>
          </div>
        </div>
      </PhotoScrollSection>
      <section className="container-site py-12 md:py-16">
        <SectionHeading eyebrow={t("about.coreValues")} title={tc("Our Core Values")} />
        <ol className="mt-14 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="bg-background p-8">
              <span className="font-display text-[13px] font-bold tabular-nums text-brass">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-[22px]">{tc(v.title)}</h3>
              <p className="mt-2 text-[15.5px] text-muted-foreground">{tc(v.text)}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
