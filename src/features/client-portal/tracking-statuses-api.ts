import type { CreateTrackingStatus, TrackingStatus, UpdateTrackingStatus } from "./types";

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

export const getTrackingStatuses = () =>
  requestJson<{ statuses: TrackingStatus[] }>("/api/admin/tracking-statuses").then(({ statuses }) => statuses);

export const createTrackingStatus = (input: CreateTrackingStatus) =>
  requestJson<{ status: TrackingStatus }>("/api/admin/tracking-statuses", {
    method: "POST",
    body: JSON.stringify(input),
  }).then(({ status }) => status);

export const updateTrackingStatus = ({ id, ...input }: UpdateTrackingStatus) =>
  requestJson<{ status: TrackingStatus }>(`/api/admin/tracking-statuses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }).then(({ status }) => status);
