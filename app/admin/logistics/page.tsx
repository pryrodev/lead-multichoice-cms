import type { Metadata } from "next";
import { Logistics } from "@/components/dashboard/sections";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Logistics — LEAD MULTICHOICE Ltd" };

export default function LogisticsPage() {
  return <PageShell title="Logistics" subtitle="Regional corridor shipments and customs clearance"><div className="max-w-4xl"><Logistics /></div></PageShell>;
}
