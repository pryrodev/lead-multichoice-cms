import type { Activity, Engagement, Shipment, Stage, Tender } from "./types";

export const USD_TO_RWF = 1420;

export const stages: Stage[] = [
  { key: "connect", label: "Connect & Identification", description: "Market intelligence and opportunity sourcing" },
  { key: "introductions", label: "Supplier–Buyer Introductions", description: "Matching manufacturers with purchasers" },
  { key: "bidding", label: "Tender Bidding", description: "Bid preparation and submission" },
  { key: "procurement", label: "Procurement & Logistics", description: "PO follow-up, transit and customs" },
  { key: "delivery", label: "Delivery & After-sales", description: "Acceptance, warranty and support" },
];

export const engagements: Engagement[] = [
  {
    id: "e1", ref: "LMC-ENG-2026-014", title: "Solar water pumps for district irrigation",
    buyer: "Rwanda Agriculture Board", supplier: "Lorentz GmbH", owner: "Aline Uwase",
    stage: "bidding", valueUsd: 420000, priority: "high", needsAttention: true,
    nextAction: "Obtain manufacturer authorization letter",
    milestones: [
      { title: "Tender documents reviewed", due: "2026-10-20", done: true },
      { title: "Manufacturer authorization", due: "2026-11-02", done: false },
      { title: "Bid submission on Umucyo", due: "2026-11-10", done: false },
    ],
  },
  {
    id: "e2", ref: "LMC-ENG-2026-011", title: "Laboratory equipment – University of Rwanda",
    buyer: "University of Rwanda", supplier: "Thermo Fisher (EA Distributor)", owner: "Eric Mugisha",
    stage: "procurement", valueUsd: 186500, priority: "medium", needsAttention: false,
    nextAction: "Confirm Mombasa vessel arrival",
    milestones: [
      { title: "Contract signed", due: "2026-09-12", done: true },
      { title: "Goods shipped", due: "2026-10-05", done: true },
      { title: "Customs clearance", due: "2026-11-06", done: false },
    ],
  },
  {
    id: "e3", ref: "LMC-ENG-2026-018", title: "Medical imaging units supply",
    buyer: "Rwanda Medical Supply Ltd", supplier: "Siemens Healthineers", owner: "Grace Ingabire",
    stage: "introductions", valueUsd: 910000, priority: "high", needsAttention: true,
    nextAction: "Schedule buyer–supplier technical call",
    milestones: [
      { title: "NDA signed", due: "2026-10-18", done: true },
      { title: "Technical presentation", due: "2026-10-31", done: false },
    ],
  },
  {
    id: "e4", ref: "LMC-ENG-2026-007", title: "ICT networking equipment – RISA",
    buyer: "RISA", supplier: "Cisco Authorized Partner", owner: "Eric Mugisha",
    stage: "delivery", valueUsd: 254000, priority: "low", needsAttention: false,
    nextAction: "Collect goods acceptance certificate",
    milestones: [
      { title: "Delivery to Kigali", due: "2026-10-15", done: true },
      { title: "Installation", due: "2026-10-25", done: true },
      { title: "Acceptance certificate", due: "2026-11-01", done: false },
    ],
  },
  {
    id: "e5", ref: "LMC-ENG-2026-020", title: "Road construction machinery leads",
    buyer: "RTDA (prospective)", supplier: "TBD", owner: "Aline Uwase",
    stage: "connect", valueUsd: 1250000, priority: "medium", needsAttention: false,
    nextAction: "Validate procurement plan publication",
    milestones: [{ title: "Market scan", due: "2026-11-15", done: false }],
  },
  {
    id: "e6", ref: "LMC-ENG-2026-016", title: "Water treatment chemicals – WASAC",
    buyer: "WASAC Group", supplier: "Kemira Oyj", owner: "Grace Ingabire",
    stage: "bidding", valueUsd: 312000, priority: "high", needsAttention: true,
    nextAction: "Bid security from bank pending",
    milestones: [
      { title: "Pre-bid meeting", due: "2026-10-22", done: true },
      { title: "Bid security issued", due: "2026-10-30", done: false },
      { title: "Submission", due: "2026-11-04", done: false },
    ],
  },
];

export const tenders: Tender[] = [
  { id: "t1", ref: "RAB/2026/NCB/045", title: "Supply of solar water pumping systems", entity: "Rwanda Agriculture Board", category: "Goods", portal: "Umucyo e-Procurement", portalUrl: "https://www.umucyo.gov.rw", deadline: "2026-11-10", valueUsd: 420000, status: "preparing", owner: "Aline Uwase", notes: "Requires manufacturer authorization and 2% bid security." },
  { id: "t2", ref: "WASAC/2026/ICB/012", title: "Water treatment chemicals (framework)", entity: "WASAC Group", category: "Goods", portal: "Umucyo e-Procurement", portalUrl: "https://www.umucyo.gov.rw", deadline: "2026-11-04", valueUsd: 312000, status: "preparing", owner: "Grace Ingabire", notes: "Two-envelope submission. Bid security outstanding." },
  { id: "t3", ref: "UR/2026/OT/221", title: "Laboratory equipment for CST", entity: "University of Rwanda", category: "Goods", portal: "Umucyo e-Procurement", portalUrl: "https://www.umucyo.gov.rw", deadline: "2026-08-14", valueUsd: 186500, status: "awarded", owner: "Eric Mugisha", notes: "Contract signed 12 Sep 2026." },
  { id: "t4", ref: "EAC/PROC/2026/033", title: "Regional conference AV equipment", entity: "East African Community", category: "Goods & Services", portal: "EAC Procurement", portalUrl: "https://www.eac.int/procurement", deadline: "2026-11-21", valueUsd: 98000, status: "monitoring", owner: "Aline Uwase", notes: "Clarification deadline 7 Nov." },
  { id: "t5", ref: "UNGM-RW-2026-778", title: "Cold chain refrigerators", entity: "UNICEF Rwanda", category: "Goods", portal: "UNGM", portalUrl: "https://www.ungm.org", deadline: "2026-10-27", valueUsd: 265000, status: "submitted", owner: "Grace Ingabire", notes: "Submitted on time; evaluation underway." },
  { id: "t6", ref: "RBC/2026/NCB/090", title: "Diagnostic reagents", entity: "Rwanda Biomedical Centre", category: "Goods", portal: "Umucyo e-Procurement", portalUrl: "https://www.umucyo.gov.rw", deadline: "2026-09-30", valueUsd: 140000, status: "lost", owner: "Eric Mugisha", notes: "Lost on price. Debrief requested." },
];

export const shipments: Shipment[] = [
  {
    id: "s1", ref: "SHP-2026-031", cargo: "Lab equipment (14 crates)", corridor: "Northern Corridor",
    origin: "Mombasa", destination: "Kigali", progress: 62, eta: "2026-11-06", clearance: "in_review",
    milestones: [
      { label: "Vessel arrival Mombasa", date: "2026-10-14", done: true },
      { label: "Single Customs Territory entry", date: "2026-10-18", done: true },
      { label: "Malaba/Gatuna border", date: null, done: false },
      { label: "RRA clearance Kigali", date: null, done: false },
    ],
  },
  {
    id: "s2", ref: "SHP-2026-034", cargo: "Water treatment dosing units", corridor: "Central Corridor",
    origin: "Dar es Salaam", destination: "Kigali", progress: 35, eta: "2026-11-18", clearance: "pending",
    milestones: [
      { label: "Vessel arrival Dar es Salaam", date: "2026-10-24", done: true },
      { label: "TRA release", date: null, done: false },
      { label: "Rusumo border", date: null, done: false },
      { label: "RRA clearance Kigali", date: null, done: false },
    ],
  },
  {
    id: "s3", ref: "SHP-2026-027", cargo: "Network switches & racks", corridor: "Air freight",
    origin: "Dubai", destination: "Kigali", progress: 100, eta: "2026-10-12", clearance: "cleared",
    milestones: [
      { label: "Departure DXB", date: "2026-10-09", done: true },
      { label: "Arrival KGL", date: "2026-10-10", done: true },
      { label: "RRA clearance", date: "2026-10-12", done: true },
    ],
  },
];

export const activities: Activity[] = [
  { id: "a1", at: "2026-10-29T08:40:00Z", kind: "blocker", ref: "LMC-ENG-2026-016", author: "Grace Ingabire", message: "Bank has not yet issued bid security; submission at risk for 4 Nov." },
  { id: "a2", at: "2026-10-28T15:10:00Z", kind: "update", ref: "SHP-2026-031", author: "Eric Mugisha", message: "Truck departed Mombasa ICD, tracking via clearing agent." },
  { id: "a3", at: "2026-10-28T10:05:00Z", kind: "next_action", ref: "LMC-ENG-2026-018", author: "Grace Ingabire", message: "Propose 31 Oct for technical presentation with Siemens team." },
  { id: "a4", at: "2026-10-27T17:30:00Z", kind: "decision", ref: "UNGM-RW-2026-778", author: "Management", message: "Approved submission at revised price; bid filed on UNGM." },
  { id: "a5", at: "2026-10-26T09:00:00Z", kind: "blocker", ref: "LMC-ENG-2026-014", author: "Aline Uwase", message: "Manufacturer authorization letter delayed by Lorentz regional office." },
];
