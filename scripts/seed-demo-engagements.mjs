import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.ts";

for (const envFile of [".env.local", ".env"]) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^("|')(.*)\1$/, "$2");
  }
}

if (process.env.NODE_ENV === "production") {
  console.error("Demo engagement seeding is disabled in production.");
  process.exit(1);
}
const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaMariaDb({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD ?? "",
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 1,
}) });
const stableId = (key) => createHash("sha256").update(`lmc-demo-${key}`).digest("hex").slice(0, 32);
const refSuffix = (key) => createHash("sha256").update(`lmc-demo-ref-${key}`).digest("hex").slice(0, 24).toUpperCase();

// Demo status catalogs mirror the different journeys clients may track.
const statusFlows = {
  buying: [
    ["request_review", "Request review", "Confirm the buyer's requirements, quantities, and target market."],
    ["supplier_search", "Supplier search", "Identify credible manufacturers and authorised distributors."],
    ["buyer_introductions", "Buyer and supplier introductions", "Coordinate discussions between the purchasing entity and selected suppliers."],
    ["procurement_coordination", "Procurement coordination", "Support the agreed procurement process and follow-up."],
    ["delivery_acceptance", "Delivery accepted", "The buyer has confirmed receipt and acceptance.", true],
  ],
  selling: [
    ["profile_review", "Supplier profile review", "Review the supplier profile, product range, and authorization documents."],
    ["market_assessment", "Market assessment", "Assess local demand and relevant purchasing opportunities."],
    ["buyer_introductions", "Purchasing entity introductions", "Coordinate introductions to relevant local and regional purchasing entities."],
    ["commercial_followup", "Commercial follow-up", "Support communication while parties discuss their commercial terms."],
    ["engagement_closed", "Engagement completed", "The agreed supplier engagement support is complete.", true],
  ],
  sourcing: [
    ["requirements_confirmed", "Requirements confirmed", "Confirm specifications, quantities, delivery expectations, and market."],
    ["supplier_identification", "Supplier identification", "Identify potential manufacturers and authorised distributors."],
    ["offers_review", "Supplier offers under review", "Review supplier information and compare offers against the requirements."],
    ["buyer_supplier_connection", "Buyer and supplier connected", "Coordinate direct discussions between the buyer and selected supplier."],
    ["sourcing_complete", "Sourcing completed", "The sourcing request has reached its agreed outcome.", true],
  ],
  bidding: [
    ["tender_review", "Tender reviewed", "Review tender requirements, eligibility, and submission deadlines."],
    ["bid_preparation", "Bid preparation", "Coordinate the required documents and supplier inputs."],
    ["submission_ready", "Submission ready", "The bid package is prepared for submission by the responsible party."],
    ["bid_submitted", "Bid submitted", "The responsible party has confirmed submission of the bid."],
    ["tender_closed", "Tender support completed", "The agreed tender coordination has been completed.", true],
  ],
  shipping: [
    ["supply_confirmed", "Supply confirmed", "Confirm the goods, supplier, and destination details."],
    ["dispatch_preparation", "Dispatch preparation", "Coordinate documents, dispatch readiness, and estimated timing."],
    ["in_transit", "In transit", "The shipment is moving toward its destination."],
    ["local_handling", "In-country handling", "Coordinate local handling, clearance follow-up, and delivery arrangements."],
    ["delivery_accepted", "Delivery accepted", "The recipient has confirmed delivery acceptance.", true],
  ],
  market_access: [
    ["market_scope", "Market scope agreed", "Confirm products, target sectors, and geographic scope."],
    ["market_assessment", "Market assessment", "Review the business environment and relevant opportunities."],
    ["stakeholder_mapping", "Stakeholders identified", "Map relevant public and private purchasing stakeholders."],
    ["local_representation", "Local engagement underway", "Coordinate local representation and business introductions."],
    ["market_access_complete", "Market access engagement completed", "The agreed market access support has been completed.", true],
  ],
  partnership: [
    ["objectives_recorded", "Partnership objectives recorded", "Capture the partnership goals, sectors, and intended markets."],
    ["partner_review", "Potential partners under review", "Review potential local or international partners for alignment."],
    ["introductions", "Partner introductions underway", "Coordinate introductions and initial discussions."],
    ["terms_discussion", "Commercial discussions underway", "The parties are discussing their proposed commercial relationship."],
    ["partnership_complete", "Partnership support completed", "The agreed partnership facilitation is complete.", true],
  ],
  other: [
    ["request_review", "Request reviewed", "Review the request and confirm the agreed scope of support."],
    ["coordination_underway", "Coordination underway", "Coordinate the relevant parties and next actions."],
    ["delivery_followup", "Delivery and follow-up", "Follow up on delivery, acceptance, and any agreed support."],
    ["engagement_closed", "Engagement completed", "The agreed support has been completed.", true],
  ],
};

const samples = [
  { key: "buying", type: "buying", title: "Solar water pumps for district irrigation", category: "Agricultural equipment", market: "Rwanda", stage: "introductions", client: "Demo Buyer | Kigali District Cooperative", updates: [["request_review", "Requirements confirmed", "We reviewed the irrigation requirements and confirmed the target quantities."], ["supplier_search", "Supplier search underway", "We are identifying qualified manufacturers and preparing supplier options."]] },
  { key: "selling", type: "selling", title: "Represent a regional medical equipment supplier", category: "Medical equipment", market: "Rwanda and East Africa", stage: "connect", client: "Demo Supplier | MedEquip International", updates: [["profile_review", "Supplier profile received", "The product range and authorization documents have been received for initial review."], ["market_assessment", "Market assessment underway", "We are assessing relevant local purchasing needs and market fit."]] },
  { key: "sourcing", type: "sourcing", title: "Source cold-chain refrigeration units", category: "Cold-chain equipment", market: "Rwanda", stage: "bidding", client: "Demo Client | Health Supply Network", updates: [["requirements_confirmed", "Requirements confirmed", "Capacity, energy requirements, and delivery expectations are confirmed."], ["offers_review", "Technical offers being compared", "We are reviewing supplier specifications against the requested requirements."]] },
  { key: "bidding", type: "bidding", title: "Tender support for laboratory supplies", category: "Laboratory supplies", market: "Rwanda", stage: "bidding", client: "Demo Bidder | East Africa Diagnostics", updates: [["tender_review", "Tender opportunity reviewed", "The tender requirements and submission timetable have been recorded."], ["bid_preparation", "Bid documents in preparation", "The response package is being assembled with the supplier and purchasing entity."]] },
  { key: "shipping", type: "shipping", title: "Coordinate delivery of water treatment chemicals", category: "Water treatment", market: "Kigali, Rwanda", stage: "procurement", client: "Demo Client | Rwanda Water Services", updates: [["supply_confirmed", "Purchase confirmed", "The requested supply has been confirmed with the selected supplier."], ["in_transit", "Dispatch underway", "Transport documents are checked and delivery timing is being coordinated."]] },
  { key: "market-access", type: "market_access", title: "Market entry assessment for industrial filters", category: "Market access", market: "Rwanda and EAC", stage: "introductions", client: "Demo Supplier | ClearFlow Manufacturing", updates: [["market_scope", "Market scope agreed", "We have agreed the product scope and priority buyer segments."], ["stakeholder_mapping", "Local stakeholders identified", "Relevant public and private sector contacts are being mapped for introductions."]] },
  { key: "partnership", type: "partnership", title: "Explore a local distribution partnership", category: "Distribution partnership", market: "Rwanda", stage: "connect", client: "Demo Partner | Kivu Industrial Group", updates: [["objectives_recorded", "Initial discussion recorded", "The partnership objectives and target sectors have been captured for follow-up."], ["partner_review", "Potential partners under review", "We are identifying suitable local partners for the proposed distribution arrangement."]] },
  { key: "other", type: "other", title: "After-sales support for installed equipment", category: "After-sales support", market: "Rwanda", stage: "delivery", client: "Demo Client | Regional Health Projects", updates: [["delivery_followup", "Delivery completed", "The equipment delivery has been recorded and installation support is complete."], ["engagement_closed", "After-sales follow-up complete", "The client has confirmed operation and that no further support is currently required."]] },
];

try {
  const trackingStatusIds = new Map();
  for (const [requestType, flow] of Object.entries(statusFlows)) {
    for (let index = 0; index < flow.length; index++) {
      const [key, name, description, isTerminal = false] = flow[index];
      const id = stableId(`tracking-status-${requestType}-${key}`);
      await prisma.trackingStatus.upsert({
        where: { requestType_name: { requestType, name } },
        create: { id, requestType, name, description, sortOrder: index, isTerminal },
        update: { description, sortOrder: index, isTerminal, isActive: true },
      });
      trackingStatusIds.set(`${requestType}:${key}`, id);
    }
  }

  for (const sample of samples) {
    const [clientName, organization] = sample.client.split(" | ");
    const requestId = stableId(`request-${sample.key}`);
    const engagementId = stableId(`engagement-${sample.key}`);
    const requestReference = `LMC-REQ-${refSuffix(sample.key)}`;
    const engagementReference = `LMC-ENG-${refSuffix(sample.key)}`;
    const requestData = {
      submittedBy: null,
      clientName,
      organization,
      clientEmail: null,
      clientPhone: null,
      requestType: sample.type,
      title: sample.title,
      category: sample.category,
      targetMarket: sample.market,
      details: `Demo record for the ${sample.type.replaceAll("_", " ")} workflow. Use this example to review how staff record progress and how a client follows it with the Tracking ID.`,
      status: "accepted",
    };
    await prisma.clientRequest.upsert({ where: { reference: requestReference }, create: { id: requestId, reference: requestReference, ...requestData }, update: requestData });
    const engagementData = {
      requestId,
      clientUserId: null,
      title: sample.title,
      stage: sample.stage,
      status: sample.key === "other" ? "completed" : "active",
      owner: "Demo Operations Team",
      buyer: sample.type === "buying" ? organization : "",
      supplier: sample.type === "selling" ? organization : "",
      nextAction: sample.key === "other" ? null : "Review the latest update and coordinate the next step",
    };
    await prisma.engagement.upsert({ where: { reference: engagementReference }, create: { id: engagementId, reference: engagementReference, ...engagementData }, update: engagementData });
    const base = Date.now() - (sample.updates.length * 24 * 60 * 60 * 1000);
    for (let index = 0; index < sample.updates.length; index++) {
      const [statusKey, title, message] = sample.updates[index];
      const trackingStatusId = trackingStatusIds.get(`${sample.type}:${statusKey}`);
      await prisma.engagementUpdate.upsert({
        where: { id: stableId(`update-${sample.key}-${index}`) },
        create: {
          id: stableId(`update-${sample.key}-${index}`), engagementId, authorUserId: null, trackingStatusId,
          visibility: "client", updateType: index === sample.updates.length - 1 && sample.key === "other" ? "milestone" : "progress",
          title, message, createdAt: new Date(base + index * 24 * 60 * 60 * 1000),
        },
        update: { engagementId, trackingStatusId, visibility: "client", title, message },
      });
    }
    console.log(`${sample.type.padEnd(12)} ${requestReference}  ${sample.title}`);
  }
  console.log(`${Object.values(statusFlows).reduce((total, flow) => total + flow.length, 0)} request-specific tracking statuses seeded.`);
  console.log("Seeded 8 demo client requests and engagement timelines with varied progress histories.");
} finally {
  await prisma.$disconnect();
}
