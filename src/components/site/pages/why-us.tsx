"use client";

const meeting = "/site/meeting.jpg";
import { CallToActionSection, PageHero, SectionHeading } from "@/components/site/ui";
import { PhotoScrollSection } from "@/components/site/PhotoScrollSection";
import { useI18n } from "@/i18n/I18nProvider";



const points = [
  {
    title: "Understanding Rwanda's local business environment",
    text: "Based in Kigali, we know how local buying works.",
  },
  {
    title: "Ethical business representation",
    text: "Transparent representation that protects your name.",
  },
  { title: "Reliable stakeholder coordination", text: "Everyone on the same timeline." },
  {
    title: "Regulatory awareness and appropriate liaison",
    text: "We know the rules and the right channels.",
  },
  {
    title: "Clear responsibilities and documented follow-up",
    text: "Clear owners. Every commitment followed through.",
  },
];

export default function WhyUs() {
  const { t, tc } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("nav.whyUs")}
        title={tc("Local understanding. Professional coordination. Lasting relationships.")}
        intro={tc("Trusted local representation. Accountable coordination.")}
        image={meeting}
        visualKey="why.hero"
        alt="Business partners in discussion around a meeting table"
      />
      <section className="container-site py-12 md:py-16">
        <ol className="grid gap-x-16 md:grid-cols-2">
          {points.map((p, i) => (
            <li key={p.title} className="flex gap-6 border-t border-border py-9">
              <span className="font-display text-[28px] font-bold tabular-nums text-brass-light">
                0{i + 1}
              </span>
              <div>
                <h2 className="text-[22px]">{tc(p.title)}</h2>
                <p className="mt-3 text-[15.5px] text-muted-foreground">{tc(p.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <PhotoScrollSection image="/site/warehouse.jpg" visualKey="why.agency" overlayClassName="bg-brand-primary/75" className="py-12 md:py-16">
        <div className="container-site">
          <SectionHeading
            inverted
            eyebrow={t("about.agencyModel")}
            title={tc("Our agency model is built on transparency and clearly defined responsibilities.")}
            titleClassName="font-semibold"
            intro={tc("Where transactions are facilitated through our agency, the buyer and seller enter into their own commercial agreements and manage their contractual and payment obligations directly, unless otherwise agreed. LEAD MULTICHOICE supports the relationship through coordination, communication, follow-up, and operational assistance within the agreed scope of engagement.")}
          />
        </div>
      </PhotoScrollSection>
      <CallToActionSection visualKey="why.cta" />
    </>
  );
}
