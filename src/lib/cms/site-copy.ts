import { company, enquiryTypes, nav, processStages, procurementResources, leader } from "@/content/site";
import { industries, services, values, whyUs } from "@/content/services";
import { insights } from "@/content/insights";
import { languages, messages, type Language, type MessageKey } from "@/i18n/messages";
import { siteCopySourceTexts, translateSiteCopy } from "@/i18n/site-copy";

export type SiteCopyField = {
  id: string;
  source: string;
  group: string;
  defaults: Record<Language, string>;
};

const messageFields: SiteCopyField[] = (Object.keys(messages.en) as MessageKey[]).map((key) => ({
  id: `message:${key}`,
  source: messages.en[key],
  group: `Shared · ${key.split(".")[0]}`,
  defaults: Object.fromEntries(languages.map((language) => [language, messages[language][key]])) as Record<Language, string>,
}));

const copySources = new Map<string, string>();
for (const source of siteCopySourceTexts) copySources.set(source, "Page copy");

function collectFields(value: unknown, group: string): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectFields(item, group));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (typeof child === "string" && ["title", "summary", "body", "text", "alt", "imageAlt", "category", "intro", "name", "description", "cta", "tagline", "note", "location", "label"].includes(key)) {
      copySources.set(child, group);
    } else if (typeof child === "object") {
      collectFields(child, group);
    }
  }
}

collectFields(services, "Services");
collectFields(industries, "Industries");
collectFields(values, "About");
collectFields(whyUs, "Why choose us");
collectFields(processStages, "Company");
collectFields(procurementResources, "Procurement");
collectFields(enquiryTypes, "Contact");
collectFields(leader, "Leadership");
collectFields(company, "Company");
collectFields(nav, "Navigation");
collectFields(insights.en, "Blog");

const pageCopyFields: SiteCopyField[] = [...copySources].map(([source, group]) => ({
  id: `copy:${source}`,
  source,
  group,
  defaults: Object.fromEntries(languages.map((language) => [language, translateSiteCopy(language, source)])) as Record<Language, string>,
}));

export const SITE_COPY_FIELDS = [...messageFields, ...pageCopyFields];
export type SiteCopyContent = { translations: Record<Language, Record<string, string>> };

export const defaultSiteCopyContent: SiteCopyContent = {
  translations: Object.fromEntries(languages.map((language) => [
    language,
    Object.fromEntries(SITE_COPY_FIELDS.map((field) => [field.id, field.defaults[language]])),
  ])) as SiteCopyContent["translations"],
};

export function mergeSiteCopy(value: unknown): SiteCopyContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteCopyContent;
  const source = value as { translations?: Record<string, Record<string, unknown>> };
  return {
    translations: Object.fromEntries(languages.map((language) => [
      language,
      Object.fromEntries(SITE_COPY_FIELDS.map((field) => {
        const saved = source.translations?.[language]?.[field.id];
        return [field.id, typeof saved === "string" ? saved : field.defaults[language]];
      })),
    ])) as SiteCopyContent["translations"],
  };
}
