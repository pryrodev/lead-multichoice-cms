import type { Metadata } from "next";
import { AdminOverview } from "@/components/client-portal/admin-overview";
import { PageShell } from "@/components/layout/page";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Operations overview" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (user?.role === "staff") redirect("/admin/client-requests");
  return <PageShell title="Operations overview" subtitle="Trade facilitation · Kigali"><AdminOverview /></PageShell>;
}
