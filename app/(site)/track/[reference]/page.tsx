import type { Metadata } from "next";
import { RequestTrackingDetails } from "@/components/client-portal/request-tracking-details";
import { QueryProvider } from "@/components/providers/query-provider";

type PageProps = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return { title: `Tracking ${reference} | LEAD MULTI-CHOICE ®`, robots: { index: false, follow: false } };
}

export default async function TrackDetailsPage({ params }: PageProps) {
  const { reference } = await params;
  return <QueryProvider><RequestTrackingDetails reference={decodeURIComponent(reference)} /></QueryProvider>;
}
