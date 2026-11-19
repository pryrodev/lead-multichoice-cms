import MarketAccessInvestment from "@/components/site/pages/market-access-investment";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("market-access-investment"); }

export default function MarketAccessInvestmentPage() {
  return <MarketAccessInvestment />;
}
