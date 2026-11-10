import type { Metadata } from "next";
import { OpportunityRegister } from "@/components/opportunities/opportunity-register";

export const metadata: Metadata = { title: "Opportunities — Lead Multi-Choice ® Ltd" };

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-5 px-4 py-3 md:space-y-6 md:px-7 md:py-5">
      <OpportunityRegister initialSearch={q} />
    </main>
  );
}
