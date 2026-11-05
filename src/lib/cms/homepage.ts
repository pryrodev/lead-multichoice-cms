import { messages, type Language } from "@/i18n/messages";
import { translateSiteCopy } from "@/i18n/site-copy";

export const HOME_CMS_FIELDS = [
  { section: "SEO", text: "Connecting Rwanda's Buyers with Global Suppliers" },
  { section: "SEO", text: "LEAD MULTICHOICE bridges Rwanda's purchasing entities with credible international manufacturers and distributors through supplier identification, verification, introductions and local coordination." },
  { section: "Hero", text: "Market Access | Supplier Engagement | Trade Facilitation" },
  { section: "Hero", text: "Connecting Rwanda's buyers with trusted global suppliers." },
  { section: "Hero", text: "We bridge Rwanda's purchasing market and the global supply ecosystem, helping buyers and international suppliers find each other and coordinate with confidence." },
  { section: "Hero", text: "I am an international supplier" },
  { section: "Hero", text: "I represent a purchasing entity" },
  { section: "Hero", text: "Local knowledge. Global connections." },
  { section: "Hero", text: "Supporting commercial engagement in Rwanda and the region." },
  { section: "Opportunity", text: "The opportunity" },
  { section: "Opportunity", text: "Bridging the information and access gap." },
  { section: "Opportunity", text: "For international suppliers" },
  { section: "Opportunity", text: "Understand Rwanda's procurement environment, identify relevant opportunities and reach purchasing entities through local representation." },
  { section: "Opportunity", text: "For Rwanda's purchasing entities" },
  { section: "Opportunity", text: "Expand access to credible manufacturers, authorised distributors and specialised service providers around the world." },
  { section: "Our role", text: "Our role" },
  { section: "Our role", text: "From supplier identification to coordinated delivery." },
  { section: "Our role", text: "We structure the connection, facilitate engagement and keep the work moving across the parties involved." },
  { section: "Our role", text: "Identify" },
  { section: "Our role", text: "Find relevant buyers, suppliers and sourcing opportunities." },
  { section: "Our role", text: "Verify" },
  { section: "Our role", text: "Support due diligence and confirm the right points of contact." },
  { section: "Our role", text: "Connect" },
  { section: "Our role", text: "Facilitate direct conversations between the parties." },
  { section: "Our role", text: "Coordinate" },
  { section: "Our role", text: "Help align procurement, logistics and delivery follow-up." },
  { section: "Services", text: "What we do" },
  { section: "Services", text: "Local coordination across the supply journey." },
  { section: "Services", text: "Explore all services" },
  { section: "Services", text: "Market Access & Trade Facilitation" },
  { section: "Services", text: "Find opportunities, meet the right buyers and enter Rwanda with local representation." },
  { section: "Services", text: "Procurement & Supply Chain Coordination" },
  { section: "Services", text: "Source suppliers, manage procurement and follow every order through to delivery." },
  { section: "Services", text: "Logistics, Distribution & Trade Compliance Support" },
  { section: "Services", text: "Track shipments, coordinate customs and documents, and confirm final delivery." },
  { section: "Procurement resources", text: "Stay connected to procurement opportunities." },
  { section: "Procurement resources", text: "Find current tenders on Rwanda's official portals." },
  { section: "Procurement resources", text: "Official procurement portal" },
  { section: "Procurement resources", text: "Medical and healthcare supply tenders." },
  { section: "Procurement resources", text: "Visit RMS Tenders" },
  { section: "Procurement resources", text: "Rwanda's official government tenders portal." },
  { section: "Procurement resources", text: "Visit UMUCYO Portal" },
  { section: "Outcomes", text: "The value we work toward" },
  { section: "Outcomes", text: "More efficient sourcing. Stronger supply partnerships." },
  { section: "Outcomes", text: "More informed sourcing decisions" },
  { section: "Outcomes", text: "Access to credible supplier options" },
  { section: "Outcomes", text: "Reliable supply coordination" },
  { section: "Outcomes", text: "Long-term commercial partnerships" },
  { section: "Contact", text: "Start a conversation" },
  { section: "Contact", text: "Looking for a supplier or a route into Rwanda?" },
  { section: "Contact", text: "Tell us what you are sourcing or the market you want to reach." },
  { section: "Contact", text: "Discuss a Business Opportunity" },
] as const;

export type HomeCopyText = (typeof HOME_CMS_FIELDS)[number]["text"];
export type HomePageContent = {
  translations: Record<Language, Record<HomeCopyText, string>>;
  heroImageUrl: string;
};

const copyTexts = [...new Set(HOME_CMS_FIELDS.map((field) => field.text))] as HomeCopyText[];

export const defaultHomePageContent: HomePageContent = {
  translations: Object.fromEntries(
    (["en", "rw", "fr", "sw"] as const).map((language) => [
      language,
      Object.fromEntries(copyTexts.map((text) => [text, text === "Discuss a Business Opportunity" ? messages[language]["header.discussOpportunity"] : translateSiteCopy(language, text)])),
    ]),
  ) as HomePageContent["translations"],
  heroImageUrl: "/site/hero-port.jpg",
};
