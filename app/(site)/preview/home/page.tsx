"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Home from "@/components/site/pages/index";
import type { HomePageContent } from "@/lib/cms/homepage";

const PREVIEW_STORAGE_KEY = "lead-multichoice-homepage-preview";

export default function HomepageDraftPreview() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (stored) setContent(JSON.parse(stored) as HomePageContent);
    } catch {
      setContent(null);
    }
  }, []);

  return <>
    <div className="container-site py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium"><Eye className="size-4 text-primary" /> Homepage draft preview · visible only in this browser</p>
        <Button asChild variant="outline" size="sm"><Link href="/admin/content/home"><ArrowLeft data-icon="inline-start" /> Back to editor</Link></Button>
      </div>
    </div>
    {content ? <Home contentOverride={content} /> : <div className="container-site py-12 text-center"><h1 className="text-2xl font-semibold">No draft preview found</h1><p className="mt-2 text-muted-foreground">Open Preview draft from the homepage editor.</p></div>}
  </>;
}
