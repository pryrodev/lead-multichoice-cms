import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "./service";

export const kpisQuery = queryOptions({ queryKey: ["kpis"], queryFn: api.getKpis });
export const stagesQuery = queryOptions({ queryKey: ["stages"], queryFn: api.getStages });
export const engagementsQuery = queryOptions({ queryKey: ["engagements"], queryFn: api.getEngagements });
export const tendersQuery = queryOptions({ queryKey: ["tenders"], queryFn: api.getTenders });
export const shipmentsQuery = queryOptions({ queryKey: ["shipments"], queryFn: api.getShipments });
export const activitiesQuery = queryOptions({ queryKey: ["activities"], queryFn: api.getActivities });

export const useKpis = () => useSuspenseQuery(kpisQuery).data;
export const useStages = () => useSuspenseQuery(stagesQuery).data;
export const useEngagements = () => useSuspenseQuery(engagementsQuery).data;
export const useTenders = () => useSuspenseQuery(tendersQuery).data;
export const useShipments = () => useSuspenseQuery(shipmentsQuery).data;
export const useActivities = () => useSuspenseQuery(activitiesQuery).data;

export function useAddActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addActivity,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: api.getProfile });
export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: api.getSettings });
export const useProfile = () => useSuspenseQuery(profileQuery).data;
export const useSettings = () => useSuspenseQuery(settingsQuery).data;

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateProfile, onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }) });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); qc.invalidateQueries({ queryKey: ["kpis"] }); },
  });
}
