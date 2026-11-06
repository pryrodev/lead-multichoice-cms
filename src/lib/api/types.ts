export type StageKey = "connect" | "introductions" | "bidding" | "procurement" | "delivery";
export type TenderStatus =
  "monitoring" | "preparing" | "submitted" | "awarded" | "lost" | "cancelled";
export type Priority = "low" | "medium" | "high";

export type OpportunityType =
  | "public_tender"
  | "institutional_procurement"
  | "direct_buyer_requirement"
  | "supplier_led"
  | "other";
export type OpportunityStatus =
  | "new"
  | "under_assessment"
  | "qualified"
  | "pursuing"
  | "monitoring"
  | "awaiting_information"
  | "preparing_submission"
  | "submitted"
  | "under_evaluation"
  | "awarded"
  | "not_awarded"
  | "withdrawn"
  | "closed";

export interface Opportunity {
  id: string;
  ref: string;
  title: string;
  type: OpportunityType;
  buyer: string;
  source: string;
  sourceUrl: string;
  externalRef: string;
  country: string;
  sector: string;
  description: string;
  requirements: string;
  publishedAt: string;
  deadline: string;
  estimatedValue: number | null;
  potentialSupplier: string;
  owner: string;
  priority: Priority;
  status: OpportunityStatus;
  nextAction: string;
  nextActionDue: string;
  closureReason: string;
  createdAt: string;
}

export interface Stage {
  key: StageKey;
  label: string;
  description: string;
}

export interface Milestone {
  title: string;
  due: string;
  done: boolean;
}

export interface Engagement {
  id: string;
  ref: string;
  title: string;
  buyer: string;
  supplier: string;
  owner: string;
  stage: StageKey;
  valueUsd: number;
  priority: Priority;
  needsAttention: boolean;
  nextAction: string;
  milestones: Milestone[];
}

export interface Tender {
  id: string;
  ref: string;
  title: string;
  entity: string;
  category: string;
  portal: string;
  portalUrl: string;
  deadline: string;
  valueUsd: number;
  status: TenderStatus;
  owner: string;
  notes: string;
}

export interface ShipmentMilestone {
  label: string;
  date: string | null;
  done: boolean;
}

export interface Shipment {
  id: string;
  ref: string;
  cargo: string;
  corridor: string;
  origin: string;
  destination: string;
  progress: number;
  eta: string;
  clearance: "pending" | "in_review" | "cleared" | "held";
  milestones: ShipmentMilestone[];
}

export type ActivityKind = "update" | "blocker" | "next_action" | "decision";

export interface Activity {
  id: string;
  at: string;
  kind: ActivityKind;
  ref: string;
  author: string;
  message: string;
}

export interface Kpis {
  activeTenders: number;
  pipelineUsd: number;
  usdToRwf: number;
  pendingClearances: number;
  attentionItems: number;
}

export interface Profile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface CompanySettings {
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  legalAddress: string;
  websiteUrl: string;
}

export interface Settings {
  usdToRwf: number;
  deadlineWarningDays: number;
  emailAlerts: boolean;
  blockerAlerts: boolean;
  weeklyDigest: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  organization: string;
  canManageEngagements: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  publicId: string;
  secureUrl: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  altText: string;
  createdAt: string;
}

export interface AdminHomePage {
  content: import("@/lib/cms/homepage").HomePageContent;
  hasDraft: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface AdminSiteVisuals {
  content: import("@/lib/cms/site-visuals").SiteVisuals;
  hasDraft: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface AdminSiteCopy {
  content: import("@/lib/cms/site-copy").SiteCopyContent;
  hasDraft: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
}
