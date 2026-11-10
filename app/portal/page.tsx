import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client-portal/client-dashboard";
import { getSessionUser } from "@/lib/auth/session";
import { PortalFrame } from "@/components/client-portal/portal-frame";

export const metadata: Metadata = { title: "My requests — LEAD MULTI-CHOICE ® Ltd" };

export default async function ClientPortalPage() {
  let user;
  try {
    user = await getSessionUser();
  } catch {
    redirect("/portal/login");
  }
  if (!user) redirect("/portal/login");
  if (user.role === "admin") redirect("/admin");
  return <PortalFrame><ClientDashboard /></PortalFrame>;
}
