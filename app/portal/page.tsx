import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client-portal/client-dashboard";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "My requests — LEAD MULTICHOICE Ltd" };

export default async function ClientPortalPage() {
  let user;
  try {
    user = await getSessionUser();
  } catch {
    redirect("/portal/login");
  }
  if (!user) redirect("/portal/login");
  if (user.role === "admin") redirect("/admin");
  return <ClientDashboard />;
}
