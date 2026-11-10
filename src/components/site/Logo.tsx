"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  const { t } = useI18n();
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={`${t("nav.home")} — LEAD MULTI-CHOICE ®`}
    >
      <img
        src="/lead_multi-choice_logo.png"
        alt="LEAD MULTI-CHOICE ®"
        width={512}
        height={191}
        className={cn(
          "w-auto object-contain object-left",
          inverted ? "h-12 md:h-14" : "h-10 md:h-11",
        )}
      />
    </Link>
  );
}
