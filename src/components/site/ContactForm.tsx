"use client";

import { useState } from "react";
import { z } from "zod";
import { company, enquiryTypes } from "@/content/site";
import { btn } from "./ui";
import { useI18n } from "@/i18n/I18nProvider";
import type { MessageKey } from "@/i18n/messages";

const enquiryTypeKeys: Record<(typeof enquiryTypes)[number], MessageKey> = {
  "Market Access & Business Representation": "contact.type.market",
  "Procurement & Tender Opportunities": "contact.type.procurement",
  "Supplier Partnerships": "contact.type.supplier",
  "Logistics & Supply Chain": "contact.type.logistics",
  "Project Coordination": "contact.type.project",
  "General Enquiry": "contact.type.general",
};

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  company: z.string().trim().max(150).optional(),
  email: z.string().trim().email("Please enter a valid business email.").max(255),
  phone: z.string().trim().max(30).optional(),
  type: z.string().refine((v) => enquiryTypes.includes(v), "Please select an enquiry type."),
  subject: z.string().trim().min(3, "Please enter a subject.").max(150),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters.").max(3000),
});
type Values = z.infer<typeof enquirySchema>;
type Errors = Partial<Record<keyof Values, string>>;

export function buildWhatsAppMessage(v: Values) {
  const lines = [
    `Business enquiry: ${v.subject}`,
    `Type: ${v.type}`,
    `Name: ${v.name}`,
    v.company && `Organization: ${v.company}`,
    `Email: ${v.email}`,
    v.phone && `Telephone: ${v.phone}`,
    "",
    v.message,
  ].filter((l): l is string => typeof l === "string");
  return `${company.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

const field =
  "mt-1.5 block w-full rounded border border-input bg-background px-3 py-2 text-[15px] text-charcoal focus:border-corporate focus:outline-none focus:ring-2 focus:ring-corporate/20 aria-[invalid=true]:border-destructive";

export function ContactForm() {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof Values;
        const messageKey: Partial<Record<keyof Values, MessageKey>> = {
          name: "contact.error.name",
          email: "contact.error.email",
          type: "contact.error.type",
          subject: "contact.error.subject",
          message: "contact.error.message",
        };
        errs[field] ??= messageKey[field] ? t(messageKey[field]!) : issue.message;
      }
      setErrors(errs);
      const first = Object.keys(errs)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    const win = window.open(buildWhatsAppMessage(parsed.data), "_blank");
    if (win) win.opener = null;
    setStatus(win === null ? "idle" : "done");
    if (win === null) setErrors({ message: t("contact.error.popup") });
  }

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1.5 text-[13.5px] text-destructive">
        {errors[k]}
      </p>
    ) : null;
  const a = (k: keyof Values) => ({
    name: k,
    id: k,
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  return (
    <form
      id="business-enquiry"
      onSubmit={onSubmit}
      noValidate
      className="rounded border border-border bg-background p-5 md:p-7"
    >
      <h2 className="text-[24px]">{t("contact.businessEnquiry")}</h2>
      <p className="mt-2 rounded bg-surface p-3 text-[13px] text-charcoal">
        {t("contact.whatsappNotice")} {company.phoneDisplay}.
      </p>
      <div className="mt-6 grid gap-x-5 gap-y-4 md:grid-cols-2">
        <label className="text-[14px] font-semibold text-brand-primary">
          {t("contact.fullName")} *
          <input
            {...a("name")}
            autoComplete="name"
            placeholder={t("contact.namePlaceholder")}
            className={field}
          />
          {err("name")}
        </label>
        <label className="text-[14px] font-semibold text-brand-primary">
          {t("contact.company")}
          <input
            {...a("company")}
            autoComplete="organization"
            placeholder={t("contact.companyPlaceholder")}
            className={field}
          />
        </label>
        <label className="text-[14px] font-semibold text-brand-primary">
          {t("contact.email")} *
          <input
            {...a("email")}
            type="email"
            autoComplete="email"
            placeholder={t("contact.emailPlaceholder")}
            className={field}
          />
          {err("email")}
        </label>
        <label className="text-[14px] font-semibold text-brand-primary">
          {t("contact.phone")}
          <input
            {...a("phone")}
            type="tel"
            autoComplete="tel"
            placeholder={t("contact.phonePlaceholder")}
            className={field}
          />
        </label>
        <label className="text-[14px] font-semibold text-brand-primary md:col-span-2">
          {t("contact.enquiryType")} *
          <select {...a("type")} defaultValue="" className={field}>
            <option value="" disabled>
              {t("contact.selectEnquiryType")}
            </option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {t(enquiryTypeKeys[type] ?? "contact.type.general")}
              </option>
            ))}
          </select>
          {err("type")}
        </label>
        <label className="text-[14px] font-semibold text-brand-primary md:col-span-2">
          {t("contact.subject")} *
          <input
            {...a("subject")}
            placeholder={t("contact.subjectPlaceholder")}
            className={field}
          />
          {err("subject")}
        </label>
        <label className="text-[14px] font-semibold text-brand-primary md:col-span-2">
          {t("contact.message")} *
          <textarea
            {...a("message")}
            rows={4}
            placeholder={t("contact.messagePlaceholder")}
            className={field}
          />
          {err("message")}
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className={btn("primary")}>
          {status === "sending" ? t("contact.preparing") : t("contact.send")}
        </button>
        <p className="text-[13px] text-muted-foreground">{t("contact.requiredNote")}</p>
      </div>
      {status === "done" && (
        <p role="status" className="mt-4 border-l-2 border-brass pl-4 text-[14px] text-charcoal">
          {t("contact.success")}
        </p>
      )}
    </form>
  );
}
