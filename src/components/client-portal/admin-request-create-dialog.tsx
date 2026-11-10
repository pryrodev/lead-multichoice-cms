"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
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

const formSteps = [
  { title: "Client", description: "Contact details" },
  { title: "Request", description: "What they need" },
  { title: "Tracking", description: "Starting progress" },
];

export function AdminRequestCreateDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
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
    if (step < formSteps.length) {
      setStep((current) => current + 1);
      return;
    }

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
        setStep(1);
        setOpen(false);
      },
      onError: (error) => toast.error("Could not create client request", { description: error.message }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (nextOpen) setStep(1); }}>
      <DialogTrigger asChild>
        <Button><Plus data-icon="inline-start" />Create request for client</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a tracked client request</DialogTitle>
          <DialogDescription>Create a request for a client. A Tracking ID is generated when you finish.</DialogDescription>
        </DialogHeader>

        <Stepper
          value={step}
          onValueChange={(value) => { if (value < step) setStep(value); }}
          className="items-start"
          aria-label="Request creation steps"
        >
          {formSteps.map((item, index) => (
            <StepperItem key={item.title} step={index + 1} disabled={index + 1 > step} className="min-w-0 flex-1 max-sm:items-start">
              <StepperTrigger className="gap-2 rounded-md p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 max-sm:flex-col max-sm:items-start">
                <StepperIndicator />
                <span className="min-w-0">
                  <StepperTitle className="text-xs sm:text-sm">{item.title}</StepperTitle>
                  <StepperDescription className="mt-0.5 hidden truncate sm:block">{item.description}</StepperDescription>
                </span>
              </StepperTrigger>
              {index < formSteps.length - 1 && <StepperSeparator className="max-sm:mx-0 max-sm:mt-3.5 sm:mx-2" />}
            </StepperItem>
          ))}
        </Stepper>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className={step === 1 ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
              <Field name="clientName" label="Client name" required={step === 1} placeholder="Full name or contact person" />
              <Field name="organization" label="Company or organization" placeholder="Client organization" />
              <Field name="clientEmail" label="Email (optional)" type="email" placeholder="client@company.com" />
              <Field name="clientPhone" label="Phone (optional)" type="tel" placeholder="+250 7XX XXX XXX" />
          </div>

          <div className={step === 2 ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="guest-request-type">Type of support</Label>
                <Select value={requestType} onValueChange={(value: ClientRequestType) => setRequestType(value)}>
                  <SelectTrigger id="guest-request-type"><SelectValue /></SelectTrigger>
                  <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Field name="targetMarket" label="Market" required={step === 2} defaultValue="Rwanda" placeholder="Rwanda or another market" />
              <Field name="title" label="Request title" required={step === 2} minLength={5} placeholder="What does the client need?" />
              <Field name="category" label="Product or service category" required={step === 2} placeholder="e.g. Medical supplies" />
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="guest-request-details">Request details</Label>
                <Textarea id="guest-request-details" name="details" required={step === 2} minLength={20} maxLength={8000} rows={4} placeholder="Describe the client’s requirement or request." />
              </div>
          </div>

          <div className={step === 3 ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
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
                {!availableStatuses.length && <p className="text-xs text-muted-foreground">No active status is set for this request type.</p>}
              </div>
              <Field name="nextAction" label="Next team action (optional)" placeholder="What happens next?" />
              <div className="flex flex-col gap-4 rounded-lg border p-4 sm:col-span-2">
                <h3 className="text-sm font-semibold">First client update</h3>
                <Field name="updateTitle" label="Update title" required={step === 3} defaultValue="Request received" placeholder="e.g. Request received" />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="guest-request-update">Update message</Label>
                  <Textarea id="guest-request-update" name="updateMessage" required={step === 3} minLength={10} maxLength={5000} rows={3} defaultValue="Our team has recorded your request and will share progress here." />
                </div>
              </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => step === 1 ? setOpen(false) : setStep((current) => current - 1)} disabled={create.isPending}>
              {step === 1 ? "Cancel" : <><ArrowLeft className="size-4" /> Back</>}
            </Button>
            <Button type="submit" disabled={create.isPending || (step === formSteps.length && !trackingStatusId)}>
              {step < formSteps.length ? <>Continue <ArrowRight className="size-4" /></> : create.isPending ? "Creating…" : "Create and generate Tracking ID"}
            </Button>
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
