import type { Metadata } from "next";
import { OpportunityRegister } from "@/components/opportunities/opportunity-register";

export const metadata: Metadata = { title: "Opportunities — LEAD MULTICHOICE Ltd" };

export default function OpportunitiesPage() {
  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-5 px-4 py-3 md:space-y-6 md:px-7 md:py-5">
      <OpportunityRegister />
    </main>
  );
}
