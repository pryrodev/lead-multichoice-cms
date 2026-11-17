import { industries as defaultSectors } from "@/content/services";

export type IndustrySector = {
  id: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  points: string[];
};

export type IndustriesContent = {
  heroTitle: string;
  heroIntro: string;
  sectors: IndustrySector[];
};

export const defaultIndustriesContent: IndustriesContent = {
  heroTitle: "Sector knowledge. Coordinated execution.",
  heroIntro: "We coordinate, source and represent — across five sectors.",
  sectors: defaultSectors.map((sector) => ({ ...sector, points: [...sector.points] })),
};

export function mergeIndustriesContent(value: unknown): IndustriesContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultIndustriesContent;
  const source = value as Record<string, unknown>;
  const sectors = Array.isArray(source["sectors"]) ? source["sectors"] : defaultIndustriesContent.sectors;
  const validSectors = sectors.filter((item): item is IndustrySector => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const sector = item as Record<string, unknown>;
    return ["id", "title", "text", "image", "alt"].every((key) => typeof sector[key] === "string") &&
      Array.isArray(sector["points"]) && sector["points"].every((point) => typeof point === "string");
  });
  return {
    heroTitle: typeof source["heroTitle"] === "string" ? source["heroTitle"] : defaultIndustriesContent.heroTitle,
    heroIntro: typeof source["heroIntro"] === "string" ? source["heroIntro"] : defaultIndustriesContent.heroIntro,
    sectors: validSectors,
  };
}
