export const portalKeys = {
  user: ["portal", "user"] as const,
  overview: ["portal", "overview"] as const,
  adminRequests: ["admin", "client-requests"] as const,
  conversation: (scope: "client" | "admin", id: string) => ["request-conversation", scope, id] as const,
  trackingStatuses: {
    all: ["admin", "tracking-statuses"] as const,
    byType: (requestType: string) => ["admin", "tracking-statuses", requestType] as const,
  },
  publicTracking: {
    all: ["public", "order-tracking"] as const,
    detail: (orderId: string) => ["public", "order-tracking", orderId] as const,
  },
};
