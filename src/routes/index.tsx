import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery, engagementsQuery, kpisQuery, shipmentsQuery, stagesQuery, tendersQuery } from "@/lib/api/hooks";
import { PageShell } from "@/components/layout/page";
import { ActivityFeed, Engagements, KpiRibbon, Logistics, Pipeline, TenderTable } from "@/components/dashboard/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Tender tracking, trade facilitation pipeline, logistics and audit feed for LEAD MULTICHOICE Ltd." },
      { property: "og:title", content: "Operations Dashboard — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Business operations and trade facilitation system for Rwanda and East Africa." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([kpisQuery, stagesQuery, engagementsQuery, tendersQuery, shipmentsQuery, activitiesQuery].map((q) => qc.ensureQueryData(q as never))).then(() => undefined),
  component: Index,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Index() {
  return (
    <PageShell title="Dashboard" subtitle="Business operations & trade facilitation · Kigali">
      <KpiRibbon />
      <Pipeline />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><Engagements /></div>
        <Logistics />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><TenderTable /></div>
        <ActivityFeed />
      </div>
    </PageShell>
  );
}
