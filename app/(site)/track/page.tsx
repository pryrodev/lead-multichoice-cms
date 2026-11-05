import type { Metadata } from "next";
import { RequestTracker } from "@/components/client-portal/request-tracker";
import { PortalUnavailable } from "@/components/client-portal/portal-unavailable";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";

export const metadata: Metadata = {
  title: "Track a Request",
  description: "View the latest LEAD MULTICHOICE updates for your request.",
};

export default function TrackPage() {
  return isClientPortalEnabled() ? <RequestTracker /> : <PortalUnavailable />;
}
