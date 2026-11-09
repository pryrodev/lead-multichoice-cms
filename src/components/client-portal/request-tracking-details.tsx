"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Circle, Clock3, Copy, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { useTrackedClientRequest } from "@/features/client-portal/hooks";
import type { PublicRequestTracking, TrackingStatus } from "@/features/client-portal/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requestStatusLabels: Record<string, string> = {
  submitted: "Request received",
  in_review: "In review",
  accepted: "Accepted",
  declined: "Closed",
  active: "In progress",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function RequestTrackingDetails({ reference }: { reference: string }) {
  const query = useTrackedClientRequest(reference);
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      toast.success("Request reference copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy the reference");
    }
  }

  return (
    <div className="min-h-[65vh] bg-background">
      <div className="border-b bg-background">
        <div className="container-site flex min-h-[68px] flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-medium text-muted-foreground">Tracking ID:</span>
            <span className="font-mono text-base font-semibold text-foreground sm:text-lg">{reference}</span>
            <Button type="button" variant="ghost" size="icon" className="size-8 text-primary" aria-label="Copy Tracking ID" onClick={copyReference}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <Link href="/track" className="text-sm font-medium text-primary hover:underline">Track another request</Link>
        </div>
      </div>

      <main className="container-site grid gap-8 py-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12 md:py-10">
        {query.isPending ? (
          <div className="md:col-span-2" role="status"><Card><CardContent className="py-12 text-center text-muted-foreground">Loading your request updates...</CardContent></Card></div>
        ) : query.error ? (
          <div className="md:col-span-2">
            <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p role="alert" className="font-medium">{query.error.message}</p>
              <p className="max-w-md text-sm text-muted-foreground">Check the order ID and try again, or contact our team for help.</p>
              <Button asChild variant="outline"><Link href="/track"><ArrowLeft data-icon="inline-start" />Return to tracking</Link></Button>
            </CardContent></Card>
          </div>
        ) : query.data ? (
          <>
            <section aria-labelledby="request-details-heading" className="space-y-6">
              <RequestSummary result={query.data} />
              {query.data.engagement?.updates.length ? (
                <Card className="rounded-sm border-x-0 border-t-0 shadow-none md:rounded-xl md:border">
                  <CardHeader className="px-0 md:px-6"><CardTitle className="text-base">Updates from the team</CardTitle></CardHeader>
                  <CardContent className="px-0 md:px-6">
                    <ol className="space-y-5">
                      {query.data.engagement.updates.map((update, index) => (
                        <li key={`${update.createdAt}-${update.title}-${index}`} className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="size-4" /></span>
                          <div>
                            <h3 className="text-sm font-semibold">{update.title}</h3>
                            {update.trackingStatus && <Badge variant="secondary" className="mt-1">{update.trackingStatus.name}</Badge>}
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{update.message}</p>
                            <time className="mt-1.5 block text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleString()}</time>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ) : null}
            </section>
            <ProgressTimeline result={query.data} />
          </>
        ) : null}
      </main>
    </div>
  );
}

function RequestSummary({ result }: { result: PublicRequestTracking }) {
  const engagement = result.engagement;
  const currentStatus = engagement?.trackingStatuses.find((status) => status.id === engagement.currentTrackingStatusId);
  const fallbackStatus = requestStatusLabels[engagement?.status ?? result.status] ?? result.status.replaceAll("_", " ");

  return (
    <Card className="rounded-sm border-x-0 border-t-0 shadow-none md:rounded-xl md:border">
      <CardHeader className="px-0 md:px-6">
        <p id="request-details-heading" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Request details</p>
        <CardTitle className="text-xl leading-snug">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 md:px-6">
        <div className="rounded-lg bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Current status</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium"><PackageCheck className="size-4 text-primary" />{currentStatus?.name ?? fallbackStatus}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {currentStatus?.description || (engagement ? "The team is coordinating the next steps for your request." : "The team has received your request and will share progress here as it is reviewed.")}
          </p>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitted</dt><dd className="mt-1 font-medium">{new Date(result.createdAt).toLocaleString()}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last update</dt><dd className="mt-1 font-medium">{new Date(result.updatedAt).toLocaleString()}</dd></div>
        </dl>
      </CardContent>
    </Card>
  );
}

function ProgressTimeline({ result }: { result: PublicRequestTracking }) {
  const engagement = result.engagement;
  const statuses = engagement?.trackingStatuses ?? [];
  const currentIndex = statuses.findIndex((status) => status.id === engagement?.currentTrackingStatusId);
  const currentStatus = statuses[currentIndex];
  const completed = engagement?.status === "completed" || Boolean(currentStatus?.isTerminal);

  return (
    <section aria-labelledby="progress-heading">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</p><h2 id="progress-heading" className="mt-1 text-xl font-semibold">Request timeline</h2></div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />Local time</span>
      </div>
      <ol className="relative space-y-0 pl-1">
        <li className="relative flex gap-4 pb-7">
          <span className="absolute bottom-0 left-[13px] top-7 w-px bg-border" aria-hidden="true" />
          <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span>
          <div className="pt-0.5"><p className="text-sm font-semibold">Request submitted</p><p className="mt-1 text-sm text-muted-foreground">{new Date(result.createdAt).toLocaleString()}</p></div>
        </li>
        {statuses.length ? statuses.map((status, index) => {
          const isComplete = completed || (currentIndex >= 0 && index < currentIndex);
          const isCurrent = status.id === engagement?.currentTrackingStatusId;
          const isUpcoming = !isComplete && !isCurrent;
          const statusUpdate = engagement?.updates.find((update) => update.trackingStatus?.id === status.id);
          return (
            <li key={status.id} className="relative flex gap-4 pb-7 last:pb-0">
              {index < statuses.length - 1 && <span className={`absolute bottom-0 left-[13px] top-7 w-px ${isComplete ? "bg-primary" : "bg-border"}`} aria-hidden="true" />}
              <span className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border ${isComplete ? "border-primary bg-primary text-primary-foreground" : isCurrent ? "border-primary bg-background text-primary ring-4 ring-primary/10" : "border-border bg-background text-muted-foreground"}`}>
                {isComplete ? <Check className="size-4" /> : isCurrent ? <span className="size-2 rounded-full bg-primary" /> : <Circle className="size-2.5" />}
              </span>
              <div className="pt-0.5">
                <p className={`text-sm ${isCurrent ? "font-semibold text-foreground" : isUpcoming ? "text-muted-foreground" : "font-medium"}`}>{status.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{status.description || "Progress updates for this status will appear here."}</p>
                {statusUpdate && <time className="mt-1.5 block text-xs text-muted-foreground">{new Date(statusUpdate.createdAt).toLocaleString()}</time>}
                {isCurrent && <Badge variant="secondary" className="mt-2">{completed ? "Completed" : "Current status"}</Badge>}
              </div>
            </li>
          );
        }) : (
          <li className="flex gap-4 pb-7">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary text-primary"><Clock3 className="size-4" /></span>
            <div><p className="text-sm font-semibold">Team review</p><p className="mt-1 text-sm text-muted-foreground">The team will publish the status flow after reviewing your request.</p></div>
          </li>
        )}
      </ol>
    </section>
  );
}
