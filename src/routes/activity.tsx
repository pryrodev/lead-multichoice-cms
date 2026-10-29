import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery } from "@/lib/api/hooks";
import { ActivityFeed } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity log — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Dated updates, blockers, decisions and next actions." },
      { property: "og:title", content: "Activity log — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Dated updates, blockers, decisions and next actions." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([activitiesQuery].map((q) => qc.ensureQueryData(q as never))).then(() => undefined),
  component: Page,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Page() {
  return (
    <PageShell title="Activity log" subtitle="Dated updates, blockers, decisions and next actions">
      <div className="max-w-3xl"><ActivityFeed /></div>
    </PageShell>
  );
}
