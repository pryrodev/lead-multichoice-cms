import type { Metadata } from "next";
import { TenderTable } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Tenders — LEAD MULTICHOICE Ltd" };

export default function TendersPage() {
  return (
    <PageShell
      title="Tenders & procurement"
      subtitle="Opportunities, deadlines and official portal links"
    >
      <TenderTable />
    </PageShell>
  );
}
