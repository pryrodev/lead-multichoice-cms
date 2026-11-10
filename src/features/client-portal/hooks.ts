import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import { portalKeys } from "./query-keys";
import type { NewClientRequest } from "./types";

export const usePortalUser = () => useQuery({
  queryKey: portalKeys.user,
  queryFn: api.getPortalUser,
  // The session endpoint renews an active cookie near expiry. Refocus also checks
  // after users return from a long-running tab without polling on every dashboard refresh.
  refetchInterval: 12 * 60 * 60 * 1000,
  refetchOnWindowFocus: true,
  retry: false,
});
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
export function useCreateAdminClientRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAdminClientRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: portalKeys.adminRequests }),
        queryClient.invalidateQueries({ queryKey: portalKeys.overview }),
      ]);
    },
  });
}
export const useTrackedClientRequest = (reference: string) => useQuery({
  queryKey: portalKeys.publicTracking.detail(reference),
  queryFn: () => api.getTrackedClientRequest(reference),
  enabled: Boolean(reference),
  refetchInterval: 60_000,
  refetchOnWindowFocus: true,
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
