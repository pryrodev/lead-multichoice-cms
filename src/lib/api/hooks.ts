import { queryOptions, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "./service";
import type { AdminSiteCopy, AdminSiteVisuals, CompanySettings, MediaAsset } from "./types";
import type { SiteVisuals } from "@/lib/cms/site-visuals";
import type { SiteCopyContent } from "@/lib/cms/site-copy";

export const kpisQuery = queryOptions({ queryKey: ["kpis"], queryFn: api.getKpis });
export const stagesQuery = queryOptions({ queryKey: ["stages"], queryFn: api.getStages });
export const engagementsQuery = queryOptions({
  queryKey: ["engagements"],
  queryFn: api.getEngagements,
});
export const tendersQuery = queryOptions({ queryKey: ["tenders"], queryFn: api.getTenders });
export const opportunitiesQuery = queryOptions({
  queryKey: ["opportunities"],
  queryFn: api.getOpportunities,
});
export const shipmentsQuery = queryOptions({ queryKey: ["shipments"], queryFn: api.getShipments });
export const activitiesQuery = queryOptions({
  queryKey: ["activities"],
  queryFn: api.getActivities,
});

export const useKpis = () => useSuspenseQuery(kpisQuery).data;
export const useStages = () => useSuspenseQuery(stagesQuery).data;
export const useEngagements = () => useSuspenseQuery(engagementsQuery).data;
export const useTenders = () => useSuspenseQuery(tendersQuery).data;
export const useOpportunities = () => useSuspenseQuery(opportunitiesQuery).data;
export const useShipments = () => useSuspenseQuery(shipmentsQuery).data;
export const useActivities = () => useSuspenseQuery(activitiesQuery).data;

export const mediaAssetsQuery = queryOptions({ queryKey: ["admin", "media"], queryFn: api.getMediaAssets });
export const useMediaAssets = () => useSuspenseQuery(mediaAssetsQuery).data;
export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ file, altText }: { file: File; altText: string }) => api.uploadMedia(file, altText), onSuccess: (asset) => qc.setQueryData<MediaAsset[]>(mediaAssetsQuery.queryKey, (assets = []) => [asset, ...assets]) });
}
export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteMedia, onSuccess: (_result, id) => qc.setQueryData<MediaAsset[]>(mediaAssetsQuery.queryKey, (assets = []) => assets.filter((asset) => asset.id !== id)) });
}

export const adminHomePageQuery = queryOptions({ queryKey: ["admin", "cms", "page", "home"], queryFn: api.getAdminHomePage });
export const useAdminHomePage = () => useSuspenseQuery(adminHomePageQuery).data;
export function useSaveHomePageDraft() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.saveHomePageDraft, onSuccess: (saved) => qc.setQueryData(adminHomePageQuery.queryKey, (current: Awaited<ReturnType<typeof api.getAdminHomePage>> | undefined) => ({ content: saved.content, hasDraft: saved.hasDraft, publishedAt: current?.publishedAt ?? null, updatedAt: new Date().toISOString() })) });
}
export function usePublishHomePage() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.publishHomePage, onSuccess: (published) => {
    qc.setQueryData(adminHomePageQuery.queryKey, (current: Awaited<ReturnType<typeof api.getAdminHomePage>> | undefined) => current ? { ...current, hasDraft: false, publishedAt: published.publishedAt } : current);
  } });
}

export const siteVisualsQuery = queryOptions({ queryKey: ["admin", "cms", "site-visuals"], queryFn: api.getSiteVisuals });
export const useSiteVisualsDraft = () => useSuspenseQuery(siteVisualsQuery).data;
export function useSaveSiteVisualsDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: SiteVisuals) => api.saveSiteVisualsDraft(content),
    onSuccess: (saved) => qc.setQueryData<AdminSiteVisuals>(siteVisualsQuery.queryKey, (current) => ({
      content: saved.content,
      hasDraft: saved.hasDraft,
      publishedAt: current?.publishedAt ?? null,
      updatedAt: new Date().toISOString(),
    })),
  });
}
export function usePublishSiteVisuals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.publishSiteVisuals,
    onSuccess: (published) => qc.setQueryData<AdminSiteVisuals>(siteVisualsQuery.queryKey, (current) => current ? {
      ...current,
      hasDraft: false,
      publishedAt: published.publishedAt,
    } : current),
  });
}

export const siteCopyQuery = queryOptions({ queryKey: ["admin", "cms", "site-copy"], queryFn: api.getSiteCopy });
export const useSiteCopyDraft = () => useSuspenseQuery(siteCopyQuery).data;
export function useSaveSiteCopyDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: SiteCopyContent) => api.saveSiteCopyDraft(content),
    onSuccess: (saved) => qc.setQueryData<AdminSiteCopy>(siteCopyQuery.queryKey, (current) => ({
      content: saved.content,
      hasDraft: saved.hasDraft,
      publishedAt: current?.publishedAt ?? null,
      updatedAt: new Date().toISOString(),
    })),
  });
}
export function usePublishSiteCopy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.publishSiteCopy,
    onSuccess: (published) => qc.setQueryData<AdminSiteCopy>(siteCopyQuery.queryKey, (current) => current ? {
      ...current,
      hasDraft: false,
      publishedAt: published.publishedAt,
    } : current),
  });
}

export function useAddActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addActivity,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createOpportunity,
    onSuccess: () => qc.invalidateQueries({ queryKey: opportunitiesQuery.queryKey }),
  });
}

export function useCreateTender() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createTender, onSuccess: () => {
    qc.invalidateQueries({ queryKey: tendersQuery.queryKey });
    qc.invalidateQueries({ queryKey: kpisQuery.queryKey });
  } });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createShipment, onSuccess: () => {
    qc.invalidateQueries({ queryKey: shipmentsQuery.queryKey });
    qc.invalidateQueries({ queryKey: kpisQuery.queryKey });
  } });
}

export const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: api.getProfile });
export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: api.getSettings });
export const companySettingsQuery = queryOptions({ queryKey: ["company-settings"], queryFn: api.getCompanySettings });
export const useProfile = () => useSuspenseQuery(profileQuery).data;
export const useSettings = () => useSuspenseQuery(settingsQuery).data;

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["kpis"] });
    },
  });
}
export const useCompanySettings = () => useQuery(companySettingsQuery);
export function useUpdateCompanySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateCompanySettings,
    onSuccess: (settings: CompanySettings) => qc.setQueryData(companySettingsQuery.queryKey, settings),
  });
}
