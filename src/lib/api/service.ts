import * as db from "./mock-data";
import type { Profile, CompanySettings, Settings, Activity, ActivityKind, AdminHomePage, Engagement, Kpis, MediaAsset, Opportunity, Shipment, Stage, Tender, StaffMember } from "./types";
import type { HomePageContent } from "@/lib/cms/homepage";
import type { SiteVisuals } from "@/lib/cms/site-visuals";
import type { SiteCopyContent } from "@/lib/cms/site-copy";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "same-origin",
  });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "The request could not be completed.");
  return body;
}

async function requestForm<T>(url: string, body: FormData): Promise<T> {
  const response = await fetch(url, { method: "POST", body, credentials: "same-origin" });
  const result = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(result.error ?? "The upload could not be completed.");
  return result;
}

export const api = {
  getStages: (): Promise<Stage[]> => Promise.resolve(db.stages),
  getEngagements: (): Promise<Engagement[]> => requestJson("/api/admin/engagements"),
  getTenders: (): Promise<Tender[]> => requestJson("/api/admin/tenders"),
  createTender: (input: Omit<Tender, "id" | "ref">): Promise<Tender> =>
    requestJson("/api/admin/tenders", { method: "POST", body: JSON.stringify(input) }),
  getOpportunities: (): Promise<Opportunity[]> => requestJson("/api/opportunities"),
  createOpportunity: async (input: Omit<Opportunity, "id" | "ref" | "createdAt">): Promise<Opportunity> =>
    requestJson("/api/opportunities", { method: "POST", body: JSON.stringify(input) }),
  getShipments: (): Promise<Shipment[]> => requestJson("/api/admin/shipments"),
  createShipment: (input: Omit<Shipment, "id" | "ref">): Promise<Shipment> =>
    requestJson("/api/admin/shipments", { method: "POST", body: JSON.stringify(input) }),
  getActivities: (): Promise<Activity[]> => requestJson("/api/admin/activities"),
  getKpis: (): Promise<Kpis> => requestJson("/api/admin/kpis"),
  getProfile: (): Promise<Profile> => requestJson("/api/admin/profile"),
  updateProfile: (profile: Profile): Promise<Profile> =>
    requestJson("/api/admin/profile", { method: "PUT", body: JSON.stringify(profile) }),
  getSettings: (): Promise<Settings> => requestJson("/api/admin/settings"),
  updateSettings: (settings: Settings): Promise<Settings> =>
    requestJson("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) }),
  getCompanySettings: (): Promise<CompanySettings> => requestJson("/api/admin/company"),
  updateCompanySettings: (settings: CompanySettings): Promise<CompanySettings> =>
    requestJson("/api/admin/company", { method: "PUT", body: JSON.stringify(settings) }),
  getStaffMembers: async (): Promise<StaffMember[]> => (await requestJson<{ members: StaffMember[] }>("/api/admin/team")).members,
  createStaff: async (input: { name: string; email: string; organization: string; password: string }): Promise<StaffMember> =>
    (await requestJson<{ member: StaffMember }>("/api/admin/team", { method: "POST", body: JSON.stringify(input) })).member,
  updateStaff: async (input: { id: string; canManageEngagements: boolean }): Promise<StaffMember> =>
    (await requestJson<{ member: StaffMember }>(`/api/admin/team/${encodeURIComponent(input.id)}`, { method: "PATCH", body: JSON.stringify({ canManageEngagements: input.canManageEngagements }) })).member,
  addActivity: (input: { kind: ActivityKind; ref: string; message: string }): Promise<Activity> =>
    requestJson("/api/admin/activities", { method: "POST", body: JSON.stringify(input) }),
  getMediaAssets: (): Promise<MediaAsset[]> => requestJson("/api/admin/media"),
  uploadMedia: (file: File, altText: string): Promise<MediaAsset> => {
    const form = new FormData(); form.set("file", file); form.set("altText", altText);
    return requestForm("/api/admin/media", form);
  },
  deleteMedia: (id: string): Promise<{ deleted: boolean }> =>
    requestJson(`/api/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" }),
  getAdminHomePage: (): Promise<AdminHomePage> => requestJson("/api/admin/cms/pages/home"),
  saveHomePageDraft: (content: HomePageContent): Promise<Pick<AdminHomePage, "content" | "hasDraft">> =>
    requestJson("/api/admin/cms/pages/home", { method: "PUT", body: JSON.stringify(content) }),
  publishHomePage: (): Promise<{ published: boolean; publishedAt: string }> =>
    requestJson("/api/admin/cms/pages/home/publish", { method: "POST" }),
  getSiteVisuals: (): Promise<import("./types").AdminSiteVisuals> => requestJson("/api/admin/cms/site-visuals"),
  saveSiteVisualsDraft: (content: SiteVisuals): Promise<Pick<import("./types").AdminSiteVisuals, "content" | "hasDraft">> =>
    requestJson("/api/admin/cms/site-visuals", { method: "PUT", body: JSON.stringify(content) }),
  publishSiteVisuals: (): Promise<{ published: boolean; publishedAt: string }> =>
    requestJson("/api/admin/cms/site-visuals/publish", { method: "POST" }),
  getSiteCopy: (): Promise<import("./types").AdminSiteCopy> => requestJson("/api/admin/cms/site-copy"),
  saveSiteCopyDraft: (content: SiteCopyContent): Promise<Pick<import("./types").AdminSiteCopy, "content" | "hasDraft">> =>
    requestJson("/api/admin/cms/site-copy", { method: "PUT", body: JSON.stringify(content) }),
  publishSiteCopy: (): Promise<{ published: boolean; publishedAt: string }> =>
    requestJson("/api/admin/cms/site-copy/publish", { method: "POST" }),
};
