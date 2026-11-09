const port = "/site/hero-port.jpg";
const meeting = "/site/meeting.jpg";
const warehouse = "/site/warehouse.jpg";
const truck = "/site/truck.jpg";
const electrical = "/site/electrical.jpg";
const healthcare = "/site/healthcare.jpg";
const it = "/site/it-equipment.jpg";

export const services = [
  {
    id: "market-access",
    title: "Market Access & Trade Facilitation",
    summary:
      "Identify relevant opportunities and purchasing entities, facilitate introductions and provide local representation.",
    image: meeting,
    alt: "Business professionals reviewing procurement documents in a Kigali meeting room",
    items: [
      "Market intelligence and opportunity identification.",
      "Tender and procurement opportunity monitoring.",
      "Introductions between international suppliers and local buyers.",
      "Market-entry guidance and local representation.",
    ],
  },
  {
    id: "procurement",
    title: "Procurement & Supply Chain Coordination",
    summary:
      "Identify suppliers and coordinate procurement communication, order follow-up and delivery.",
    image: warehouse,
    alt: "Warehouse operator scanning palletised cartons in a distribution centre",
    items: [
      "Sourcing advisory.",
      "Supplier identification.",
      "Procurement coordination.",
      "Commercial communication and negotiation support.",
    ],
  },
  {
    id: "logistics",
    title: "Logistics, Distribution & Trade Compliance Support",
    summary:
      "Coordinate transport, shipment tracking, customs liaison, import documents and delivery follow-up.",
    image: truck,
    alt: "Container truck travelling along a hillside highway in Rwanda",
    note: "Approvals remain with the relevant authorities.",
    items: [
      "Local and regional transportation coordination.",
      "Shipment and transit tracking.",
      "Customs-clearance coordination through appropriate channels.",
      "Import documentation coordination.",
    ],
  },
  {
    id: "projects",
    title: "Project Coordination & Implementation Support",
    summary:
      "Plan, monitor and report on projects so milestones are met.",
    image: electrical,
    alt: "Engineer inspecting electrical switchgear beside a solar installation",
    items: [
      "Project planning and resource coordination.",
      "Budget, milestone and timeline monitoring.",
      "Stakeholder communication.",
      "Delivery and implementation tracking.",
    ],
  },
  {
    id: "after-sales",
    title: "After-Sales & Lifecycle Support",
    summary:
      "Handle warranty, maintenance and post-delivery issues after the sale.",
    image: it,
    alt: "Technician unpacking and setting up IT and network equipment",
    items: [
      "Warranty coordination.",
      "Maintenance and technical support arrangements.",
      "Customer and manufacturer liaison.",
      "Invoice and payment-status follow-up.",
    ],
  },
];

export const industries = [
  {
    id: "healthcare",
    title: "Pharmaceuticals & Healthcare",
    text: "Medical supply chains, sourcing and local requirements.",
    image: healthcare,
    alt: "Gloved hands checking sealed pharmaceutical supply cartons",
    points: ["Supply-chain coordination", "Sourcing advisory", "Supplier engagement", "Local requirement coordination"],
  },
  {
    id: "energy",
    title: "Energy & Electrical Systems",
    text: "Sourcing and delivery of electrical and energy equipment.",
    image: electrical,
    alt: "Engineer reviewing electrical cabinets at a solar site",
    points: ["Equipment sourcing", "Delivery coordination", "Stakeholder engagement", "Logistics support"],
  },
  {
    id: "it",
    title: "General Supplies & IT Equipment",
    text: "Equipment supply, delivery and after-sales support.",
    image: it,
    alt: "Laptops, monitors and network switches being set up in an office",
    points: ["Procurement coordination", "Supply arrangements", "Delivery follow-up", "After-sales coordination"],
  },
  {
    id: "logistics",
    title: "Logistics & Trade",
    text: "Shipment tracking, customs liaison and final delivery.",
    image: port,
    alt: "Shipping containers and cranes at a cargo terminal at sunset",
    points: ["Shipment tracking", "Logistics provider coordination", "Customs-process liaison", "Final delivery follow-up"],
  },
  {
    id: "projects",
    title: "Projects & Systems Implementation",
    text: "Implementation monitoring and stakeholder updates.",
    image: meeting,
    alt: "Project stakeholders reviewing implementation documents",
    points: ["Project coordination", "Implementation monitoring", "Progress updates", "Stakeholder communication"],
  },
];

export const values = [
  { title: "Trustworthiness", text: "We build confidence through transparent engagement, responsible conduct and consistent follow-through." },
  { title: "Integrity", text: "We uphold honesty, ethical practices, fairness and respect for commercial agreements." },
  { title: "Reliability", text: "We strive to deliver timely communication, dependable coordination and consistent operational support." },
  { title: "Professionalism", text: "We approach every engagement with competence, respect, discretion and a commitment to quality." },
  { title: "Accountability", text: "We promote clear responsibilities, accurate reporting and proactive follow-up on agreed commitments." },
  { title: "Partnership", text: "We foster long-term relationships based on mutual respect, shared objectives and sustainable business value." },
];

export const whyUs = [
  { title: "Local Market Expertise", text: "We know Rwanda's market and its buyers." },
  { title: "Trust & Integrity", text: "Ethical representation that protects your reputation." },
  { title: "Reliable Coordination", text: "One local contact for everything." },
  { title: "Regulatory Awareness", text: "We know the local rules and who to talk to." },
  { title: "Stakeholder Relationship Management", text: "Every party aligned and informed." },
  { title: "Accountability & Continuity", text: "We follow through to completion." },
];
