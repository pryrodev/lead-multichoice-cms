"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock3, FilePlus2, RefreshCw, Waypoints } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientOverview } from "@/features/client-portal/hooks";
import type { ClientRequest, ClientRequestStatus, EngagementStage } from "@/features/client-portal/types";

const stageLabels: Record<EngagementStage, string> = {
  connect: "Review & identify",
  introductions: "Supplier introductions",
  bidding: "Tender coordination",
  procurement: "Procurement & logistics",
  delivery: "Delivery & follow-up",
};
const stageProgress: Record<EngagementStage, number> = {
  connect: 20,
  introductions: 40,
  bidding: 60,
  procurement: 80,
  delivery: 100,
};
const requestStatus: Record<ClientRequestStatus, string> = {
  submitted: "Received",
  in_review: "Under review",
  accepted: "In progress",
  declined: "Closed",
};
const stages: EngagementStage[] = ["connect", "introductions", "bidding", "procurement", "delivery"];
const formatDate = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
const formatDateTime = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function ClientDashboard() {
  const query = useClientOverview();
  if (query.isPending) return <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"><Skeleton className="h-64 rounded-2xl lg:col-span-2" /><Skeleton className="h-[26rem] rounded-2xl" /><Skeleton className="h-[26rem] rounded-2xl" /></div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load your requests</AlertTitle><AlertDescription className="flex flex-wrap items-center justify-between gap-3">{query.error.message}<Button variant="outline" size="sm" onClick={() => void query.refetch()}><RefreshCw data-icon="inline-start" />Try again</Button></AlertDescription></Alert>;

  const { user, requests, updates, milestones } = query.data;
  const sortedRequests = [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const openRequests = sortedRequests.filter((request) => request.status !== "declined" && request.engagementStatus !== "completed" && request.engagementStatus !== "cancelled");
  const featuredRequest = openRequests[0] ?? sortedRequests[0] ?? null;
  const otherRequests = sortedRequests.filter((request) => request.id !== featuredRequest?.id);
  const requestByEngagement = new Map(requests.filter((request) => request.engagementId).map((request) => [request.engagementId!, request]));
  const recentUpdates = [...updates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const activeCount = openRequests.length;

  return (
    <div className="space-y-7 pb-8">
      <section className="relative isolate overflow-hidden rounded-2xl bg-brand-primary text-brand-white" aria-labelledby="portal-welcome-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(var(--brand-white)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 -z-10 size-80 rounded-full border border-brand-white/15" />
        <div className="grid gap-8 px-6 py-7 sm:px-9 sm:py-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-gold">Your trade desk</p>
            <h1 id="portal-welcome-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user.name.split(" ")[0]}.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-white/85 sm:text-base">Follow each request from first review to delivery. Your team’s latest updates are gathered here.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <div className="border-l-2 border-brand-gold pl-3">
              <p className="font-display text-3xl font-semibold tabular-nums">{activeCount.toString().padStart(2, "0")}</p>
              <p className="text-xs text-brand-white/80">requests in motion</p>
            </div>
            <Button asChild className="bg-brand-white text-brand-primary hover:bg-brand-white/90">
              <Link href="/portal/requests/new">Start a request <ArrowRight data-icon="inline-end" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {featuredRequest ? (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
          <div className="space-y-8">
            <section aria-labelledby="active-request-heading">
              <SectionHeading eyebrow={openRequests.length ? "In motion" : "Most recent"} title={openRequests.length ? "Your current engagement" : "Latest request"} />
              <FeaturedRequest request={featuredRequest} milestones={milestones.filter((item) => item.engagementId === featuredRequest.engagementId)} />
            </section>

            {otherRequests.length > 0 && (
              <section aria-labelledby="other-requests-heading">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <SectionHeading eyebrow="The rest of your work" title="Other requests" id="other-requests-heading" />
                  <span className="pb-1 text-xs text-muted-foreground">{otherRequests.length} total</span>
                </div>
                <div className="divide-y divide-border border-y">
                  {otherRequests.map((request) => <RequestLine key={request.id} request={request} />)}
                </div>
              </section>
            )}
          </div>

          <aside className="rounded-xl border bg-card px-5 py-5 sm:px-6" aria-labelledby="updates-heading">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div><p className="eyebrow">From your team</p><h2 id="updates-heading" className="mt-1 font-display text-xl font-semibold">Recent updates</h2></div>
              <Waypoints className="mt-1 size-5 text-brand-primary" aria-hidden="true" />
            </div>
            {recentUpdates.length ? (
              <ol className="space-y-0">
                {recentUpdates.map((update, index) => {
                  const request = requestByEngagement.get(update.engagementId);
                  return (
                    <li key={update.id} className="relative flex gap-3 pb-5 last:pb-0">
                      {index < recentUpdates.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-6 w-px bg-border" />}
                      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-charcoal"><Check className="size-3.5" /></span>
                      <div className="min-w-0 flex-1">
                        <time className="text-xs text-muted-foreground">{formatDateTime(update.createdAt)}</time>
                        <h3 className="mt-1 text-sm font-semibold leading-snug">{update.title}</h3>
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{update.message}</p>
                        {request && <Link href={`/track/${encodeURIComponent(request.reference)}`} className="mt-2 inline-flex max-w-full items-center gap-1 text-xs font-medium text-brand-primary hover:underline"><span className="truncate">{request.title}</span><ArrowUpRight className="size-3.5 shrink-0" /></Link>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="border-l-2 border-brand-gold py-1 pl-3 text-sm leading-relaxed text-muted-foreground">No updates yet. When the team posts progress, it will appear here.</p>
            )}
          </aside>
        </div>
      ) : (
        <FirstRequestWelcome />
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return <div className="mb-3"><p className="eyebrow">{eyebrow}</p><h2 id={id ?? "active-request-heading"} className="mt-1 font-display text-xl font-semibold tracking-tight">{title}</h2></div>;
}

function FeaturedRequest({ request, milestones }: { request: ClientRequest; milestones: { id: string; title: string; dueDate: string | null; isComplete: boolean | 0 | 1 }[] }) {
  const stage = request.engagementStage;
  const stageIndex = stage ? stages.indexOf(stage) : -1;
  const currentStatus = request.engagementStatus === "completed" ? "Completed" : request.engagementStatus === "on_hold" ? "On hold" : stage ? stageLabels[stage] : requestStatus[request.status];
  const progress = request.engagementStatus === "completed" ? 100 : stage ? stageProgress[stage] : 0;
  const completed = request.engagementStatus === "completed";

  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-surface/50 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-brand-white"><Waypoints className="size-5" /></span>
            <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tracking ID</p><p className="truncate font-mono text-sm font-semibold text-brand-primary">{request.reference}</p></div>
          </div>
          <Badge className={completed ? "bg-brand-gold text-charcoal hover:bg-brand-gold" : "bg-brand-primary text-brand-white hover:bg-brand-primary"}>{currentStatus}</Badge>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{request.category} <span className="px-1 text-brand-gold">/</span> {request.targetMarket}</p>
        <h3 className="mt-2 max-w-3xl font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">{request.title}</h3>
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold">{stage ? stageLabels[stage] : requestStatus[request.status]}</span>
            <span className="text-muted-foreground">{formatDate(request.createdAt)}</span>
          </div>
          <Progress value={progress} aria-label={`Request progress: ${currentStatus}`} className="h-2 bg-brand-primary/10 [&>div]:bg-brand-primary" />
          {stage && <ol className="mt-3 grid grid-cols-5 gap-1" aria-label="Engagement stages">
            {stages.map((item, index) => {
              const done = completed || index < stageIndex;
              const current = !completed && index === stageIndex;
              return <li key={item} className={`text-[10px] leading-tight sm:text-xs ${current ? "font-semibold text-brand-primary" : done ? "text-charcoal" : "text-muted-foreground/70"}`}><span className={`mb-1 block h-1 rounded-full ${done || current ? "bg-brand-primary" : "bg-border"}`} />{item === "introductions" ? "Introductions" : item === "procurement" ? "Procurement" : item === "delivery" ? "Delivery" : item === "bidding" ? "Bidding" : "Review"}</li>;
            })}
          </ol>}
        </div>

        {request.nextAction && <div className="mt-6 flex items-start gap-3 border-l-2 border-brand-gold bg-brand-gold/10 px-4 py-3">
          <Clock3 className="mt-0.5 size-4 shrink-0 text-brand-primary" />
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next from our team</p><p className="mt-1 text-sm font-medium leading-relaxed">{request.nextAction}{request.nextActionDue ? <span className="font-normal text-muted-foreground"> · Due {formatDate(request.nextActionDue)}</span> : null}</p></div>
        </div>}

        {milestones.length > 0 && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {milestones.slice(0, 3).map((milestone) => <span key={milestone.id} className="inline-flex items-center gap-2 text-xs text-muted-foreground"><span className={`flex size-4 items-center justify-center rounded-full ${milestone.isComplete ? "bg-brand-primary text-brand-white" : "border border-brand-gold text-brand-primary"}`}>{milestone.isComplete ? <Check className="size-3" /> : null}</span>{milestone.title}</span>)}
        </div>}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-xs text-muted-foreground">Last request activity is shared in your updates.</p>
          <Button asChild variant="outline" className="border-brand-primary/30 text-brand-primary hover:bg-surface">
            <Link href={`/track/${encodeURIComponent(request.reference)}`}>Open request <ArrowUpRight data-icon="inline-end" /></Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function RequestLine({ request }: { request: ClientRequest }) {
  const status = request.engagementStatus === "completed" ? "Completed" : request.engagementStatus === "on_hold" ? "On hold" : requestStatus[request.status];
  const reference = request.reference;
  return (
    <Link href={`/track/${encodeURIComponent(reference)}`} className="group flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 size-2 shrink-0 rounded-full bg-brand-gold" />
        <div className="min-w-0"><p className="font-medium leading-snug group-hover:text-brand-primary">{request.title}</p><p className="mt-1 text-xs text-muted-foreground">{reference} <span className="px-1 text-brand-gold">·</span> {request.category} <span className="px-1 text-brand-gold">·</span> {formatDate(request.createdAt)}</p></div>
      </div>
      <div className="flex items-center gap-2 pl-5">
        <Badge variant="outline" className="border-brand-primary/20 bg-brand-white text-charcoal">{status}</Badge>
        <ArrowRight className="size-4 text-brand-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function FirstRequestWelcome() {
  return (
    <section className="grid gap-8 rounded-2xl border bg-card p-6 sm:p-9 lg:grid-cols-[1fr_0.75fr] lg:items-center">
      <div><p className="eyebrow">A clearer way to work together</p><h2 className="mt-2 max-w-xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">One request. A clear path forward.</h2><p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">Tell us what you are buying, sourcing, supplying, or moving. We will record the work and keep its progress visible here.</p><Button asChild className="mt-5"><Link href="/portal/requests/new"><FilePlus2 data-icon="inline-start" />Create your first request</Link></Button></div>
      <ol className="grid gap-0 border-l-2 border-brand-gold pl-5">
        {["Share the opportunity", "Our team reviews and coordinates", "Follow progress with your Tracking ID"].map((item, index) => <li key={item} className="relative py-2.5 text-sm font-medium"><span className="absolute -left-[1.63rem] top-3 flex size-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-brand-white">{index + 1}</span>{item}</li>)}
      </ol>
    </section>
  );
}
