// Central company content. Update verified details here.
export const company = {
  name: "LEAD MULTI-CHOICE ® Ltd",
  shortName: "LEAD MULTI-CHOICE ®",
  tagline: "Your Local Partner. Your Regional Advantage.",
  location: "Remera, Kigali, Rwanda",
  phoneDisplay: "+250 788 312 338",
  phoneTel: "+250788312338",
  whatsapp: "https://wa.me/250788312338",
  founded: 2015,
  // Add when confirmed by the company:
  email: null as string | null,
};

export const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/market-access-investment", label: "Market Access & Investment" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/why-us", label: "Why Choose Us" },
  { to: "/leadership", label: "Leadership" },
  { to: "/procurement-opportunities", label: "Procurement Opportunities" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export const headerNavigation = [
  { type: "link", to: "/" },
  { type: "group", label: "nav.companyGroup", links: ["/about", "/why-us", "/leadership"] },
  { type: "group", label: "nav.solutionsGroup", links: ["/services", "/industries"] },
  { type: "group", label: "nav.opportunitiesGroup", links: ["/market-access-investment", "/procurement-opportunities"] },
  { type: "group", label: "nav.publicationsGroup", links: ["/blog"] },
] as const;

export const procurementResources = [
  {
    id: "rms",
    name: "Rwanda Medical Supply",
    description:
      "Medical and healthcare supply tenders.",
    cta: "Visit RMS Tenders",
    url: "https://rms.rw/TenderPage",
    domain: "rms.rw",
  },
  {
    id: "umucyo",
    name: "UMUCYO e-Procurement",
    description:
      "Rwanda's official government tenders portal.",
    cta: "Visit UMUCYO Portal",
    url: "https://umucyo.gov.rw/",
    domain: "umucyo.gov.rw",
  },
];

export const procurementModels = [
  {
    id: "hardware-supply",
    name: "Hardware Supply",
    description: "Sourcing and supply of equipment and goods to defined specifications.",
  },
  {
    id: "framework-contracts",
    name: "Framework contracts",
    description: "Supply under agreed terms and call-off requirements.",
  },
  {
    id: "epc-turnkey-contracts",
    name: "EPC turnkey contracts",
    description: "Engineering, procurement and construction coordinated through project handover.",
  },
  {
    id: "consultancy-urgency",
    name: "Consultancy / urgency",
    description: "Professional advice and support for urgent procurement needs.",
  },
] as const;

export const processStages = [
  { n: "01", title: "Connect", text: "Find buyers and opportunities." },
  { n: "02", title: "Facilitate", text: "Make introductions and open talks." },
  { n: "03", title: "Coordinate", text: "Align documents, logistics and delivery." },
  { n: "04", title: "Monitor", text: "Track milestones and open issues." },
  { n: "05", title: "Sustain", text: "Support after-sales and repeat business." },
];

export const enquiryTypes = [
  "Market Access & Business Representation",
  "Procurement & Tender Opportunities",
  "Supplier Partnerships",
  "Logistics & Supply Chain",
  "Project Coordination",
  "General Enquiry",
];

export const leader = {
  name: "Mr Ernest Mulisa",
  title: "Managing Director",
  bio: [
    "18+ years in trade facilitation, procurement, supply chain, logistics and digital transformation.",
    "Former roles at Bralirwa PLC and Ericsson (Rwanda, Uganda, Kenya), and supply chain lead for the Shisha Kibondo programme with Rwanda's Ministry of Health and RBC.",
    "Now Enterprise Digitalisation Manager at Cenfri. MSc Procurement & Supply Chain Management, MCILT and CIPS member.",
  ],
  tags: [
    "Trade facilitation",
    "Procurement",
    "Supply chain management",
    "Logistics & customs",
    "Strategic sourcing",
    "Regional trade",
    "Stakeholder engagement",
    "Digital transformation",
  ],
  credentials: ["MSc Procurement & Supply Chain Management", "MCILT", "CIPS member"],
};
