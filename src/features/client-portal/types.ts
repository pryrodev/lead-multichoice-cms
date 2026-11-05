export type ClientRequestStatus = "submitted" | "in_review" | "accepted" | "declined";
export type EngagementStage = "connect" | "introductions" | "bidding" | "procurement" | "delivery";

export interface ClientRequest {
  id: string;
  reference: string;
  requestType: "buyer_request" | "supplier_offer" | "partnership";
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
  role: "buyer" | "supplier" | "admin";
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
  status: ClientRequestStatus;
  createdAt: string;
  updatedAt: string;
  engagement: {
    reference: string;
    stage: EngagementStage;
    status: "active" | "on_hold" | "completed" | "cancelled";
    milestones: { title: string; dueDate: string | null; isComplete: boolean }[];
    updates: { title: string; message: string; createdAt: string }[];
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
  clientId: string;
  clientName: string;
  clientEmail: string;
  organization: string;
  clientRole: "buyer" | "supplier";
}
