import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTrackingStatus, getTrackingStatuses, updateTrackingStatus } from "./tracking-statuses-api";
import { portalKeys } from "./query-keys";

export const useTrackingStatuses = () => useQuery({
  queryKey: portalKeys.trackingStatuses.all,
  queryFn: getTrackingStatuses,
  staleTime: 30_000,
});

export function useCreateTrackingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrackingStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portalKeys.trackingStatuses.all }),
  });
}

export function useUpdateTrackingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTrackingStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portalKeys.trackingStatuses.all }),
  });
}
