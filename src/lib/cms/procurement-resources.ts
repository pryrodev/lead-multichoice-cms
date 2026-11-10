import { procurementResources as defaults } from "@/content/site";

export interface ProcurementResource {
  id: string;
  name: string;
  description: string;
  cta: string;
  url: string;
}

export interface ProcurementResourcesContent {
  resources: ProcurementResource[];
}

export const defaultProcurementResources: ProcurementResourcesContent = {
  resources: defaults.map(({ id, name, description, cta, url }) => ({ id, name, description, cta, url })),
};

export function mergeProcurementResources(value: unknown): ProcurementResourcesContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultProcurementResources;
  const resources = (value as { resources?: unknown }).resources;
  if (!Array.isArray(resources)) return defaultProcurementResources;
  const valid = resources.filter((item): item is ProcurementResource => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return ["id", "name", "description", "cta", "url"].every((key) => typeof row[key] === "string");
  });
  return { resources: valid };
}

export function getResourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
