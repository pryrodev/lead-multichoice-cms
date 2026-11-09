"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AdminRequestCreateDialog } from "@/components/client-portal/admin-request-create-dialog";
import { TrackingStatusManager } from "@/components/client-portal/tracking-status-manager";
import { useAdminClientRequests, useCreateEngagement, usePostEngagementUpdate } from "@/features/client-portal/hooks";
import { useTrackingStatuses } from "@/features/client-portal/tracking-statuses-hooks";
import type { AdminClientRequest, ClientRequestType, EngagementStage } from "@/features/client-portal/types";

function RequestActions({
  requestId,
  engagementId,
  initialStage,
  requestType,
  initialTrackingStatusId,
}: {
  requestId: string;
  engagementId: string | null;
  initialStage: EngagementStage | null;
  requestType: ClientRequestType;
  initialTrackingStatusId: string | null;
}) {
  const create = useCreateEngagement();
  const post = usePostEngagementUpdate();
  const [nextAction, setNextAction] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [trackingStatusId, setTrackingStatusId] = useState(initialTrackingStatusId ?? "");
  const [open, setOpen] = useState(false);
  const trackingStatuses = useTrackingStatuses();
  const availableStatuses = useMemo(
    () => trackingStatuses.data?.filter((status) => status.requestType === requestType && status.isActive) ?? [],
    [requestType, trackingStatuses.data],
  );

  useEffect(() => {
    if (!availableStatuses.some((status) => status.id === trackingStatusId)) {
      setTrackingStatusId(availableStatuses[0]?.id ?? "");
    }
  }, [availableStatuses, trackingStatusId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!engagementId) {
        const result = await create.mutateAsync({
          requestId,
          stage: initialStage ?? "connect",
          trackingStatusId,
          nextAction,
          updateTitle: title,
          updateMessage: message,
        });
        toast.success("Tracking started", { description: result.reference });
      } else {
        await post.mutateAsync({
          engagementId,
          trackingStatusId,
          ...(nextAction ? { nextAction } : {}),
          title,
          message,
          type: "progress",
        });
        toast.success("Client update posted");
      }
      setTitle("");
      setMessage("");
      setNextAction("");
      setOpen(false);
    } catch (error) {
      toast.error("Could not save this update", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={engagementId ? "outline" : "default"} size="sm" className="gap-2">
          <MessageSquarePlus className="size-4" />
          {engagementId ? "Update" : "Start tracking"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{engagementId ? "Post a client update" : "Start tracking this request"}</DialogTitle>
          <DialogDescription>Choose the current client-facing status and share a clear progress note.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`tracking-status-${requestId}`}>Client-visible status</Label>
            <Select value={trackingStatusId} onValueChange={setTrackingStatusId} disabled={!availableStatuses.length}>
              <SelectTrigger id={`tracking-status-${requestId}`}>
                <SelectValue placeholder={trackingStatuses.isPending ? "Loading statuses..." : "No active statuses"} />
              </SelectTrigger>
              <SelectContent>{availableStatuses.map((status) => <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>)}</SelectContent>
            </Select>
            {!availableStatuses.length && <p className="text-xs text-muted-foreground">An admin must add an active status for this request type.</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`title-${requestId}`}>Update title</Label>
              <Input id={`title-${requestId}`} required minLength={3} maxLength={220} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Supplier shortlist prepared" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`next-${requestId}`}>Next action <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id={`next-${requestId}`} value={nextAction} maxLength={500} onChange={(event) => setNextAction(event.target.value)} placeholder="What will happen next?" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`message-${requestId}`}>Update for the client</Label>
            <Textarea id={`message-${requestId}`} required minLength={10} maxLength={5000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Explain the progress and any action required from the client." />
          </div>
          <Button type="submit" disabled={create.isPending || post.isPending || !trackingStatusId}>
            {create.isPending || post.isPending ? "Saving..." : engagementId ? "Publish client update" : "Start tracking and publish update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RequestDetails({ request }: { request: AdminClientRequest }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-1.5">
          <Eye className="size-4" /> Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{request.title}</DialogTitle>
          <DialogDescription>{request.reference} · {request.category} · {request.targetMarket}</DialogDescription>
        </DialogHeader>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</dt><dd className="mt-1 text-sm font-medium">{request.clientName}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organization</dt><dd className="mt-1 text-sm">{request.organization || "Not provided"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 break-all text-sm">{request.clientEmail || "Not provided"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</dt><dd className="mt-1 text-sm">{request.clientPhone || "Not provided"}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request type</dt><dd className="mt-1 text-sm capitalize">{request.requestType.replaceAll("_", " ")}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</dt><dd className="mt-1 text-sm">{request.clientId ? "Linked client account" : "Guest client · Tracking ID shared directly"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request details</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{request.details}</dd></div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function RequestProgressBadge({ request }: { request: AdminClientRequest }) {
  const isComplete = request.engagementStatus === "completed";
  const isActive = Boolean(request.engagementId);
  const label = request.currentTrackingStatusName ?? request.engagementStage ?? request.status.replaceAll("_", " ");
  const tone = isComplete
    ? "border-brand-gold/40 bg-brand-gold/20 text-foreground"
    : isActive
      ? "border-brand-primary/20 bg-brand-primary/10 text-primary"
      : "border-border bg-muted/70 text-muted-foreground";

  return (
    <span className={`inline-flex max-w-44 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-tight ${tone}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${isComplete ? "bg-brand-gold" : isActive ? "bg-brand-primary" : "bg-muted-foreground/60"}`} aria-hidden="true" />
      <span className="line-clamp-2">{label}</span>
    </span>
  );
}

const requestTypes: Array<[ClientRequestType | "all", string]> = [
  ["all", "All request types"],
  ["buying", "Buying"],
  ["selling", "Selling"],
  ["sourcing", "Sourcing"],
  ["bidding", "Bidding"],
  ["shipping", "Shipping"],
  ["market_access", "Market access"],
  ["partnership", "Partnership"],
  ["other", "Other"],
  ["buyer_request", "Buyer request"],
  ["supplier_offer", "Supplier offer"],
];

export function AdminClientRequests({ canManageStatuses = false }: { canManageStatuses?: boolean }) {
  const query = useAdminClientRequests();
  const [requestTypeFilter, setRequestTypeFilter] = useState<ClientRequestType | "all">("all");
  const [trackingFilter, setTrackingFilter] = useState("all");

  const requests = query.data ?? [];
  const filteredRequests = useMemo(() => requests.filter((request) => {
    const matchesType = requestTypeFilter === "all" || request.requestType === requestTypeFilter;
    const matchesTracking = trackingFilter === "all" || (trackingFilter === "active" ? Boolean(request.engagementId) : !request.engagementId);
    return matchesType && matchesTracking;
  }), [requests, requestTypeFilter, trackingFilter]);

  const columns = useMemo<DataTableColumn<AdminClientRequest>[]>(() => [
    {
      id: "reference",
      header: "Tracking ID",
      className: "min-w-36",
      cell: (request) => <span className="inline-flex max-w-40 break-all rounded-md border border-brand-primary/15 bg-brand-primary/[0.055] px-2 py-1 font-mono text-[0.68rem] font-semibold leading-relaxed text-primary">{request.reference}</span>,
    },
    {
      id: "request",
      header: "Request",
      className: "min-w-56",
      cell: (request) => <div className="max-w-sm"><p className="font-medium text-foreground">{request.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{request.category} · {request.targetMarket}</p></div>,
    },
    {
      id: "client",
      header: "Client",
      className: "min-w-44",
      cell: (request) => <div><p className="font-medium">{request.clientName}</p><p className="mt-0.5 text-xs text-muted-foreground">{request.organization || (request.clientId ? "Client account" : "Guest client")}</p></div>,
    },
    {
      id: "type",
      header: "Type",
      className: "min-w-28",
      cell: (request) => <span className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-1 text-xs font-medium capitalize text-foreground">{request.requestType.replaceAll("_", " ")}</span>,
    },
    {
      id: "progress",
      header: "Progress",
      className: "min-w-36",
      cell: (request) => <RequestProgressBadge request={request} />,
    },
    {
      id: "submitted",
      header: "Submitted",
      className: "min-w-28 whitespace-nowrap",
      cell: (request) => <time className="text-sm text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(request.createdAt))}</time>,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "min-w-44 text-right",
      cell: (request) => (
        <div className="flex items-center justify-end gap-1">
          <RequestDetails request={request} />
          <RequestActions
            key={`${request.id}-${request.engagementId ?? "new"}`}
            requestId={request.id}
            engagementId={request.engagementId}
            initialStage={request.engagementStage}
            requestType={request.requestType}
            initialTrackingStatusId={request.currentTrackingStatusId}
          />
        </div>
      ),
    },
  ], []);

  if (query.isPending) return <Skeleton className="h-[26rem] rounded-xl" />;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load client requests</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-end gap-2">
        <TrackingStatusManager canManage={canManageStatuses} />
        <AdminRequestCreateDialog />
      </div>
      <DataTable
        data={filteredRequests}
        columns={columns}
        getRowId={(request) => request.id}
        getSearchText={(request) => [request.reference, request.title, request.category, request.targetMarket, request.clientName, request.organization, request.requestType].join(" ")}
        searchPlaceholder="Search by Tracking ID, request, or client..."
        resetKey={`${requestTypeFilter}:${trackingFilter}`}
        emptyMessage={requests.length ? "No requests match these filters." : "No client requests have been submitted yet."}
        toolbar={(
          <>
            <Select value={requestTypeFilter} onValueChange={(value: ClientRequestType | "all") => setRequestTypeFilter(value)}>
              <SelectTrigger className="w-[170px] border-brand-primary/15 bg-brand-white/90 shadow-sm shadow-brand-primary/5" aria-label="Filter by request type"><SelectValue /></SelectTrigger>
              <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={trackingFilter} onValueChange={setTrackingFilter}>
              <SelectTrigger className="w-[160px] border-brand-primary/15 bg-brand-white/90 shadow-sm shadow-brand-primary/5" aria-label="Filter by tracking status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All progress</SelectItem>
                <SelectItem value="active">Tracking active</SelectItem>
                <SelectItem value="awaiting">Awaiting tracking</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      />
    </div>
  );
}
