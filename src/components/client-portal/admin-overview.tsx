"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardList, Clock3, UsersRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminClientRequests } from "@/features/client-portal/hooks";
import type { AdminClientRequest } from "@/features/client-portal/types";
import { getTrackingStatusTone } from "@/features/client-portal/status-color";

const statusLabel = (status: string) => status.replaceAll("_", " ");
const formatDate = (date: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));

export function AdminOverview() {
  const query = useAdminClientRequests();
  if (query.isPending) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((key) => <Skeleton key={key} className="h-32 rounded-2xl" />)}<Skeleton className="h-80 rounded-2xl sm:col-span-2 lg:col-span-4" /></div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load operations data</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;

  const requests = query.data;
  const awaitingReview = requests.filter((request) => request.status === "submitted" || request.status === "in_review").length;
  const activeEngagements = requests.filter((request) => request.engagementId && request.engagementStatus === "active").length;
  const guestRequests = requests.filter((request) => request.clientId === null).length;
  const metrics = [
    { label: "Tracked client requests", value: requests.length, detail: "Across all types of client support", icon: ClipboardList },
    { label: "Awaiting review", value: awaitingReview, detail: "Submitted or in review", icon: Clock3 },
    { label: "Active engagements", value: activeEngagements, detail: "Linked to client requests", icon: BriefcaseBusiness },
    { label: "No-account clients", value: guestRequests, detail: "Tracked by ID without sign-in", icon: UsersRound },
  ];
  const recentRequestColumns: DataTableColumn<AdminClientRequest>[] = [
    {
      id: "request",
      header: "Request",
      className: "min-w-64",
      cell: (request) => <div className="min-w-0"><p className="max-w-[28rem] truncate font-medium text-foreground">{request.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{request.reference} · {formatDate(request.createdAt)}</p></div>,
    },
    {
      id: "client",
      header: "Client",
      className: "min-w-44",
      cell: (request) => <div><p className="font-medium">{request.organization || "Individual client"}</p><p className="mt-1 text-xs text-muted-foreground">{request.clientName}</p></div>,
    },
    {
      id: "progress",
      header: "Progress",
      className: "min-w-36",
      cell: (request) => {
        const label = request.currentTrackingStatusName ?? request.engagementStage ?? statusLabel(request.status);
        const tone = request.engagementStatus === "completed" ? "complete" : request.engagementStatus === "cancelled" || request.status === "declined" ? "cancelled" : request.engagementStatus === "on_hold" ? "paused" : undefined;
        return <span className={`inline-flex max-w-40 rounded-md px-2 py-1 text-xs font-semibold capitalize ${getTrackingStatusTone(label, tone)}`}><span className="truncate">{label}</span></span>;
      },
    },
    {
      id: "action",
      header: "",
      className: "w-12 text-right",
      cell: () => <Button asChild variant="ghost" size="icon" aria-label="Open request queue"><Link href="/admin/client-requests"><ArrowRight className="size-4" /></Link></Button>,
    },
  ];

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-muted-foreground">Live client requests and their trade facilitation engagements.</p><Button asChild><Link href="/admin/client-requests">Review client requests<ArrowRight data-icon="inline-end" /></Link></Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Card key={metric.label}><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{metric.label}</CardTitle><metric.icon className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="font-display text-3xl font-semibold">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p></CardContent></Card>)}</div>
    <Card className="rounded-md shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle>Recent client requests</CardTitle><CardDescription>Requests submitted by clients or recorded by the team, newest first.</CardDescription></div><Button asChild variant="outline" size="sm"><Link href="/admin/client-requests">View request queue<ArrowRight data-icon="inline-end" /></Link></Button></CardHeader>
      <CardContent className="px-0 pb-0">
        <DataTable
          data={requests}
          columns={recentRequestColumns}
          getRowId={(request) => request.id}
          getSearchText={(request) => [request.reference, request.title, request.organization, request.clientName, request.currentTrackingStatusName, request.engagementStage].filter(Boolean).join(" ")}
          searchPlaceholder="Search recent requests..."
          emptyMessage="No client requests have been submitted yet."
          pageSizeOptions={[5, 10, 20]}
          className="rounded-md border-0 bg-transparent shadow-none"
        />
      </CardContent>
    </Card>
  </div>;
}
