"use client";

import { ChevronDown, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languageOptions, type Language } from "@/i18n/messages";
import { useI18n } from "@/i18n/I18nProvider";

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  const current = languageOptions.find((option) => option.code === language)!;

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger
        aria-label={t("language.select")}
        className={`h-7 gap-1 border-0 bg-transparent p-0 text-brand-white shadow-none ring-offset-0 hover:bg-brand-white/10 focus:ring-0 [&>svg]:hidden ${compact ? "w-auto min-w-[104px] max-w-[146px] text-[11px]" : "w-auto min-w-[120px] text-xs"}`}
      >
        <span className="inline-flex min-w-0 items-center gap-1.5">
          {compact ? null : <Languages size={14} aria-hidden="true" />}
          <SelectValue>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Flag code={current.code} />
              <span>{current.name}</span>
            </span>
          </SelectValue>
        </span>
        <ChevronDown size={12} aria-hidden="true" />
      </SelectTrigger>
      <SelectContent align="end" side="bottom" sideOffset={4} collisionPadding={8} className="z-[100] min-w-[178px] font-sans">
        {languageOptions.map((option) => (
          <SelectItem key={option.code} value={option.code} className="cursor-pointer">
            <span className="inline-flex items-center gap-2"><Flag code={option.code} /><span>{option.name}</span></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Flag({ code }: { code: Language }) {
  const common = { width: 20, height: 14, viewBox: "0 0 20 14", className: "shrink-0 rounded-[2px] shadow-sm", "aria-hidden": true as const };

  if (code === "zh") return <svg {...common}><rect width="20" height="14" fill="#DE2910" /><path fill="#FFDE00" d="m4 1 .48 1.45H6l-1.23.9.47 1.46L4 3.91l-1.24.9.47-1.46L2 2.45h1.52z" /></svg>;
  if (code === "de") return <svg {...common}><rect width="20" height="4.67" fill="#000" /><rect y="4.67" width="20" height="4.66" fill="#DD0000" /><rect y="9.33" width="20" height="4.67" fill="#FFCE00" /></svg>;
  if (code === "ar") return <span className="shrink-0 text-base leading-none" aria-hidden="true">🇸🇦</span>;

  return <svg {...common}><rect width="20" height="14" fill="#012169" /><path stroke="#fff" strokeWidth="4" d="m0 0 20 14M20 0 0 14" /><path stroke="#C8102E" strokeWidth="1.4" d="m0 0 20 14M20 0 0 14" /><path stroke="#fff" strokeWidth="5" d="M10 0v14M0 7h20" /><path stroke="#C8102E" strokeWidth="2.7" d="M10 0v14M0 7h20" /></svg>;
}
