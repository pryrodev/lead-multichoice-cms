import { createFileRoute } from "@tanstack/react-router";
import { engagementsQuery, stagesQuery } from "@/lib/api/hooks";
import { Pipeline, Engagements } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const Route = createFileRoute("/engagements")({
  head: () => ({
    meta: [
      { title: "Engagements — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Active business engagements, owners and milestones." },
      { property: "og:title", content: "Engagements — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Active business engagements, owners and milestones." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([engagementsQuery, stagesQuery].map((q) => qc.ensureQueryData(q as never))).then(() => undefined),
  component: Page,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Page() {
  return (
    <PageShell title="Engagements" subtitle="Active business engagements, owners and milestones">
      <Pipeline />
      <Engagements />
    </PageShell>
  );
}
