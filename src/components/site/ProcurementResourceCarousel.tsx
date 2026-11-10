"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { Button } from "@/components/ui/button";
import { ProcurementResourceCard } from "@/components/site/sections";

export function ProcurementResourceCarousel({ resources }: { resources: ProcurementResource[] }) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: resources.length > 2,
  });
  const shouldReduceMotion = useReducedMotion();
  const [canScroll, setCanScroll] = useState(false);
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const touchTimeout = useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScroll(emblaApi.scrollSnapList().length > 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("reInit", updateScrollState);
    emblaApi.on("select", updateScrollState);
    return () => {
      emblaApi.off("reInit", updateScrollState);
      emblaApi.off("select", updateScrollState);
    };
  }, [emblaApi, updateScrollState, resources.length]);

  useEffect(() => {
    if (!emblaApi || shouldReduceMotion || paused || !canScroll) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), 5000);
    return () => window.clearInterval(timer);
  }, [emblaApi, shouldReduceMotion, paused, canScroll]);

  useEffect(() => () => {
    if (touchTimeout.current !== null) window.clearTimeout(touchTimeout.current);
  }, []);

  function pauseOnFocus() {
    setPaused(true);
  }

  function resumeAfterFocus(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
  }

  return (
    <div
      onMouseEnter={() => { setPaused(true); setControlsVisible(true); }}
      onMouseLeave={() => { setPaused(false); setControlsVisible(false); }}
      onTouchStart={() => {
        setPaused(true);
        setControlsVisible(true);
        if (touchTimeout.current !== null) window.clearTimeout(touchTimeout.current);
      }}
      onTouchEnd={() => {
        touchTimeout.current = window.setTimeout(() => {
          setPaused(false);
          setControlsVisible(false);
        }, 5000);
      }}
      onFocusCapture={() => { pauseOnFocus(); setControlsVisible(true); }}
      onBlurCapture={(event) => {
        resumeAfterFocus(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setControlsVisible(false);
      }}
      role="region"
      aria-label="External procurement resources"
      aria-roledescription="carousel"
      className="relative flex min-w-0 items-center pr-11"
    >
      <div
        ref={viewportRef}
        className="min-w-0 flex-1 overflow-hidden"
      >
        <div className="flex touch-pan-y">
          {resources.map((resource) => (
            <div key={resource.id} className="min-w-0 flex-[0_0_100%] pr-4 md:flex-[0_0_50%]">
              <ProcurementResourceCard r={resource} />
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {canScroll && controlsVisible && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 10, y: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-1/2 z-10 flex flex-col gap-2"
          >
            <Button
              type="button"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Show previous resources"
              className="size-9 rounded-full bg-brand-primary p-0 text-brand-white shadow-none hover:bg-brand-primary/90"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Show next resources"
              className="size-9 rounded-full bg-brand-primary p-0 text-brand-white shadow-none hover:bg-brand-primary/90"
            >
              <ChevronRight className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
