import type { Metadata } from "next";
import { ActivityFeed } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Activity log — LEAD MULTICHOICE Ltd" };

export default function ActivityPage() {
  return <PageShell title="Activity log" subtitle="Dated updates, blockers, decisions and next actions"><div className="max-w-4xl"><ActivityFeed /></div></PageShell>;
}
