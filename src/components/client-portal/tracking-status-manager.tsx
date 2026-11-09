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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTrackingStatus, useTrackingStatuses, useUpdateTrackingStatus } from "@/features/client-portal/tracking-statuses-hooks";
import type { ClientRequestType } from "@/features/client-portal/types";

const requestTypes: Array<[ClientRequestType, string]> = [
  ["buying", "Buying / purchasing"],
  ["selling", "Selling / supplier offer"],
  ["sourcing", "Supplier search / sourcing"],
  ["bidding", "Tender / bidding support"],
  ["shipping", "Shipping / logistics"],
  ["market_access", "Market access / representation"],
  ["partnership", "Business partnership"],
  ["other", "Other client request"],
  ["buyer_request", "Buyer request"],
  ["supplier_offer", "Supplier offer"],
];

export function TrackingStatusManager({ canManage }: { canManage: boolean }) {
  const query = useTrackingStatuses();
  const create = useCreateTrackingStatus();
  const update = useUpdateTrackingStatus();
  const [requestType, setRequestType] = useState<ClientRequestType>("buying");
  const [isTerminal, setIsTerminal] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      await create.mutateAsync({
        requestType,
        name: String(values.get("statusName") ?? "").trim(),
        description: String(values.get("statusDescription") ?? "").trim(),
        isTerminal,
      });
      form.reset();
      setIsTerminal(false);
      toast.success("Tracking status created");
    } catch (error) {
      toast.error("Could not create tracking status", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  async function toggleStatus(id: string, isActive: boolean) {
    try {
      await update.mutateAsync({ id, isActive });
      toast.success(isActive ? "Status activated" : "Status deactivated");
    } catch (error) {
      toast.error("Could not update status", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Tracking statuses</CardTitle>
        <CardDescription>Set the client-facing progress steps for each type of request. Staff select one when posting an update.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {canManage && <form onSubmit={(event) => void submit(event)} className="grid gap-4 rounded-lg border bg-muted/20 p-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="status-request-type">Request type</Label>
            <Select value={requestType} onValueChange={(value: ClientRequestType) => setRequestType(value)}>
              <SelectTrigger id="status-request-type"><SelectValue /></SelectTrigger>
              <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tracking-status-name">Status name</Label>
            <Input id="tracking-status-name" name="statusName" required minLength={2} maxLength={100} placeholder="e.g. Supplier verification" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="tracking-status-description">Client-facing explanation</Label>
            <Textarea id="tracking-status-description" name="statusDescription" maxLength={500} rows={2} placeholder="Briefly explain what this step means for the client." />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border bg-background px-3 py-2 md:col-span-2">
            <div><Label htmlFor="tracking-status-terminal">Final status</Label><p className="text-xs text-muted-foreground">Mark the engagement complete when staff select this status.</p></div>
            <Switch id="tracking-status-terminal" checked={isTerminal} onCheckedChange={setIsTerminal} />
          </div>
          <div className="md:col-span-2"><Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating..." : "Add status"}</Button></div>
        </form>}

        {query.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading tracking statuses...</p> : query.isError ? (
          <Alert variant="destructive"><AlertTitle>Could not load statuses</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>
        ) : query.data.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {requestTypes.map(([type, label]) => {
              const statuses = query.data.filter((status) => status.requestType === type);
              if (!statuses.length) return null;
              return (
                <section key={type} className="rounded-lg border p-4" aria-label={`${label} tracking statuses`}>
                  <h3 className="font-semibold">{label}</h3>
                  <ol className="mt-3 space-y-2">
                    {statuses.map((status, index) => (
                      <li key={status.id} className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2">
                        <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${!status.isActive ? "text-muted-foreground line-through" : ""}`}>{status.name}</p>
                          {status.description && <p className="mt-0.5 text-xs text-muted-foreground">{status.description}</p>}
                        </div>
                        {status.isTerminal && <Badge variant="secondary">Final</Badge>}
                        {canManage && <Switch checked={status.isActive} onCheckedChange={(checked) => void toggleStatus(status.id, checked)} aria-label={`${status.isActive ? "Deactivate" : "Activate"} ${status.name}`} />}
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        ) : (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No tracking statuses yet. Add statuses before creating tracked requests.</p>
        )}
        <p className="text-xs text-muted-foreground">Deactivating a status hides it from new updates while preserving it in existing client tracking history.</p>
      </CardContent>
    </Card>
  );
}
