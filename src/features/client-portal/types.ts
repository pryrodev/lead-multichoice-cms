export type ClientRequestStatus = "submitted" | "in_review" | "accepted" | "declined";
export type EngagementStage = "connect" | "introductions" | "bidding" | "procurement" | "delivery";
export type ClientRequestType = "buyer_request" | "supplier_offer" | "partnership" | "buying" | "selling" | "sourcing" | "bidding" | "shipping" | "market_access" | "other";

export interface TrackingStatus {
  id: string;
  requestType: ClientRequestType;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  isTerminal: boolean;
}

export interface ClientRequest {
  id: string;
  reference: string;
  requestType: ClientRequestType;
  title: string;
  category: string;
  targetMarket: string;
  details: string;
  status: ClientRequestStatus;
  createdAt: string;
  engagementId: string | null;
  engagementReference: string | null;
  engagementStage: EngagementStage | null;
  engagementStatus: "active" | "on_hold" | "completed" | "cancelled" | null;
  nextAction: string | null;
  nextActionDue: string | null;
}

export interface EngagementUpdate {
  id: string;
  engagementId: string;
  type: "progress" | "milestone" | "document" | "decision" | "blocker";
  title: string;
  message: string;
  createdAt: string;
  authorName: string | null;
}

export interface ClientMilestone {
  id: string;
  engagementId: string;
  title: string;
  dueDate: string | null;
  isComplete: 0 | 1 | boolean;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: "buyer" | "supplier" | "admin" | "staff";
  canManageEngagements: boolean;
}

export interface ClientOverview {
  user: PortalUser;
  requests: ClientRequest[];
  updates: EngagementUpdate[];
  milestones: ClientMilestone[];
}

export interface PublicRequestTracking {
  reference: string;
  title: string;
  requestType: ClientRequestType;
  status: ClientRequestStatus;
  createdAt: string;
  updatedAt: string;
  engagement: {
    stage: EngagementStage;
    status: "active" | "on_hold" | "completed" | "cancelled";
    currentTrackingStatusId: string | null;
    trackingStatuses: TrackingStatus[];
    milestones: { title: string; dueDate: string | null; isComplete: boolean }[];
    updates: { title: string; message: string; createdAt: string; trackingStatus: Pick<TrackingStatus, "id" | "name" | "description" | "sortOrder"> | null }[];
  } | null;
}

export interface NewClientRequest {
  requestType: ClientRequest["requestType"];
  title: string;
  category: string;
  targetMarket: string;
  details: string;
}

export interface AdminClientRequest extends Omit<ClientRequest, "nextActionDue" | "nextAction"> {
  currentTrackingStatusId: string | null;
  currentTrackingStatusName: string | null;
  clientId: string | null;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  organization: string;
  clientRole: "buyer" | "supplier" | "admin" | "external";
}

export interface CreateAdminClientRequest {
  clientName: string;
  organization: string;
  clientEmail: string;
  clientPhone: string;
  requestType: ClientRequestType;
  title: string;
  category: string;
  targetMarket: string;
  details: string;
  stage: EngagementStage;
  trackingStatusId: string;
  nextAction: string;
  updateTitle: string;
  updateMessage: string;
}

export type CreateTrackingStatus = Pick<TrackingStatus, "requestType" | "name" | "description" | "isTerminal">;
export type UpdateTrackingStatus = Pick<TrackingStatus, "id"> & Partial<Pick<TrackingStatus, "name" | "description" | "sortOrder" | "isActive" | "isTerminal">>;
