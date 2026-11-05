"use client";

import { useLayoutEffect, useRef } from "react";
import { processStages } from "@/content/site";
import { useI18n } from "@/i18n/I18nProvider";

const details = [
  { when: "Week 1", tag: "Market scan" },
  { when: "Week 2–4", tag: "Buyer meetings" },
  { when: "Order", tag: "Docs · Customs · Freight" },
  { when: "Delivery", tag: "Milestone reports" },
  { when: "Ongoing", tag: "After-sales · Reorders" },
];

// Pinned, scroll-driven storyline of how we work (horizontal on desktop, vertical on mobile).
export function ProcessStoryline() {
  const { t, tc } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          const track = section.querySelector<HTMLElement>("[data-track]");
          if (!track) return;
          const distance = () => track.scrollWidth - window.innerWidth + 80;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance() + 600}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          tl.to(track, { x: () => -distance(), duration: 1 }, 0);
          tl.fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
          gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el, i, all) => {
            const at = (i / all.length) * 0.9;
            tl.fromTo(
              el.querySelector("[data-dot]"),
              { scale: 0.4, backgroundColor: "var(--brand-primary)" },
              { scale: 1, backgroundColor: "var(--brass-light)", duration: 0.06 },
              at,
            );
            tl.fromTo(
              el.querySelectorAll("[data-rise]"),
              { y: 40, opacity: 0.15 },
              { y: 0, opacity: 1, stagger: 0.02, duration: 0.12 },
              at,
            );
          });
          // Animate only a DOM attribute: changing innerText replaces React's text node.
          const counter = section.querySelector<HTMLElement>("[data-counter]");
          const progress = { stage: 1 };
          tl.to(
            progress,
            {
              stage: processStages.length,
              duration: 1,
              onUpdate: () => {
                if (counter) counter.dataset["count"] = String(Math.round(progress.stage));
              },
            },
            0,
          );
        });
        mm.add("(max-width: 1023px)", () => {
          gsap.fromTo(
            "[data-vline]",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-track]",
                start: "top 70%",
                end: "bottom 60%",
                scrub: true,
              },
            },
          );
          gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el) => {
            gsap.from(el.querySelectorAll("[data-rise]"), {
              y: 30,
              opacity: 0,
              stagger: 0.08,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            });
          });
        });
      }, section);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-no-reveal
      className="relative overflow-hidden bg-brand-primary text-background lg:flex lg:h-screen lg:flex-col lg:justify-center"
    >
      <div className="container-site flex flex-wrap items-end justify-between gap-6 pt-12 lg:pt-0">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 flex items-center gap-3 text-brass-light">
            <span className="h-px w-8 bg-current" aria-hidden />
            {t("process.howWeWork")}
          </p>
          <h2 className="text-[30px] text-background md:text-[42px]">
            {tc("From first contact to repeat business.")}
          </h2>
        </div>
        <p className="hidden font-display text-[14px] tabular-nums text-background/60 lg:block">
          Stage{" "}
          <span
            data-counter
            data-count="1"
            className="storyline-counter text-brass-light"
            aria-hidden
          />{" "}
          / {processStages.length}
        </p>
      </div>

      <div className="relative mt-10 pb-12 lg:mt-12 lg:pb-0">
        <div
          data-track
          className="container-site relative lg:flex lg:w-max lg:max-w-none lg:gap-0 lg:pr-[40vw]"
        >
          {/* desktop line */}
          <span
            className="absolute left-0 right-0 top-[19px] hidden h-px bg-background/15 lg:block"
            aria-hidden
          />
          <span
            data-line
            className="absolute left-0 right-0 top-[19px] hidden h-px origin-left bg-brass-light lg:block"
            aria-hidden
          />
          {/* mobile line */}
          <span
            className="absolute bottom-0 left-[39px] top-0 w-px bg-background/15 md:left-[51px] lg:hidden"
            aria-hidden
          />
          <span
            data-vline
            className="absolute bottom-0 left-[39px] top-0 w-px origin-top bg-brass-light md:left-[51px] lg:hidden"
            aria-hidden
          />
          <ol className="relative grid gap-10 lg:flex lg:gap-0">
            {processStages.map((s, i) => (
              <li
                key={s.n}
                data-stage
                className="relative flex gap-6 lg:block lg:w-[380px] lg:pr-12"
              >
                <span
                  data-dot
                  className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brass-light bg-brand-primary font-display text-[13px] font-bold tabular-nums text-brass-light"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                </span>
                <div className="lg:mt-10">
                  <p
                    data-rise
                    className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-brass-light"
                  >
                    {tc(details[i]?.when ?? "")}
                  </p>
                  <h3
                    data-rise
                    className="mt-2 flex items-baseline gap-3 text-[26px] text-background lg:text-[34px]"
                  >
                    <span className="font-display text-[15px] text-background/40">{s.n}</span>
                    {tc(s.title)}
                  </h3>
                  <p data-rise className="mt-3 max-w-[300px] text-[15.5px] text-background/70">
                    {tc(s.text)}
                  </p>
                  <p
                    data-rise
                    className="mt-5 inline-block rounded-full border border-background/20 px-3 py-1 text-[12.5px] text-background/70"
                  >
                    {tc(details[i]?.tag ?? "")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
