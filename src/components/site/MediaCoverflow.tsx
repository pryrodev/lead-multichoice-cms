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
  const [activeIndex, setActiveIndex] = useState(1);
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
  const isMobile = stageWidth > 0 && stageWidth < 640;
  const isTablet = stageWidth >= 640 && stageWidth < 1024;

  const cardWidth =
    stageWidth === 0
      ? 360
      : isMobile
        ? Math.min(300, Math.max(250, stageWidth * 0.78))
        : isTablet
          ? 330
          : 370;

  const cardHeight = isMobile ? 410 : isTablet ? 460 : 500;

  const sideOffset = isMobile
    ? Math.max(90, Math.min(160, stageWidth * 0.28))
    : isTablet
      ? Math.max(170, Math.min(240, stageWidth * 0.26))
      : Math.min(290, Math.max(220, (stageWidth || 1200) * 0.22));

  const duration = reduceMotion ? 0.01 : 0.72;

  return (
    <section
      className="relative isolate flex min-h-[calc(100vh-6.5rem)] w-full flex-col justify-center overflow-hidden bg-[#0091D7] py-8 sm:py-10 md:py-14"
      aria-label={t("media.galleryLabel")}
    >
      {/* Full-bleed ambient blurred background from active slide */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.image}
          className="pointer-events-none absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.8 }}
          aria-hidden="true"
        >
          <Image
            src={active.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[3px]"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric blue tint overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[#0091D7]/75 backdrop-blur-[1px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0081c2]/30 via-transparent to-[#0074b0]/40"
        aria-hidden="true"
      />

      {/* 3D Coverflow stage */}
      <div
        ref={stageRef}
        className="relative isolate mx-auto flex h-[480px] w-full max-w-[1440px] items-center justify-center overflow-hidden outline-none sm:h-[530px] md:h-[570px]"
        style={{ perspective: "1400px", touchAction: "pan-y" }}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
          setPaused(true);
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const end = event.changedTouches[0]?.clientX;
          if (start !== null && end !== undefined && Math.abs(start - end) > 48) {
            move(start > end ? 1 : -1);
          }
          touchStart.current = null;
          setPaused(false);
        }}
      >
        {mediaStories.map((story, index) => {
          const offset =
            ((index - activeIndex + mediaStories.length + Math.floor(mediaStories.length / 2)) %
              mediaStories.length) -
            Math.floor(mediaStories.length / 2);
          const distance = Math.abs(offset);
          const x = offset === 0 ? 0 : Math.sign(offset) * sideOffset * (distance === 1 ? 1 : 1.75);
          const rotateY = offset === 0 ? 0 : -Math.sign(offset) * (distance === 1 ? 26 : 38);
          const scale = offset === 0 ? 1 : distance === 1 ? 0.85 : 0.72;
          const opacity = distance > 2 ? 0 : distance === 2 ? 0.55 : 0.96;

          return (
            <motion.article
              key={story.image}
              className="absolute overflow-hidden rounded-2xl border border-white/25 bg-[#0091D7] shadow-[0_22px_60px_rgba(0,0,0,0.32)]"
              style={{
                width: cardWidth,
                height: cardHeight,
                left: "50%",
                top: "50%",
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                zIndex: 10 - distance,
                pointerEvents: distance > 1 ? "none" : "auto",
                cursor: distance === 1 ? "pointer" : "default",
              }}
              onClick={() => {
                if (distance === 1) move(offset);
              }}
              initial={false}
              animate={{
                x,
                z: offset === 0 ? 35 : -distance * 95,
                rotateY,
                scale,
                opacity,
              }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={distance !== 0}
            >
              <Image
                src={story.image}
                alt={story.alt[language] ?? story.alt["en"] ?? ""}
                fill
                sizes="(max-width: 640px) 80vw, 380px"
                className="object-cover"
                priority
                loading="eager"
              />

              {/* Atmospheric side tint so center card pops */}
              <div
                className="pointer-events-none absolute inset-0 bg-[#0091D7]/20 transition-opacity duration-300"
                style={{ opacity: distance > 0 ? 0.35 : 0 }}
                aria-hidden="true"
              />

              {/* Bottom text gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Card textual content */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F7B616]">
                  {story.category[language] ?? story.category["en"] ?? ""}
                </p>
                <h3 className="text-xl font-bold leading-snug sm:text-2xl">
                  {story.title[language] ?? story.title["en"] ?? ""}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/85 sm:text-sm">
                  {story.description[language] ?? story.description["en"] ?? ""}
                </p>
              </div>
            </motion.article>
          );
        })}

        {/* Left / Right Navigation Buttons (aligned with cards) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-between px-3 sm:px-6 md:px-10">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={t("media.previousSlide")}
            className="pointer-events-auto grid size-10 place-items-center rounded-full border border-white/40 bg-[#0091D7] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0081c2] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:size-11 md:size-12"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={t("media.nextSlide")}
            className="pointer-events-auto grid size-10 place-items-center rounded-full border border-white/40 bg-[#0091D7] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0081c2] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:size-11 md:size-12"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Pagination indicators (dots + active elongated gold pill) */}
      <div className="relative z-30 mt-6 flex items-center justify-center gap-2 sm:mt-8">
        {mediaStories.map((story, index) => (
          <button
            key={story.image}
            type="button"
                aria-label={`${t("media.goToSlide")} ${index + 1}: ${story.title[language] ?? story.title["en"] ?? ""}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0091D7] ${
              index === activeIndex
                ? "h-2.5 w-8 bg-[#F7B616] sm:w-9"
                : "size-2.5 bg-white/75 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
