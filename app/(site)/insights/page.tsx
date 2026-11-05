"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { insights } from "@/content/insights";
import { useI18n } from "@/i18n/I18nProvider";

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const isArticleSlug = insights.en.some((article) => article.slug === slug);
    router.replace(isArticleSlug ? `/blog/${encodeURIComponent(slug)}` : "/blog");
  }, [router]);

  return (
    <div className="container-site py-16" role="status" aria-live="polite">
      {t("nav.blog")}
    </div>
  );
}
