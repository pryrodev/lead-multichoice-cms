"use client";

const truck = "/site/truck.jpg";
import { values } from "@/content/services";
import { CallToActionSection, PageHero, SectionHeading } from "@/components/site/ui";
import { ProcessTimeline } from "@/components/site/sections";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";



export default function About() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.about")}
        title={tc("Connecting businesses. Coordinating opportunity. Building trust.")}
        intro={tc("Market access, procurement and supply chain support in Rwanda.")}
        image={truck}
        visualKey="about.hero"
        alt="Container truck on a highway through Rwanda's hills"
      />
      <section className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          eyebrow={t("about.companyOverview")}
          title={tc("A Rwanda-based partner for international business.")}
        />
        <div className="space-y-5 text-charcoal">
          <p>
            {tc(
              "Registered in 2015 in Remera, Kigali. We connect international manufacturers and suppliers with buyers in Rwanda and East Africa, and coordinate everything in between.",
            )}
          </p>
          <p>
            {tc(
              "We facilitate — buyers and sellers keep their own contracts and payments unless agreed otherwise.",
            )}
          </p>
        </div>
      </section>
      <PhotoScrollSection image="/site/meeting.jpg" visualKey="about.mission" overlayClassName="bg-brand-primary/50" className="py-12 text-background md:py-16">
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow text-brass-light">{t("about.mission")}</p>
            <p className="mt-5 font-display text-[22px] font-semibold leading-snug md:text-[26px]">
              {tc(
                "Connect international businesses with opportunity in Rwanda — ethically and reliably.",
              )}
            </p>
          </div>
          <div className="md:border-l md:border-background/15 md:pl-16">
            <p className="eyebrow text-brass-light">{t("about.vision")}</p>
            <p className="mt-5 font-display text-[22px] font-semibold leading-snug md:text-[26px]">
              {tc("Be East Africa's most trusted market-access partner.")}
            </p>
          </div>
        </div>
      </PhotoScrollSection>
      <section className="container-site py-12 md:py-16">
        <SectionHeading
          eyebrow={t("about.coreValues")}
          title={tc("The principles behind every engagement.")}
        />
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
      <PhotoScrollSection image="/site/warehouse.jpg" visualKey="about.agency" overlayClassName="bg-brand-white/88" className="bg-warm py-12 md:py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("about.agencyModel")}
            title={tc("Five stages from first contact to lasting relationship.")}
          />
          <div className="mt-16">
            <ProcessTimeline />
          </div>
          <p className="mt-14 max-w-3xl border-l-2 border-brass pl-5 text-charcoal">
            {tc("Contracts and payments stay between buyer and seller. We coordinate around them.")}
          </p>
        </div>
      </PhotoScrollSection>
      <CallToActionSection visualKey="about.cta" />
    </>
  );
}
