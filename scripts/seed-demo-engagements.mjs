import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.ts";

for (const envFile of [".env.local", ".env"]) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, "$2");
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

const samples = [
  { key: "buying", type: "buying", title: "Solar water pumps for district irrigation", category: "Agricultural equipment", market: "Rwanda", stage: "introductions", client: "Demo Buyer · Kigali District Cooperative", updates: [["Request reviewed", "We reviewed the irrigation requirements and confirmed the target quantities."], ["Supplier introductions underway", "We are identifying qualified manufacturers and preparing introductions."]] },
  { key: "selling", type: "selling", title: "Represent a regional medical equipment supplier", category: "Medical equipment", market: "Rwanda and East Africa", stage: "connect", client: "Demo Supplier · MedEquip International", updates: [["Supplier profile received", "The product range and authorization documents have been received for initial review."]] },
  { key: "sourcing", type: "sourcing", title: "Source cold-chain refrigeration units", category: "Cold-chain equipment", market: "Rwanda", stage: "bidding", client: "Demo Client · Health Supply Network", updates: [["Requirements confirmed", "Capacity, energy requirements, and delivery expectations are confirmed."], ["Technical offers being compared", "We are reviewing supplier specifications against the requested requirements."]] },
  { key: "bidding", type: "bidding", title: "Tender support for laboratory supplies", category: "Laboratory supplies", market: "Rwanda", stage: "bidding", client: "Demo Bidder · East Africa Diagnostics", updates: [["Tender opportunity identified", "The tender requirements and submission timetable have been recorded."], ["Bid documents in preparation", "The response package is being assembled with the supplier and purchasing entity."]] },
  { key: "shipping", type: "shipping", title: "Coordinate delivery of water treatment chemicals", category: "Water treatment", market: "Kigali, Rwanda", stage: "procurement", client: "Demo Client · Rwanda Water Services", updates: [["Purchase confirmed", "The requested supply has been confirmed with the selected supplier."], ["Dispatch coordination", "Transport documents are being checked and delivery timing coordinated."]] },
  { key: "market-access", type: "market_access", title: "Market entry assessment for industrial filters", category: "Market access", market: "Rwanda and EAC", stage: "introductions", client: "Demo Supplier · ClearFlow Manufacturing", updates: [["Market scope agreed", "We have agreed the product scope and priority buyer segments."], ["Local introductions planned", "Relevant public and private sector contacts are being mapped for introductions."]] },
  { key: "partnership", type: "partnership", title: "Explore a local distribution partnership", category: "Distribution partnership", market: "Rwanda", stage: "connect", client: "Demo Partner · Kivu Industrial Group", updates: [["Initial discussion recorded", "The partnership objectives and target sectors have been captured for follow-up."]] },
  { key: "other", type: "other", title: "After-sales support for installed equipment", category: "After-sales support", market: "Rwanda", stage: "delivery", client: "Demo Client · Regional Health Projects", updates: [["Delivery completed", "The equipment delivery has been recorded and installation support is complete."], ["After-sales follow-up", "The client has been contacted to confirm operation and remaining support needs."]] },
];

try {
  for (const sample of samples) {
    const [clientName, organization] = sample.client.split(" · ");
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
      const [title, message] = sample.updates[index];
      await prisma.engagementUpdate.upsert({
        where: { id: stableId(`update-${sample.key}-${index}`) },
        create: {
          id: stableId(`update-${sample.key}-${index}`), engagementId, authorUserId: null,
          visibility: "client", updateType: index === sample.updates.length - 1 && sample.key === "other" ? "milestone" : "progress",
          title, message, createdAt: new Date(base + index * 24 * 60 * 60 * 1000),
        },
        update: { engagementId, visibility: "client", title, message },
      });
    }
    console.log(`${sample.type.padEnd(12)} ${requestReference}  ${sample.title}`);
  }
  console.log("Seeded 8 demo client requests and engagement timelines.");
} finally {
  await prisma.$disconnect();
}
