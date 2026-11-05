"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSiteVisuals } from "./SiteVisualsProvider";

type PhotoScrollSectionProps = HTMLAttributes<HTMLElement> & {
  image: string;
  visualKey?: keyof import("@/lib/cms/site-visuals").SiteVisuals;
  overlayClassName?: string;
  children: ReactNode;
};

/** Keeps a decorative photo fixed behind a section while its content scrolls normally. */
export function PhotoScrollSection({
  image,
  visualKey,
  overlayClassName,
  className,
  children,
  ...props
}: PhotoScrollSectionProps) {
  const visuals = useSiteVisuals();
  const backgroundImage = visualKey ? visuals[visualKey] : image;
  return (
    <section className={cn("photo-parallax relative isolate overflow-hidden", className)} {...props}>
      <div className="photo-parallax-window" aria-hidden="true">
        <img src={backgroundImage} alt="" width={1600} height={1000} className="photo-parallax-image" />
      </div>
      <div
        className={cn("absolute inset-0 -z-10", overlayClassName)}
        aria-hidden="true"
      />
      {children}
    </section>
  );
}
