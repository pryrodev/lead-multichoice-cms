import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const previewViews = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "market-access-investment", label: "Market access" },
  { id: "services", label: "Services" },
  { id: "industries", label: "Industries" },
  { id: "why-us", label: "Why us" },
  { id: "leadership", label: "Leadership" },
  { id: "procurement-opportunities", label: "Procurement" },
  { id: "blog", label: "Blog" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
  { id: "track", label: "Tracking" },
] as const;

export const draftPreviewViews = previewViews;

export function DraftPreviewToolbar({
  section,
  view,
  editorHref,
}: {
  section: string;
  view: string;
  editorHref: string;
}) {
  return (
    <div className="relative z-[70] border-b border-brand-white/15 bg-brand-primary text-brand-white">
      <div className="container-site flex min-h-12 flex-wrap items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Eye className="size-4 text-brand-gold" aria-hidden="true" />
          <span>Draft preview</span>
          <span className="hidden text-brand-white/70 sm:inline">Not published</span>
          <EyeOff className="ml-1 size-3.5 text-brand-white/60" aria-hidden="true" />
        </div>
        <Button asChild variant="outline" size="sm" className="border-brand-white/30 bg-transparent text-brand-white hover:bg-brand-white/10 hover:text-brand-white">
          <Link href={editorHref}><ArrowLeft data-icon="inline-start" />Back to editor</Link>
        </Button>
      </div>
      <nav aria-label="Preview page" className="border-t border-brand-white/15">
        <div className="container-site flex gap-1 overflow-x-auto py-2 [scrollbar-width:thin]">
          {previewViews.map((item) => (
            <Link
              key={item.id}
              href={`/cms-preview/${section}?view=${item.id}`}
              aria-current={view === item.id ? "page" : undefined}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium transition-colors ${view === item.id ? "bg-brand-gold text-charcoal" : "text-brand-white/80 hover:bg-brand-white/10 hover:text-brand-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
