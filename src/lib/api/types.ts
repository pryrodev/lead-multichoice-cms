export type StageKey = "connect" | "introductions" | "bidding" | "procurement" | "delivery";
export type TenderStatus = "monitoring" | "preparing" | "submitted" | "awarded" | "lost" | "cancelled";
export type Priority = "low" | "medium" | "high";

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

export interface Settings {
  usdToRwf: number;
  deadlineWarningDays: number;
  emailAlerts: boolean;
  blockerAlerts: boolean;
  weeklyDigest: boolean;
}
