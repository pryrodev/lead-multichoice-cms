"use client";

import { useState, type FormEvent } from "react";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const statuses = query.data?.filter((status) => status.requestType === requestType) ?? [];
  const activeCount = query.data?.filter((status) => status.isActive).length ?? 0;

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

  if (!canManage) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListChecks className="size-4" />
          Manage tracking statuses
          <Badge variant="secondary" className="ml-1">{activeCount}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Tracking status settings</DialogTitle>
          <DialogDescription>Set the progress steps available to staff and visible to clients for each request type.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="status-request-type">Request type</Label>
            <Select value={requestType} onValueChange={(value: ClientRequestType) => setRequestType(value)}>
              <SelectTrigger id="status-request-type"><SelectValue /></SelectTrigger>
              <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <form onSubmit={(event) => void submit(event)} className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tracking-status-name">Status name</Label>
              <Input id="tracking-status-name" name="statusName" required minLength={2} maxLength={100} placeholder="e.g. Supplier verification" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border bg-background px-3 py-2">
              <div><Label htmlFor="tracking-status-terminal">Final status</Label><p className="text-xs text-muted-foreground">Selecting it completes the engagement.</p></div>
              <Switch id="tracking-status-terminal" checked={isTerminal} onCheckedChange={setIsTerminal} />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="tracking-status-description">Client-facing explanation</Label>
              <Textarea id="tracking-status-description" name="statusDescription" maxLength={500} rows={2} placeholder="Briefly explain what this step means for the client." />
            </div>
            <div className="sm:col-span-2"><Button type="submit" disabled={create.isPending}>{create.isPending ? "Adding status..." : "Add status"}</Button></div>
          </form>

          <section aria-label="Statuses for selected request type" className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Progress steps</h3>
              <span className="text-xs text-muted-foreground">Ordered by creation</span>
            </div>
            {query.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading statuses...</p> : query.isError ? (
              <Alert variant="destructive"><AlertTitle>Could not load statuses</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>
            ) : statuses.length ? (
              <ol className="space-y-2">
                {statuses.map((status, index) => (
                  <li key={status.id} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${!status.isActive ? "text-muted-foreground line-through" : ""}`}>{status.name}</p>
                      {status.description && <p className="mt-0.5 text-xs text-muted-foreground">{status.description}</p>}
                    </div>
                    {status.isTerminal && <Badge variant="secondary">Final</Badge>}
                    <Switch checked={status.isActive} disabled={update.isPending} onCheckedChange={(checked) => void toggleStatus(status.id, checked)} aria-label={`${status.isActive ? "Deactivate" : "Activate"} ${status.name}`} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">No statuses for this request type yet.</p>
            )}
            <p className="text-xs text-muted-foreground">Deactivated statuses stay in existing tracking history but can’t be selected for new updates.</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
