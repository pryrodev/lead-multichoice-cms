"use client";

import Link from "next/link";
import { Activity, ArrowRight, BriefcaseBusiness, CircleCheck, Clock3, FilePlus2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientOverview } from "@/features/client-portal/hooks";
import type { ClientRequestStatus, EngagementStage } from "@/features/client-portal/types";

const stageLabels: Record<EngagementStage, string> = {
  connect: "Request review & identification",
  introductions: "Buyer and supplier introductions",
  bidding: "Tender and bid coordination",
  procurement: "Procurement and logistics",
  delivery: "Delivery and after-sales",
};
const stageProgress: Record<EngagementStage, number> = {
  connect: 20,
  introductions: 40,
  bidding: 60,
  procurement: 80,
  delivery: 100,
};
const requestStatus: Record<ClientRequestStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Engagement started",
  declined: "Closed",
};
const formatDate = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
const formatDateTime = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function ClientDashboard() {
  const query = useClientOverview();
  if (query.isPending) return <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"><Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-72 rounded-2xl lg:col-span-2" /></div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load your requests</AlertTitle><AlertDescription className="flex flex-wrap items-center justify-between gap-3">{query.error.message}<Button variant="outline" size="sm" onClick={() => void query.refetch()}><RefreshCw data-icon="inline-start" />Try again</Button></AlertDescription></Alert>;

  const { user, requests, updates, milestones } = query.data;
  const activeEngagements = requests.filter((request) => request.engagementId && request.engagementStatus === "active").length;
  const latestUpdate = updates[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{user.organization}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Track your sourcing requests and follow each update from our trade facilitation team.</p>
        </div>
        <Button asChild><Link href="/portal/requests/new"><FilePlus2 data-icon="inline-start" />Submit a request</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">My requests</CardTitle><FilePlus2 className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="font-display text-3xl font-semibold">{requests.length}</p><p className="mt-1 text-xs text-muted-foreground">Sourcing needs and supplier offers submitted</p></CardContent></Card>
        <Card><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active engagements</CardTitle><BriefcaseBusiness className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="font-display text-3xl font-semibold">{activeEngagements}</p><p className="mt-1 text-xs text-muted-foreground">Requests currently being coordinated</p></CardContent></Card>
        <Card><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Latest team update</CardTitle><Activity className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-sm font-semibold">{latestUpdate ? formatDate(latestUpdate.createdAt) : "No updates yet"}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{latestUpdate?.title ?? "We will post progress here when a request enters an engagement."}</p></CardContent></Card>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader><CardTitle>Your requests</CardTitle><CardDescription>Each reference follows your request from submission through any resulting engagement.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {requests.length === 0 ? (
              <div className="rounded-xl border border-dashed px-5 py-10 text-center">
                <FilePlus2 className="mx-auto size-8 text-muted-foreground" />
                <h2 className="mt-3 font-medium">No requests submitted yet</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Tell us what you need to source or which manufacturers you represent.</p>
                <Button asChild className="mt-4"><Link href="/portal/requests/new">Create your first request<ArrowRight data-icon="inline-end" /></Link></Button>
              </div>
            ) : requests.map((request) => {
              const stage = request.engagementStage;
              const requestMilestones = request.engagementId ? milestones.filter((item) => item.engagementId === request.engagementId) : [];
              return (
                <article key={request.id} className="rounded-xl border p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0"><p className="font-mono text-xs text-muted-foreground">{request.reference} <span className="px-1">·</span>{formatDate(request.createdAt)}</p><h2 className="mt-1 text-base font-semibold">{request.title}</h2><p className="mt-1 text-sm text-muted-foreground">{request.category} · {request.targetMarket}</p></div>
                    <Badge variant={request.status === "declined" ? "destructive" : request.engagementId ? "default" : "secondary"}>{requestStatus[request.status]}</Badge>
                  </div>
                  {stage ? <div className="mt-5"><div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-medium">{stageLabels[stage]}</span><span className="text-muted-foreground">{request.engagementReference}</span></div><Progress value={stageProgress[stage]} aria-label={`Engagement progress: ${stageLabels[stage]}`} /><div className="mt-4 flex flex-col gap-2">{request.nextAction && <p className="text-sm"><span className="text-muted-foreground">Next step: </span>{request.nextAction}{request.nextActionDue ? ` · Due ${formatDate(request.nextActionDue)}` : ""}</p>}{requestMilestones.map((milestone) => <p key={milestone.id} className="flex items-center gap-2 text-sm text-muted-foreground"><CircleCheck className={milestone.isComplete ? "size-4 text-primary" : "size-4 opacity-40"} />{milestone.title}{milestone.dueDate ? ` · ${formatDate(milestone.dueDate)}` : ""}</p>)}</div></div> : <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" />Our team will review this request and contact you with the next step.</p>}
                </article>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Engagement updates</CardTitle><CardDescription>Updates shared by your LEAD MULTICHOICE contact.</CardDescription></CardHeader>
          <CardContent>
            {updates.length === 0 ? <div className="rounded-xl bg-muted/50 px-4 py-8 text-center"><Activity className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Your updates will appear here</p><p className="mt-1 text-sm text-muted-foreground">Once a request becomes an engagement, you can follow its progress here.</p></div> : <ol className="flex flex-col gap-5">{updates.map((update) => <li key={update.id} className="relative border-l pl-4 last:border-l-transparent"><span className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" /><p className="text-xs text-muted-foreground">{formatDateTime(update.createdAt)}{update.authorName ? ` · ${update.authorName}` : ""}</p><h3 className="mt-1 text-sm font-semibold">{update.title}</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{update.message}</p></li>)}</ol>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
