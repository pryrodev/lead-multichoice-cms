import type { AdminClientRequest, ClientOverview, CreateAdminClientRequest, NewClientRequest, PortalUser, PublicRequestTracking } from "./types";

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

export const getPortalUser = () => requestJson<{ user: PortalUser | null }>("/api/auth/me");
export const getClientOverview = () => requestJson<ClientOverview>("/api/client/overview");
export const createClientRequest = (input: NewClientRequest) =>
  requestJson<{ id: string; reference: string; status: string }>("/api/client/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
export const getTrackedClientRequest = (reference: string) =>
  requestJson<PublicRequestTracking>(`/api/public/track?reference=${encodeURIComponent(reference)}`);
export const login = (input: { email: string; password: string }) =>
  requestJson<{ user: PortalUser }>("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
export const register = (input: { name: string; email: string; organization: string; phone: string; role: "buyer" | "supplier"; password: string }) =>
  requestJson<{ user: PortalUser }>("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
export const logout = () => requestJson<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
export const getAdminRequests = async () => (await requestJson<{ requests: AdminClientRequest[] }>("/api/admin/requests")).requests;
export const createAdminClientRequest = (input: CreateAdminClientRequest) =>
  requestJson<{ id: string; reference: string; engagementId: string }>("/api/admin/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
export const createEngagement = (requestId: string, input: { stage: string; trackingStatusId: string; nextAction: string; updateTitle: string; updateMessage: string }) =>
  requestJson<{ id: string; reference: string }>(`/api/admin/requests/${requestId}/engagement`, { method: "POST", body: JSON.stringify(input) });
export const postEngagementUpdate = (engagementId: string, input: { title: string; message: string; type: string; stage?: string; trackingStatusId: string; nextAction?: string }) =>
  requestJson<{ ok: boolean }>(`/api/admin/engagements/${engagementId}/updates`, { method: "POST", body: JSON.stringify(input) });
