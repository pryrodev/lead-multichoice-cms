import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import { portalKeys } from "./query-keys";
import type { NewClientRequest } from "./types";

export const usePortalUser = () => useQuery({ queryKey: portalKeys.user, queryFn: api.getPortalUser });
export const useClientOverview = () => useQuery({
  queryKey: portalKeys.overview,
  queryFn: api.getClientOverview,
  refetchInterval: 60_000,
  refetchOnWindowFocus: true,
});
export const useAdminClientRequests = () => useQuery({
  queryKey: portalKeys.adminRequests,
  queryFn: api.getAdminRequests,
  refetchInterval: 60_000,
  refetchOnWindowFocus: true,
});
export function useTrackClientRequest() {
  return useMutation({ mutationFn: api.trackClientRequest });
}
export const useTrackedClientRequest = (reference: string) => useQuery({
  queryKey: ["public", "request-tracking", reference],
  queryFn: () => api.getTrackedClientRequest(reference),
  enabled: Boolean(reference),
  retry: false,
});

export function useCreateClientRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewClientRequest) => api.createClientRequest(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portalKeys.overview }),
  });
}

export function usePortalLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.login,
    onSuccess: ({ user }) => queryClient.setQueryData(portalKeys.user, { user }),
  });
}

export function usePortalRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.register,
    onSuccess: ({ user }) => queryClient.setQueryData(portalKeys.user, { user }),
  });
}

export function usePortalLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => queryClient.clear(),
  });
}

export function useCreateEngagement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, ...input }: Parameters<typeof api.createEngagement>[1] & { requestId: string }) => api.createEngagement(requestId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portalKeys.adminRequests }),
  });
}

export function usePostEngagementUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ engagementId, ...input }: Parameters<typeof api.postEngagementUpdate>[1] & { engagementId: string }) => api.postEngagementUpdate(engagementId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portalKeys.adminRequests }),
  });
}
