"use client";

import { ChevronDown, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <SelectContent
        align="end"
        side="bottom"
        sideOffset={4}
        collisionPadding={8}
        className="z-[100] min-w-[178px] font-sans"
      >
        {languageOptions.map((option) => (
          <SelectItem key={option.code} value={option.code} className="cursor-pointer">
            <span className="inline-flex items-center gap-2">
              <Flag code={option.code} />
              <span>{option.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Flag({ code }: { code: Language }) {
  const common = {
    width: 20,
    height: 14,
    viewBox: "0 0 20 14",
    className: "shrink-0 rounded-[2px] shadow-sm",
    "aria-hidden": true as const,
  };
  if (code === "fr")
    return (
      <svg {...common}>
        <rect width="20" height="14" fill="#fff" />
        <path fill="#0055A4" d="M0 0h6.67v14H0z" />
        <path fill="#EF4135" d="M13.33 0H20v14h-6.67z" />
      </svg>
    );
  if (code === "rw")
    return (
      <svg {...common}>
        <rect width="20" height="14" fill="#20603D" />
        <path fill="#FAD201" d="M0 5h20v5H0z" />
        <path fill="#00A1DE" d="M0 0h20v5H0z" />
        <circle cx="15.3" cy="2.5" r="1.15" fill="#E5BE01" />
        <path
          fill="#E5BE01"
          d="m15.3.6.25 1.25 1.2-.44-.96.84 1.12.65-1.3-.17-.31 1.26-.3-1.26-1.31.17 1.12-.65-.96-.84 1.2.44z"
        />
      </svg>
    );
  if (code === "sw")
    return (
      <svg {...common}>
        <rect width="20" height="14" fill="#1EB53A" />
        <path fill="#00A3DD" d="M0 10.5V14h20V3.5z" />
        <path stroke="#FCD116" strokeWidth="3.4" d="M-1 14 21 0" />
        <path stroke="#000" strokeWidth="2" d="M-1 14 21 0" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect width="20" height="14" fill="#012169" />
      <path stroke="#fff" strokeWidth="4" d="m0 0 20 14M20 0 0 14" />
      <path stroke="#C8102E" strokeWidth="1.4" d="m0 0 20 14M20 0 0 14" />
      <path stroke="#fff" strokeWidth="5" d="M10 0v14M0 7h20" />
      <path stroke="#C8102E" strokeWidth="2.7" d="M10 0v14M0 7h20" />
    </svg>
  );
}
