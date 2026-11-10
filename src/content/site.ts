// Central company content. Update verified details here.
export const company = {
  name: "Lead Multi-Choice ® ",
  shortName: "Lead Multi-Choice ®",
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
  { to: "/media", label: "Media" },
  { to: "/contact", label: "Contact" },
] as const;

export const headerNavigation = [
  { type: "link", to: "/" },
  { type: "group", label: "nav.companyGroup", links: ["/about", "/why-us", "/leadership"] },
  { type: "group", label: "nav.solutionsGroup", links: ["/services", "/industries"] },
  { type: "group", label: "nav.opportunitiesGroup", links: ["/market-access-investment", "/procurement-opportunities"] },
  { type: "group", label: "nav.publicationsGroup", links: ["/blog", "/media"] },
] as const;

export const procurementResources = [
  {
    id: "job-in-rwanda-socio-economic-analysis",
    name: "Participant Initial Socio-Economic Analysis",
    description: "Terms of reference for hiring a consultancy firm to conduct a participant initial socio-economic analysis.",
    cta: "View opportunity",
    url: "https://www.jobinrwanda.com/job/terms-reference-hiring-consultancy-firm-conduct-participant-initial-socio-economic-analysis",
  },
  {
    id: "job-in-rwanda-hospital-design",
    name: "Hospital Design and Environmental Assessment",
    description: "Expression of interest for consultancy services covering hospital design, costing and environmental assessment.",
    cta: "View opportunity",
    url: "https://www.jobinrwanda.com/job/expression-interest-consultancy-services-hospital-design-costing-environmental-assessment",
  },
  {
    id: "job-in-rwanda-enterprise-development-training",
    name: "Enterprise Development Training Framework",
    description: "Tender for a two-year non-exclusive framework agreement for enterprise development training.",
    cta: "View opportunity",
    url: "https://www.jobinrwanda.com/job/tender-two-2-year-non-exclusive-framework-agreement-enterprise-development-training-through",
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
  name: "Ernest Mulisa",
  title: "Managing Director",
  summary: [
    "Ernest Mulisa is a seasoned business leader with over 18 years of experience in international trade facilitation, strategic sourcing, global supply chain optimisation, enterprise digitalisation, and business development.",
    "As Managing Director of Lead Multichoice Rwanda since 2015, he leads efforts to connect international manufacturers, suppliers, investors, and service providers with business opportunities across Rwanda and the wider East African region.",
  ],
  bio: [
    "Ernest Mulisa is a seasoned business leader with over 18 years of experience in international trade facilitation, strategic sourcing, global supply chain optimisation, enterprise digitalisation, and business development.",
    "As Managing Director of Lead Multi-Choice Rwanda since 2015, he provides strategic leadership in connecting international manufacturers, suppliers, investors, and service providers with viable business opportunities across Rwanda and the wider East African region.",
    "Drawing on extensive global supply chain experience and market intelligence gained through professional engagements with Heineken BV, Ericsson AB, African Towers, the International Trade Centre (ITC – United Nations), and Cenfri, Ernest brings strong expertise in strategic procurement, international business representation, market entry strategy, enterprise digitalisation, stakeholder relationship management, and operational excellence.",
    "He holds a Master’s degree in Procurement and Supply Chain Management (MSc), is an ICC Incoterms® 2020 Certified Trainer, and is a Chartered Member of the Chartered Institute of Logistics and Transport (CILT) and a Member of the Chartered Institute of Procurement & Supply (CIPS).",
    "Ernest is committed to bridging global manufacturers and service providers with local and regional opportunities through trusted partnerships, competitive sourcing, strategic market intelligence, innovative business solutions, and sustainable value creation.",
  ],
  tags: [
    "Strategic procurement",
    "International business representation",
    "Market entry strategy",
    "Global supply chain optimisation",
    "Enterprise digitalisation",
    "Stakeholder relationship management",
    "Operational excellence",
  ],
  credentials: [
    "MSc Procurement and Supply Chain Management",
    "ICC Incoterms® 2020 Certified Trainer",
    "Chartered Member, Chartered Institute of Logistics and Transport (CILT)",
    "Member, Chartered Institute of Procurement & Supply (CIPS)",
  ],
};
