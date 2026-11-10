"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { Button } from "@/components/ui/button";
import { ProcurementResourceCard } from "@/components/site/sections";

export function ProcurementResourceCarousel({ resources }: { resources: ProcurementResource[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScroll(maxScroll > 2);
    setCanGoBack(track.scrollLeft > 2);
    setCanGoForward(maxScroll - track.scrollLeft > 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [resources.length, updateScrollState]);

  function scroll(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div className="min-w-0">
      {canScroll && <div className="mb-3 flex justify-end gap-2">
        <Button type="button" variant="outline" size="icon" onClick={() => scroll(-1)} disabled={!canGoBack} aria-label="Show previous resources"><ChevronLeft className="size-4" /></Button>
        <Button type="button" variant="outline" size="icon" onClick={() => scroll(1)} disabled={!canGoForward} aria-label="Show more resources"><ChevronRight className="size-4" /></Button>
      </div>}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        role="region"
        aria-label="External procurement resources"
        aria-roledescription="carousel"
        className="flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-color:var(--brand-primary)_transparent] [scrollbar-width:thin]"
      >
        {resources.map((resource) => <div key={resource.id} className="w-full min-w-0 shrink-0 snap-start md:w-[calc(50%-0.5rem)]"><ProcurementResourceCard r={resource} /></div>)}
      </div>
    </div>
  );
}
