"use client";

const heroImage = "/site/hero-port.jpg";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/content/site";
import { PageHero } from "@/components/site/ui";
import { ContactForm } from "@/components/site/ContactForm";
import { useI18n } from "@/i18n/I18nProvider";



export default function Contact() {
  const { t } = useI18n();
  const mapQuery = encodeURIComponent(company.location);
  return (
    <>
      <PageHero
        eyebrow={t("nav.contact")}
        title={t("contact.title")}
        intro={t("contact.intro")}
        image={heroImage}
        visualKey="contact.hero"
        alt="Container port at sunrise"
      />
      <section className="container-site grid gap-14 py-12 md:py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <aside>
          <h2 className="text-[24px]">LEAD MULTICHOICE Ltd</h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <MapPin className="mt-1 text-brass" size={18} aria-hidden />
              <div>
                <p className="eyebrow text-steel">{t("contact.location")}</p>
                <p className="mt-1">{company.location}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 text-brass" size={18} aria-hidden />
              <div>
                <p className="eyebrow text-steel">{t("contact.telephone")}</p>
                <a
                  href={`tel:${company.phoneTel}`}
                  className="mt-1 block font-semibold text-corporate hover:text-brand-primary tabular-nums"
                >
                  {company.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MessageCircle className="mt-1 text-brass" size={18} aria-hidden />
              <div>
                <p className="eyebrow text-steel">{t("contact.whatsapp")}</p>
                <a
                  href={company.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-semibold text-corporate hover:text-brand-primary"
                >
                  {t("contact.messageOnWhatsapp")} ↗
                </a>
              </div>
            </li>
          </ul>
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg">{t("contact.findUs")}</h3>
            </div>
            <div className="mt-3 h-64 overflow-hidden rounded border border-border bg-surface md:h-72">
              <iframe
                title={`Google Map showing ${company.location}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
