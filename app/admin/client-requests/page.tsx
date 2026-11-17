import type { Metadata } from "next";
import { AdminRequestCreateDialog } from "@/components/client-portal/admin-request-create-dialog";
import { AdminClientRequests } from "@/components/client-portal/admin-requests";
import { TrackingStatusManager } from "@/components/client-portal/tracking-status-manager";
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
      actions={
        <>
          <TrackingStatusManager canManage={user?.role === "admin"} />
          <AdminRequestCreateDialog />
        </>
      }
    >
      <AdminClientRequests initialSearch={initialSearch} />
    </PageShell>
  );
}
