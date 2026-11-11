import type { Metadata } from "next";
import MarketAccessInvestment from "@/components/site/pages/market-access-investment";

export const metadata: Metadata = {
  title: "Market Access | Lead Multichoice Ltd",
  description:
    "Rwanda: Your gateway to regional and continental opportunities. Learn how Lead Multichoice Ltd supports international manufacturers and suppliers with market intelligence, local representation, and procurement coordination.",
};

export default function MarketAccessInvestmentPage() {
  return <MarketAccessInvestment />;
}
