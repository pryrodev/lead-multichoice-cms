"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardList, Clock3, UsersRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminClientRequests } from "@/features/client-portal/hooks";

const statusLabel = (status: string) => status.replaceAll("_", " ");
const formatDate = (date: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));

export function AdminOverview() {
  const query = useAdminClientRequests();
  if (query.isPending) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((key) => <Skeleton key={key} className="h-32 rounded-2xl" />)}<Skeleton className="h-80 rounded-2xl sm:col-span-2 lg:col-span-4" /></div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load operations data</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;

  const requests = query.data;
  const awaitingReview = requests.filter((request) => request.status === "submitted" || request.status === "in_review").length;
  const activeEngagements = requests.filter((request) => request.engagementId && request.engagementStatus === "active").length;
  const buyers = requests.filter((request) => request.clientRole === "buyer").length;
  const suppliers = requests.filter((request) => request.clientRole === "supplier").length;
  const metrics = [
    { label: "Client requests", value: requests.length, detail: "All account submissions", icon: ClipboardList },
    { label: "Awaiting review", value: awaitingReview, detail: "Submitted or in review", icon: Clock3 },
    { label: "Active engagements", value: activeEngagements, detail: "Linked to client requests", icon: BriefcaseBusiness },
    { label: "Buyer / supplier requests", value: `${buyers} / ${suppliers}`, detail: "Requests grouped by account type", icon: UsersRound },
  ];

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-muted-foreground">Live client requests and their trade facilitation engagements.</p><Button asChild><Link href="/admin/client-requests">Review client requests<ArrowRight data-icon="inline-end" /></Link></Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Card key={metric.label}><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{metric.label}</CardTitle><metric.icon className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="font-display text-3xl font-semibold">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p></CardContent></Card>)}</div>
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle>Recent client requests</CardTitle><CardDescription>Submissions from buyer and supplier accounts, newest first.</CardDescription></div><Button asChild variant="outline" size="sm"><Link href="/admin/client-requests">View request queue<ArrowRight data-icon="inline-end" /></Link></Button></CardHeader>
      <CardContent className="flex flex-col gap-3">
        {requests.length === 0 ? <div className="rounded-xl border border-dashed px-5 py-12 text-center"><ClipboardList className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-3 font-medium">No client requests yet</h2><p className="mt-1 text-sm text-muted-foreground">Customer submissions will appear here when they create an account and send a request.</p></div> : requests.slice(0, 6).map((request) => <Link href="/admin/client-requests" key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"><div className="min-w-0"><p className="font-mono text-xs text-muted-foreground">{request.reference} · {formatDate(request.createdAt)}</p><p className="mt-1 truncate font-medium">{request.title}</p><p className="mt-1 text-sm text-muted-foreground">{request.organization} · {request.clientName}</p></div><div className="flex items-center gap-2"><Badge variant={request.engagementId ? "default" : "secondary"}>{request.engagementStage ?? statusLabel(request.status)}</Badge><ArrowRight className="size-4 text-muted-foreground" /></div></Link>)}
      </CardContent>
    </Card>
  </div>;
}
