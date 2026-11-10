import type { Metadata } from "next";
import { AdminClientRequests } from "@/components/client-portal/admin-requests";
import { PageShell } from "@/components/layout/page";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Client requests — Lead Multi-Choice ® " };

export default async function ClientRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return <ClientRequestsContent initialSearch={q} />;
}

async function ClientRequestsContent({ initialSearch }: { initialSearch: string }) {
  const user = await getSessionUser();
  return (
    <PageShell
      title="Client requests"
      subtitle="Review requests submitted through the client portal"
    >
      <AdminClientRequests
        canManageStatuses={user?.role === "admin"}
        initialSearch={initialSearch}
      />
    </PageShell>
  );
}
