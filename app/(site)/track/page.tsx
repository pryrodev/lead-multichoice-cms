import { RequestTracker } from "@/components/client-portal/request-tracker";
import { PortalUnavailable } from "@/components/client-portal/portal-unavailable";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";
import { QueryProvider } from "@/components/providers/query-provider";
import { getPublicPageMetadata } from "@/lib/cms/metadata";

export async function generateMetadata() { return getPublicPageMetadata("track"); }

export default function TrackPage() {
  return isClientPortalEnabled() ? (
    <QueryProvider>
      <RequestTracker />
    </QueryProvider>
  ) : (
    <PortalUnavailable />
  );
}
