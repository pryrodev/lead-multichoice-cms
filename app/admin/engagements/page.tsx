import type { Metadata } from "next";
import { Engagements, Pipeline } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Engagements — LEAD MULTICHOICE Ltd" };

export default function EngagementsPage() {
  return <PageShell title="Engagements" subtitle="Active business engagements, owners and milestones"><Pipeline /><Engagements /></PageShell>;
}
