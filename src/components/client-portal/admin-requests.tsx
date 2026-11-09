"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ChevronDown, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import type { ClientRequestType, EngagementStage } from "@/features/client-portal/types";

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
          {engagementId ? "Post update" : "Start tracking"}
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

export function AdminClientRequests({ canManageStatuses = false }: { canManageStatuses?: boolean }) {
  const query = useAdminClientRequests();
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);

  if (query.isPending)
    return <div className="flex flex-col gap-4">{[1, 2, 3].map((key) => <Skeleton key={key} className="h-36 rounded-2xl" />)}</div>;
  if (query.isError)
    return <Alert variant="destructive"><AlertTitle>Could not load client requests</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;

  const requests = query.data;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-[30px]">Client requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Record and follow buying, selling, sourcing, bidding, logistics, and other client needs.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TrackingStatusManager canManage={canManageStatuses} />
          <AdminRequestCreateDialog />
        </div>
      </div>

      {requests.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="font-medium">No client requests yet</p><p className="mt-1 text-sm text-muted-foreground">New submissions will appear here for the team to review.</p></CardContent></Card>
      ) : requests.map((request) => {
        const isOpen = openRequestId === request.id;
        return (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{request.reference} <span aria-hidden="true">·</span> {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(request.createdAt))}</p>
                <CardTitle className="mt-1 text-lg">{request.title}</CardTitle>
                <CardDescription className="mt-1">{request.category} <span aria-hidden="true">·</span> {request.targetMarket}</CardDescription>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Badge variant={request.engagementId ? "default" : "secondary"}>
                  {request.engagementReference ? request.currentTrackingStatusName ?? request.engagementStage ?? "Engagement active" : request.status.replaceAll("_", " ")}
                </Badge>
                <RequestActions
                  key={`${request.id}-${request.engagementId ?? "new"}`}
                  requestId={request.id}
                  engagementId={request.engagementId}
                  initialStage={request.engagementStage}
                  requestType={request.requestType}
                  initialTrackingStatusId={request.currentTrackingStatusId}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t pt-3 text-sm">
                <p className="min-w-0"><span className="font-medium">{request.clientName}</span>{request.organization && <span className="text-muted-foreground"> <span aria-hidden="true">·</span> {request.organization}</span>}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="capitalize">{request.requestType.replaceAll("_", " ")}</span>
                  <span>{request.clientId ? "Account linked" : "Guest client"}</span>
                </div>
                <Collapsible open={isOpen} onOpenChange={(open) => setOpenRequestId(open ? request.id : null)} className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="-ml-2 mt-1 h-8 gap-1.5 px-2 text-muted-foreground">
                      {isOpen ? "Hide request details" : "View request details"}
                      <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 grid gap-4 border-t pt-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client contact</p>
                        <p className="text-sm">{request.clientEmail || "No email provided"}{request.clientPhone ? ` · ${request.clientPhone}` : ""}</p>
                        <p className="text-xs text-muted-foreground">{request.clientId ? "Linked client account" : "No account needed; Tracking ID is shared directly"}</p>
                      </div>
                      <div className="space-y-1"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request type</p><p className="text-sm capitalize">{request.requestType.replaceAll("_", " ")}</p></div>
                      <div className="sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request details</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{request.details}</p></div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
