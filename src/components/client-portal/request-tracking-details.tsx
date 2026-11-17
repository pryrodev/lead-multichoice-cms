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
    <div className="min-h-[65vh] bg-white">
      <div className="border-b border-brand-primary/10 bg-charcoal text-brand-white">
        <div className="container-site flex min-h-[70px] flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="eyebrow text-steel">Tracking ID</span>
            <span className="font-mono text-sm font-semibold text-brand-white sm:text-base">{reference}</span>
            <Button type="button" variant="ghost" size="icon" className="size-8 text-brand-white/80 hover:bg-brand-white/10 hover:text-brand-white" aria-label="Copy Tracking ID" onClick={copyReference}>
              {copied ? <Check className="size-4 text-brand-gold" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <Link href="/track" className="text-sm font-medium text-brand-white/85 underline-offset-4 hover:text-brand-white hover:underline">Track another request</Link>
        </div>
      </div>

      <main className="container-site grid gap-8 py-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12 md:py-9">
        {query.isPending ? (
          <div className="md:col-span-2" role="status"><Card className="bg-transparent shadow-none"><CardContent className="py-12 text-center text-muted-foreground">Loading your request updates...</CardContent></Card></div>
        ) : query.error ? (
          <div className="md:col-span-2">
            <Card className="bg-transparent shadow-none"><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p role="alert" className="font-medium">{query.error.message}</p>
              <p className="max-w-md text-sm text-muted-foreground">Check the order ID and try again, or contact our team for help.</p>
              <Button asChild variant="outline" className="border-brand-primary/30 text-brand-primary hover:bg-surface"><Link href="/track"><ArrowLeft data-icon="inline-start" />Return to tracking</Link></Button>
            </CardContent></Card>
          </div>
        ) : query.data ? (
          <>
            <section aria-labelledby="request-details-heading" className="space-y-6">
              <RequestSummary result={query.data} />
              {query.data.engagement?.updates.length ? (
                <Card className="rounded-xl border border-brand-primary/15 bg-brand-white shadow-xs">
                  <CardHeader className="px-0 md:px-6"><CardTitle className="text-base text-charcoal">Updates from the team</CardTitle></CardHeader>
                  <CardContent className="px-0 md:px-6">
                    <ol className="space-y-5">
                      {query.data.engagement.updates.map((update, index) => (
                        <li key={`${update.createdAt}-${update.title}-${index}`} className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-primary/30 bg-surface text-brand-primary"><Check className="size-4" /></span>
                          <div>
                            <h3 className="text-sm font-semibold text-charcoal">{update.title}</h3>
                            {update.trackingStatus && <Badge variant="secondary" className="mt-1 bg-surface text-brand-primary border-brand-primary/20">{update.trackingStatus.name}</Badge>}
                            <p className="mt-1 text-sm leading-relaxed text-steel">{update.message}</p>
                            <time className="mt-1.5 block text-xs text-steel/70">{new Date(update.createdAt).toLocaleString()}</time>
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
    <Card className="rounded-xl border border-brand-primary/15 bg-brand-white shadow-xs">
      <CardHeader className="px-0 md:px-6">
        <p id="request-details-heading" className="text-xs font-bold uppercase tracking-wider text-steel">Request details</p>
        <CardTitle className="text-xl leading-snug text-charcoal">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 md:px-6">
        <div className="rounded-lg border border-brand-primary/30 bg-surface/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary">Current status</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-charcoal"><PackageCheck className="size-4 text-brand-primary" />{currentStatus?.name ?? fallbackStatus}</div>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            {currentStatus?.description || (engagement ? "The team is coordinating the next steps for your request." : "The team has received your request and will share progress here as it is reviewed.")}
          </p>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-steel">Submitted</dt><dd className="mt-1 font-medium text-charcoal">{new Date(result.createdAt).toLocaleString()}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-steel">Last update</dt><dd className="mt-1 font-medium text-charcoal">{new Date(result.updatedAt).toLocaleString()}</dd></div>
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
        <div><p className="text-xs font-bold uppercase tracking-wider text-steel">Progress</p><h2 id="progress-heading" className="mt-1 text-xl font-bold text-charcoal">Request timeline</h2></div>
        <span className="inline-flex items-center gap-1.5 text-xs text-steel"><Clock3 className="size-3.5" />Local time</span>
      </div>
      <ol className="relative space-y-0 pl-1">
        <li className="relative flex gap-4 pb-7">
          <span className="absolute bottom-0 left-[13px] top-7 w-px bg-border" aria-hidden="true" />
          <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-primary/30 bg-surface text-brand-primary"><Check className="size-4" /></span>
          <div className="pt-0.5"><p className="text-sm font-semibold text-charcoal">Request submitted</p><p className="mt-1 text-sm text-steel">{new Date(result.createdAt).toLocaleString()}</p></div>
        </li>
        {statuses.length ? statuses.map((status, index) => {
          const isComplete = completed || (currentIndex >= 0 && index < currentIndex);
          const isCurrent = status.id === engagement?.currentTrackingStatusId;
          const isUpcoming = !isComplete && !isCurrent;
          const statusUpdate = engagement?.updates.find((update) => update.trackingStatus?.id === status.id);
          return (
            <li key={status.id} className="relative flex gap-4 pb-7 last:pb-0">
              {index < statuses.length - 1 && <span className={`absolute bottom-0 left-[13px] top-7 w-px ${isComplete ? "bg-brand-primary/60" : "bg-border"}`} aria-hidden="true" />}
              <span className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border ${isComplete ? "border-brand-primary/30 bg-surface text-brand-primary" : isCurrent ? "border-brand-gold bg-brand-gold text-charcoal ring-4 ring-brand-gold/20" : "border-steel/25 bg-brand-white text-steel/60"}`}>
                {isComplete ? <Check className="size-4" /> : isCurrent ? <span className="size-2 rounded-full bg-brand-white" /> : <Circle className="size-2.5" />}
              </span>
              <div className="pt-0.5">
                <p className={`text-sm ${isCurrent ? "font-bold text-charcoal" : isUpcoming ? "text-steel/70" : "font-medium text-charcoal"}`}>{status.name}</p>
                <p className="mt-1 text-sm text-steel">{status.description || "Progress updates for this status will appear here."}</p>
                {statusUpdate && <time className="mt-1.5 block text-xs text-steel/70">{new Date(statusUpdate.createdAt).toLocaleString()}</time>}
                {isCurrent && <Badge className={`mt-2 ${completed ? "bg-brand-primary text-brand-white hover:bg-brand-primary/90" : "bg-brand-gold text-charcoal hover:bg-brand-gold"}`}>{completed ? "Completed" : "Current status"}</Badge>}
              </div>
            </li>
          );
        }) : (
          <li className="flex gap-4 pb-7">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-steel/30 text-steel"><Clock3 className="size-4" /></span>
            <div><p className="text-sm font-semibold text-charcoal">Team review</p><p className="mt-1 text-sm text-steel">The team will publish the status flow after reviewing your request.</p></div>
          </li>
        )}
      </ol>
    </section>
  );
}
