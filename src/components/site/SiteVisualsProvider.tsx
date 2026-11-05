"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultSiteVisuals, type SiteVisuals } from "@/lib/cms/site-visuals";

const SiteVisualsContext = createContext<SiteVisuals>(defaultSiteVisuals);

export function SiteVisualsProvider({
  value,
  children,
}: {
  value: SiteVisuals;
  children: ReactNode;
}) {
  return <SiteVisualsContext.Provider value={value}>{children}</SiteVisualsContext.Provider>;
}

export function useSiteVisuals() {
  return useContext(SiteVisualsContext);
}
