import { createFileRoute } from "@tanstack/react-router";
import { shipmentsQuery } from "@/lib/api/hooks";
import { Logistics } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Logistics — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Regional corridor shipments and customs clearance." },
      { property: "og:title", content: "Logistics — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Regional corridor shipments and customs clearance." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([shipmentsQuery].map((q) => qc.ensureQueryData(q as never))).then(() => undefined),
  component: Page,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Page() {
  return (
    <PageShell title="Logistics" subtitle="Regional corridor shipments and customs clearance">
      <div className="max-w-3xl"><Logistics /></div>
    </PageShell>
  );
}
