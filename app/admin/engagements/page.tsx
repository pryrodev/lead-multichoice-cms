import type { Metadata } from "next";
import { EngagementWorkspace } from "@/components/dashboard/engagement-workspace";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Engagements — Lead Multi-Choice ® " };

export default async function EngagementsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <PageShell
      title="Engagements"
      subtitle="Track client work from first contact through delivery and after-sales support."
    >
      <EngagementWorkspace initialSearch={q} />
    </PageShell>
  );
}
