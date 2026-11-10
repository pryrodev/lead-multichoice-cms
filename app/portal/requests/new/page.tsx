import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClientRequestForm } from "@/components/client-portal/request-form";
import { getSessionUser } from "@/lib/auth/session";
import { PortalFrame } from "@/components/client-portal/portal-frame";

export const metadata: Metadata = { title: "Submit a request — LEAD MULTI-CHOICE ® Ltd" };

export default async function NewClientRequestPage() {
  let user;
  try {
    user = await getSessionUser();
  } catch {
    redirect("/portal/login");
  }
  if (!user) redirect("/portal/login");
  if (user.role === "admin") redirect("/client-requests");
  return <PortalFrame><ClientRequestForm /></PortalFrame>;
}
