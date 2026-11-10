import type { Metadata } from "next";
import { PortalAuthForm } from "@/components/client-portal/auth-form";
import { PortalUnavailable } from "@/components/client-portal/portal-unavailable";
import { isClientPortalEnabled } from "@/lib/auth/portal-access";

export const metadata: Metadata = {
  title: "Client Portal Sign In",
  description:
    "Sign in to your Lead Multi-Choice ® client portal to follow sourcing requests and engagement updates.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Client Portal Sign In | Lead Multi-Choice ® Ltd",
    description:
      "Access your Lead Multi-Choice ® client portal to follow requests and engagement updates.",
    type: "website",
  },
};

export default function PortalLoginPage() {
  return isClientPortalEnabled() ? <PortalAuthForm /> : <PortalUnavailable />;
}
