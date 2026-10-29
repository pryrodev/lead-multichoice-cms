import { createFileRoute } from "@tanstack/react-router";
import { tendersQuery } from "@/lib/api/hooks";
import { TenderTable } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const Route = createFileRoute("/tenders")({
  head: () => ({
    meta: [
      { title: "Tenders — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Procurement and tender opportunities with official portal links." },
      { property: "og:title", content: "Tenders — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Procurement and tender opportunities with official portal links." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([tendersQuery].map((q) => qc.ensureQueryData(q as never))).then(() => undefined),
  component: Page,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Page() {
  return (
    <PageShell title="Tenders" subtitle="Procurement and tender opportunities with official portal links">
      <TenderTable />
    </PageShell>
  );
}
