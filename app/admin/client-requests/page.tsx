import type { Metadata } from "next";
import { AdminClientRequests } from "@/components/client-portal/admin-requests";
import { PageShell } from "@/components/layout/page";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Client requests — LEAD MULTICHOICE Ltd" };

export default function ClientRequestsPage() {
  return <ClientRequestsContent />;
}

async function ClientRequestsContent() {
  const user = await getSessionUser();
  return <PageShell title="Client requests" subtitle="Review requests submitted through the client portal"><AdminClientRequests canManageStatuses={user?.role === "admin"} /></PageShell>;
}
