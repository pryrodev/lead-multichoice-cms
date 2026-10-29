import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery, engagementsQuery, kpisQuery, shipmentsQuery, stagesQuery, tendersQuery } from "@/lib/api/hooks";
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">LEAD MULTICHOICE Ltd · Kigali</div>
            <h1 className="font-display text-xl font-semibold">Business Operations & Trade Facilitation</h1>
          </div>
          <div className="hidden font-mono text-xs opacity-80 sm:block">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
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
      </main>
    </div>
  );
}
