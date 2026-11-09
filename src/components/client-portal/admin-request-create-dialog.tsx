"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAdminClientRequest } from "@/features/client-portal/hooks";
import { useTrackingStatuses } from "@/features/client-portal/tracking-statuses-hooks";
import type { ClientRequestType, CreateAdminClientRequest, EngagementStage } from "@/features/client-portal/types";

const requestTypes: Array<[ClientRequestType, string]> = [
  ["buying", "Buying / purchasing"],
  ["selling", "Selling / supplier offer"],
  ["sourcing", "Supplier search / sourcing"],
  ["bidding", "Tender / bidding support"],
  ["shipping", "Shipping / logistics"],
  ["market_access", "Market access / representation"],
  ["partnership", "Business partnership"],
  ["other", "Other client request"],
];

const stages: Array<[EngagementStage, string]> = [
  ["connect", "Request review & identification"],
  ["introductions", "Buyer and supplier introductions"],
  ["bidding", "Tender and bid coordination"],
  ["procurement", "Procurement and logistics"],
  ["delivery", "Delivery and follow-up"],
];

export function AdminRequestCreateDialog() {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<ClientRequestType>("other");
  const [stage, setStage] = useState<EngagementStage>("connect");
  const [trackingStatusId, setTrackingStatusId] = useState("");
  const create = useCreateAdminClientRequest();
  const statuses = useTrackingStatuses();
  const availableStatuses = useMemo(
    () => statuses.data?.filter((status) => status.requestType === requestType && status.isActive) ?? [],
    [requestType, statuses.data],
  );

  useEffect(() => {
    if (!availableStatuses.some((status) => status.id === trackingStatusId)) {
      setTrackingStatusId(availableStatuses[0]?.id ?? "");
    }
  }, [availableStatuses, trackingStatusId]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const input: CreateAdminClientRequest = {
      clientName: String(values.get("clientName") ?? ""),
      organization: String(values.get("organization") ?? ""),
      clientEmail: String(values.get("clientEmail") ?? ""),
      clientPhone: String(values.get("clientPhone") ?? ""),
      requestType,
      title: String(values.get("title") ?? ""),
      category: String(values.get("category") ?? ""),
      targetMarket: String(values.get("targetMarket") ?? "Rwanda"),
      details: String(values.get("details") ?? ""),
      stage,
      trackingStatusId,
      nextAction: String(values.get("nextAction") ?? ""),
      updateTitle: String(values.get("updateTitle") ?? ""),
      updateMessage: String(values.get("updateMessage") ?? ""),
    };

    create.mutate(input, {
      onSuccess: (result) => {
        toast.success("Client request is ready to track", {
          description: `Tracking ID ${result.reference} — share this ID with ${input.clientName}.`,
          duration: 10_000,
        });
        form.reset();
        setRequestType("other");
        setStage("connect");
        setTrackingStatusId("");
        setOpen(false);
      },
      onError: (error) => toast.error("Could not create client request", { description: error.message }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus data-icon="inline-start" />Create request for client</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a tracked client request</DialogTitle>
          <DialogDescription>Record any trade support request, with or without a client account. The system creates a Tracking ID and starts its progress timeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="clientName" label="Client name" required placeholder="Full name or contact person" />
            <Field name="organization" label="Company or organization" placeholder="Client organization" />
            <Field name="clientEmail" label="Email (optional)" type="email" placeholder="client@company.com" />
            <Field name="clientPhone" label="Phone (optional)" type="tel" placeholder="+250 7XX XXX XXX" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="guest-request-type">Type of support</Label>
              <Select value={requestType} onValueChange={(value: ClientRequestType) => setRequestType(value)}>
                <SelectTrigger id="guest-request-type"><SelectValue /></SelectTrigger>
                <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Field name="targetMarket" label="Market" required defaultValue="Rwanda" placeholder="Rwanda or another market" />
            <Field name="title" label="Request title" required minLength={5} placeholder="What does the client need?" />
            <Field name="category" label="Product or service category" required placeholder="e.g. Medical supplies" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="guest-request-details">Request details</Label>
            <Textarea id="guest-request-details" name="details" required minLength={20} maxLength={8000} rows={4} placeholder="Describe the requirement, offer, bid, supplier search, shipment, market access support, timing, and any relevant specifications." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="guest-request-stage">Starting stage</Label>
              <Select value={stage} onValueChange={(value: EngagementStage) => setStage(value)}>
                <SelectTrigger id="guest-request-stage"><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="guest-request-tracking-status">Starting client status</Label>
              <Select value={trackingStatusId} onValueChange={setTrackingStatusId} disabled={!availableStatuses.length}>
                <SelectTrigger id="guest-request-tracking-status"><SelectValue placeholder={statuses.isPending ? "Loading statuses..." : "Create a status first"} /></SelectTrigger>
                <SelectContent>{availableStatuses.map((status) => <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>)}</SelectContent>
              </Select>
              {!availableStatuses.length && <p className="text-xs text-muted-foreground">An admin must create an active status for this request type before it can be tracked.</p>}
            </div>
            <Field name="nextAction" label="Next team action (optional)" placeholder="What happens next?" />
          </div>

          <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div><h3 className="text-sm font-semibold">First client-visible update</h3><p className="mt-1 text-xs text-muted-foreground">This appears as soon as the client tracks their ID.</p></div>
            <Field name="updateTitle" label="Update title" required defaultValue="Request received" placeholder="e.g. Request received" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="guest-request-update">Update message</Label>
              <Textarea id="guest-request-update" name="updateMessage" required minLength={10} maxLength={5000} rows={3} defaultValue="Our team has recorded your request and will share progress here." />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={create.isPending}>Cancel</Button>
            <Button type="submit" disabled={create.isPending || !trackingStatusId}>{create.isPending ? "Creating…" : "Create and generate Tracking ID"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ name, label, type = "text", required, minLength, defaultValue, placeholder }: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = `guest-request-${name}`;
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label><Input id={id} name={name} type={type} required={required} minLength={minLength} defaultValue={defaultValue} placeholder={placeholder} /></div>;
}
