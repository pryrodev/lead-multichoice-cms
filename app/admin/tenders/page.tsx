import type { Metadata } from "next";
import { TenderTable } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Tenders — Lead Multi-Choice ® " };

export default async function TendersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <PageShell
      title="Tender tracking"
      subtitle="Official procurement notices, deadlines, portal links and outcomes"
    >
      <TenderTable initialSearch={q} />
    </PageShell>
  );
}
