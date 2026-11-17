export interface WebsitePartner {
  id: string;
  name: string;
  href: string;
  logo: string;
}

export interface PartnersContent {
  partners: WebsitePartner[];
}

export const defaultPartners: PartnersContent = {
  partners: [
    {
      id: "rppa",
      name: "Rwanda Public Procurement Authority",
      href: "https://www.rppa.gov.rw/",
      logo: "https://www.rppa.gov.rw/fileadmin/user_upload/RPPA/News_Images/New_replace_Logo_123.jpg",
    },
    {
      id: "rdb",
      name: "Rwanda Development Board",
      href: "https://rdb.rw/",
      logo: "https://images.squarespace-cdn.com/content/v1/55ed8436e4b038f693789ca0/7f50683b-b00b-4fc4-8746-aab7d56cf8c9/RDB1.png",
    },
    { id: "psf", name: "Private Sector Federation", href: "https://psf.org.rw/", logo: "/psf.png" },
    {
      id: "fda",
      name: "Rwanda Food and Drugs Authority",
      href: "https://www.rwandafda.gov.rw/",
      logo: "https://www.rwandafda.gov.rw/fileadmin/user_upload/RwandaFDA/rwandafda_logo.png",
    },
    {
      id: "rsb",
      name: "Rwanda Standards Board",
      href: "https://www.rsb.gov.rw/",
      logo: "https://www.rsb.gov.rw/fileadmin/user_upload/Icons_logo/Logo-01.png",
    },
    {
      id: "rra",
      name: "Rwanda Revenue Authority",
      href: "https://www.rra.gov.rw/",
      logo: "https://www.rra.gov.rw/typo3conf/ext/rra_ui/Resources/Public/images/Rwanda-Revenue-Authority-logo.png",
    },
    {
      id: "bnr",
      name: "National Bank of Rwanda",
      href: "https://www.bnr.rw/",
      logo: "https://www.bnr.rw/static/media/bnr-logo.7633d18322b2e9a1c715.png",
    },
    {
      id: "bk",
      name: "Bank of Kigali",
      href: "https://www.bk.rw/",
      logo: "https://www.rwandainkenya.gov.rw/fileadmin/user_upload/Kenya_user_upload/news_pictures/bk.png",
    },
    {
      id: "mtn",
      name: "MTN Rwanda",
      href: "https://www.mtn.co.rw/",
      logo: "https://www.mtn.co.rw/wp-content/uploads/2023/07/new-mtn-logo.jpg",
    },
  ],
};

export function mergePartners(value: unknown): PartnersContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultPartners;
  const partners = (value as { partners?: unknown }).partners;
  if (!Array.isArray(partners)) return defaultPartners;
  const valid = partners.filter((item): item is WebsitePartner => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return ["id", "name", "href", "logo"].every((key) => typeof row[key] === "string");
  });
  return { partners: valid };
}
