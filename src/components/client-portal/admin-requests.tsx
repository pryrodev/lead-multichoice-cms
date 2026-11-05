"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAdminClientRequests, useCreateEngagement, usePostEngagementUpdate } from "@/features/client-portal/hooks";
import type { EngagementStage } from "@/features/client-portal/types";

const stages: Array<[EngagementStage, string]> = [
  ["connect", "Request review & identification"],
  ["introductions", "Buyer and supplier introductions"],
  ["bidding", "Tender and bid coordination"],
  ["procurement", "Procurement and logistics"],
  ["delivery", "Delivery and after-sales"],
];

function RequestActions({ requestId, engagementId, initialStage }: { requestId: string; engagementId: string | null; initialStage: EngagementStage | null }) {
  const create = useCreateEngagement();
  const post = usePostEngagementUpdate();
  const [stage, setStage] = useState<EngagementStage>(initialStage ?? "connect");
  const [nextAction, setNextAction] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!engagementId) {
        const result = await create.mutateAsync({ requestId, stage, nextAction, updateTitle: title, updateMessage: message });
        toast.success("Engagement started", { description: result.reference });
      } else {
        await post.mutateAsync({ engagementId, stage, ...(nextAction ? { nextAction } : {}), title, message, type: "progress" });
        toast.success("Client update posted");
      }
      setTitle("");
      setMessage("");
      setNextAction("");
    } catch (error) {
      toast.error("Could not save this update", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 flex flex-col gap-4 border-t pt-5">
      <h3 className="text-sm font-semibold">{engagementId ? "Post a client update" : "Start an engagement"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2"><Label htmlFor={`stage-${requestId}`}>Current stage</Label><Select value={stage} onValueChange={(value: EngagementStage) => setStage(value)}><SelectTrigger id={`stage-${requestId}`}><SelectValue /></SelectTrigger><SelectContent>{stages.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex flex-col gap-2"><Label htmlFor={`next-${requestId}`}>Next action <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id={`next-${requestId}`} value={nextAction} maxLength={500} onChange={(event) => setNextAction(event.target.value)} placeholder="What will happen next?" /></div>
      </div>
      <div className="flex flex-col gap-2"><Label htmlFor={`title-${requestId}`}>Update title</Label><Input id={`title-${requestId}`} required minLength={3} maxLength={220} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Supplier shortlist prepared" /></div>
      <div className="flex flex-col gap-2"><Label htmlFor={`message-${requestId}`}>Update for the client</Label><Textarea id={`message-${requestId}`} required minLength={10} maxLength={5000} rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Explain the progress and any action required from the client." /></div>
      <Button type="submit" className="w-fit" disabled={create.isPending || post.isPending}>{create.isPending || post.isPending ? "Saving…" : engagementId ? "Post update" : "Create engagement and notify client"}</Button>
    </form>
  );
}

export function AdminClientRequests() {
  const query = useAdminClientRequests();
  if (query.isPending) return <div className="flex flex-col gap-4">{[1, 2, 3].map((key) => <Skeleton key={key} className="h-56 rounded-2xl" />)}</div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load client requests</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;
  const requests = query.data;

  return <div className="flex flex-col gap-5">
    <div><h1 className="font-display text-2xl font-semibold tracking-tight md:text-[30px]">Client requests</h1><p className="mt-1 text-sm text-muted-foreground">Review incoming buyer and supplier requests, then share progress through a client engagement.</p></div>
    {requests.length === 0 ? <Card><CardContent className="py-12 text-center"><p className="font-medium">No client requests yet</p><p className="mt-1 text-sm text-muted-foreground">New submissions will appear here for the team to review.</p></CardContent></Card> : requests.map((request) => <Card key={request.id}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-xs text-muted-foreground">{request.reference} · {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(request.createdAt))}</p><CardTitle className="mt-1 text-lg">{request.title}</CardTitle><CardDescription>{request.category} · {request.targetMarket}</CardDescription></div><Badge variant={request.engagementId ? "default" : "secondary"}>{request.engagementReference ? `${request.engagementReference} · ${request.engagementStage}` : request.status.replaceAll("_", " ")}</Badge></CardHeader>
      <CardContent><div className="grid gap-4 border-y py-4 sm:grid-cols-2"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Submitted by</p><p className="mt-1 text-sm font-medium">{request.clientName} · {request.organization}</p><p className="text-sm text-muted-foreground">{request.clientEmail} · {request.clientRole}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Request type</p><p className="mt-1 text-sm capitalize">{request.requestType.replaceAll("_", " ")}</p></div><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:col-span-2">{request.details}</p></div><RequestActions key={`${request.id}-${request.engagementId ?? "new"}`} requestId={request.id} engagementId={request.engagementId} initialStage={request.engagementStage} /></CardContent>
    </Card>)}
  </div>;
}
