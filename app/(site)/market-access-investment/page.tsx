import type { Metadata } from "next";
import MarketAccessInvestment from "@/components/site/pages/market-access-investment";

export const metadata: Metadata = {
  title: "Market Access & Investment",
  description:
    "Explore Rwanda's regional market opportunities and how LEAD MULTI-CHOICE ® supports market entry, supplier engagement, procurement coordination and delivery.",
};

export default function MarketAccessInvestmentPage() {
  return <MarketAccessInvestment />;
}
