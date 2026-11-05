import type { Metadata } from "next";
import { AdminOverview } from "@/components/client-portal/admin-overview";
import { PageShell } from "@/components/layout/page";

export const metadata: Metadata = { title: "Operations overview" };

export default function DashboardPage() {
  return <PageShell title="Operations overview" subtitle="Trade facilitation · Kigali"><AdminOverview /></PageShell>;
}
