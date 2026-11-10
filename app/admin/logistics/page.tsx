import type { Metadata } from "next";
import { Logistics } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Logistics — Lead Multi-Choice ® Ltd" };

export default async function LogisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <PageShell title="Logistics" subtitle="Regional corridor shipments and customs clearance">
      <div className="w-full min-w-0">
        <Logistics initialSearch={q} />
      </div>
    </PageShell>
  );
}
