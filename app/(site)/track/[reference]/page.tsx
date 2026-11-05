import type { Metadata } from "next";
import { RequestTrackingDetails } from "@/components/client-portal/request-tracking-details";

type PageProps = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return { title: `Request ${reference} | Tracking` };
}

export default async function TrackDetailsPage({ params }: PageProps) {
  const { reference } = await params;
  return <RequestTrackingDetails reference={decodeURIComponent(reference)} />;
}
