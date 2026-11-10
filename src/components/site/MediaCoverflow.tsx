"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { mediaStories } from "@/content/media-gallery";
import { useI18n } from "@/i18n/I18nProvider";

const autoplayDelay = 6500;

export function MediaCoverflow() {
  const { language, t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const touchStart = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const move = useCallback((direction: number) => {
    setActiveIndex((index) => (index + direction + mediaStories.length) % mediaStories.length);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setStageWidth(entry.contentRect.width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => move(1), autoplayDelay);
    return () => window.clearInterval(timer);
  }, [move, paused, reduceMotion]);

  const active = mediaStories[activeIndex]!;
  const cardWidth = Math.min(350, Math.max(240, stageWidth * 0.59));
  const duration = reduceMotion ? 0.01 : 0.72;

  return (
    <section className="bg-background py-14 md:py-20" aria-label={t("media.galleryLabel")}>
      <div className="container-site">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3 text-brand-primary">{t("media.collectionLabel")}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{t("media.collectionTitle")}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t("media.collectionIntro")}</p>
          </div>
          <p className="shrink-0 text-sm text-muted-foreground" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} <span className="mx-1 text-brand-primary">/</span> {String(mediaStories.length).padStart(2, "0")}
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative isolate h-[390px] overflow-hidden rounded-md border border-brand-primary/15 bg-brand-primary/[0.04] outline-none sm:h-[460px] md:h-[500px]"
          style={{ perspective: "1400px", touchAction: "pan-y" }}
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          }}
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; setPaused(true); }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const end = event.changedTouches[0]?.clientX;
            if (start !== null && end !== undefined && Math.abs(start - end) > 48) move(start > end ? 1 : -1);
            touchStart.current = null;
            setPaused(false);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={active.image}
              className="absolute inset-0 -z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.22 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.8 }}
              aria-hidden="true"
            >
              <Image src={active.image} alt="" fill sizes="100vw" className="object-cover blur-[2px]" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 -z-10 bg-brand-primary/55" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-primary/5 via-brand-primary/25 to-brand-primary/80" aria-hidden="true" />

          {mediaStories.map((story, index) => {
            const offset = (index - activeIndex + mediaStories.length + Math.floor(mediaStories.length / 2)) % mediaStories.length - Math.floor(mediaStories.length / 2);
            const distance = Math.abs(offset);
            const sideOffset = Math.max(110, Math.min(225, stageWidth * 0.28));
            const x = offset === 0 ? 0 : Math.sign(offset) * sideOffset * (distance === 1 ? 1 : 1.75);
            const rotateY = offset === 0 ? 0 : -Math.sign(offset) * (distance === 1 ? 26 : 40);
            const scale = offset === 0 ? 1 : distance === 1 ? 0.82 : 0.68;
            const opacity = distance > 2 ? 0 : distance === 2 ? 0.5 : 1;

            return (
              <motion.article
                key={story.image}
                className="absolute left-1/2 top-[5%] h-[76%] overflow-hidden rounded-md border border-white/60 bg-brand-primary shadow-[0_18px_55px_rgba(0,0,0,0.28)]"
                style={{
                  width: cardWidth,
                  marginLeft: -cardWidth / 2,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  zIndex: 10 - distance,
                  pointerEvents: distance > 1 ? "none" : "auto",
                }}
                initial={false}
                animate={{
                  transform: `translate3d(${x}px, 0, ${offset === 0 ? 35 : -distance * 100}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                }}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden={distance !== 0}
              >
                <Image src={story.image} alt={story.alt[language]} fill sizes="(max-width: 640px) 80vw, 350px" className="object-cover" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/95 via-brand-primary/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-brand-white sm:p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brass-light">{story.category[language]}</p>
                  <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{story.title[language]}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-white/85">{story.description[language]}</p>
                </div>
              </motion.article>
            );
          })}

          <div className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-2">
            {mediaStories.map((story, index) => (
              <button
                key={story.image}
                type="button"
                aria-label={`${t("media.goToSlide")} ${index + 1}: ${story.title[language]}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary ${index === activeIndex ? "w-8 bg-brass-light" : "w-2.5 bg-brand-white/65 hover:bg-brand-white"}`}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-between px-3 sm:px-5">
            <button type="button" onClick={() => move(-1)} aria-label={t("media.previousSlide")} className="grid size-10 place-items-center rounded-full border border-brand-white/45 bg-brand-primary/75 text-brand-white backdrop-blur-sm transition-colors hover:bg-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label={t("media.nextSlide")} className="grid size-10 place-items-center rounded-full border border-brand-white/45 bg-brand-primary/75 text-brand-white backdrop-blur-sm transition-colors hover:bg-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
