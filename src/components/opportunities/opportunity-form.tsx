"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useCreateOpportunity } from "@/lib/api/hooks";
import type { OpportunityStatus, OpportunityType, Priority } from "@/lib/api/types";

const schema = z.object({
  title: z.string().trim().min(3, "Enter a clear opportunity title."),
  type: z.enum([
    "public_tender",
    "institutional_procurement",
    "direct_buyer_requirement",
    "supplier_led",
    "other",
  ]),
  buyer: z.string(),
  source: z.string(),
  sourceUrl: z.string(),
  externalRef: z.string(),
  country: z.string(),
  sector: z.string(),
  description: z.string(),
  requirements: z.string(),
  publishedAt: z.string(),
  deadline: z.string(),
  estimatedValue: z
    .string()
    .transform((v) => (v.trim() ? Number(v) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Enter a valid estimated value."),
  potentialSupplier: z.string(),
  owner: z.string().trim().max(160),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum([
    "new",
    "under_assessment",
    "qualified",
    "pursuing",
    "monitoring",
    "awaiting_information",
    "preparing_submission",
    "submitted",
    "under_evaluation",
    "awarded",
    "not_awarded",
    "withdrawn",
    "closed",
  ]),
  nextAction: z.string(),
  nextActionDue: z.string(),
  closureReason: z.string(),
});

type FormValues = z.input<typeof schema>;

const initialValues: FormValues = {
  title: "",
  type: "public_tender",
  buyer: "",
  source: "",
  sourceUrl: "",
  externalRef: "",
  country: "Rwanda",
  sector: "",
  description: "",
  requirements: "",
  publishedAt: "",
  deadline: "",
  estimatedValue: "",
  potentialSupplier: "",
  owner: "",
  priority: "medium",
  status: "new",
  nextAction: "",
  nextActionDue: "",
  closureReason: "",
};

const typeOptions: [OpportunityType, string][] = [
  ["public_tender", "Public tender"],
  ["institutional_procurement", "Institutional procurement"],
  ["direct_buyer_requirement", "Direct buyer requirement"],
  ["supplier_led", "Supplier-led opportunity"],
  ["other", "Other opportunity"],
];
const statusOptions: [OpportunityStatus, string][] = [
  ["new", "New"],
  ["under_assessment", "Under assessment"],
  ["qualified", "Qualified"],
  ["pursuing", "Pursuing"],
  ["monitoring", "Monitoring"],
  ["awaiting_information", "Awaiting information"],
  ["preparing_submission", "Preparing submission"],
  ["submitted", "Submitted"],
  ["under_evaluation", "Under evaluation"],
  ["awarded", "Awarded"],
  ["not_awarded", "Not awarded"],
  ["withdrawn", "Withdrawn"],
  ["closed", "Closed"],
];

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function OpportunityForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const create = useCreateOpportunity();
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });
  const errors = form.formState.errors;
  const input = (name: keyof FormValues) => ({
    id: name,
    ...form.register(name),
    "aria-invalid": !!errors[name],
  });
  const steps = [
    { title: "Opportunity", description: "What is the opportunity?" },
    { title: "Source & requirements", description: "Where did it come from?" },
    { title: "Assessment & owner", description: "Who follows it up?" },
  ];
  const continueStep = async () => {
    const fields =
      step === 0 ? (["title", "type"] as const) : step === 1 ? (["estimatedValue"] as const) : [];
    const valid = fields.length === 0 || (await form.trigger(fields));
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const onSubmit = async (values: z.output<typeof schema>) => {
    try {
      const opportunity = await create.mutateAsync({
        ...values,
        type: values.type as OpportunityType,
        priority: values.priority as Priority,
        status: values.status as OpportunityStatus,
      });
      toast.success("Opportunity saved", { description: `${opportunity.ref} was added to the opportunity register.` });
      router.push("/admin/opportunities");
    } catch {
      toast.error("Could not add the opportunity", {
        description: "Please review the form and try again.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
            <Link href="/admin/opportunities">
              <ArrowLeft /> Back to opportunities
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-[30px]">
            New opportunity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture what is known now. Add verified details as the team learns more.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border bg-card px-3 py-4 sm:px-5"
        aria-label="Opportunity form progress"
      >
        <Stepper
          value={step + 1}
          onValueChange={(value) => {
            if (value <= step + 1) setStep(value - 1);
          }}
          className="items-start"
        >
          {steps.map((item, index) => (
            <StepperItem
              key={item.title}
              step={index + 1}
              disabled={index > step}
              className="min-w-0 flex-1 max-md:items-start"
            >
              <StepperTrigger className="gap-3 rounded-lg p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 max-md:flex-col max-md:items-start max-md:gap-2">
                <StepperIndicator />
                <span className="min-w-0 md:-order-1">
                  <StepperTitle className="truncate text-xs sm:text-sm">{item.title}</StepperTitle>
                  <StepperDescription className="mt-0.5 hidden truncate md:block">
                    {item.description}
                  </StepperDescription>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 && (
                <StepperSeparator className="max-md:mx-0 max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 0 && (
          <>
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="font-display text-lg">Opportunity details</CardTitle>
                <CardDescription>
                  Start with what the opportunity is and who is purchasing.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="title" label="Opportunity title *" error={errors.title?.message}>
                    <Input
                      {...input("title")}
                      placeholder="e.g. Supply of solar water pumping systems"
                    />
                  </Field>
                </div>
                <Field id="type" label="Opportunity type *">
                  <Select
                    value={form.watch("type")}
                    onValueChange={(v) =>
                      form.setValue("type", v as FormValues["type"], {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(([v, label]) => (
                        <SelectItem key={v} value={v}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  id="buyer"
                  label="Buyer / purchasing entity"
                  hint="Leave blank if not identified yet."
                >
                  <Input {...input("buyer")} placeholder="Organization name" />
                </Field>
                <Field id="country" label="Country or market">
                  <Input {...input("country")} placeholder="e.g. Rwanda" />
                </Field>
                <Field id="sector" label="Sector">
                  <Input {...input("sector")} placeholder="e.g. Healthcare, energy, IT" />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="description" label="Opportunity summary">
                    <Textarea
                      {...form.register("description")}
                      id="description"
                      placeholder="What is being requested or offered?"
                      className="min-h-24"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 1 && (
          <>
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="font-display text-lg">Source and requirements</CardTitle>
                <CardDescription>
                  Record where the information came from so it can be checked later.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="source"
                  label="Official source / portal"
                  hint="For example, a procurement portal or direct buyer contact."
                >
                  <Input {...input("source")} placeholder="Source name" />
                </Field>
                <Field id="externalRef" label="External reference">
                  <Input {...input("externalRef")} placeholder="Reference shown by the source" />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    id="sourceUrl"
                    label="Official opportunity link"
                    hint="A link only; information is not imported automatically."
                  >
                    <Input {...input("sourceUrl")} type="url" placeholder="https://" />
                  </Field>
                </div>
                <Field id="publishedAt" label="Publication date">
                  <Input {...input("publishedAt")} type="date" />
                </Field>
                <Field
                  id="deadline"
                  label="Submission / response deadline"
                  hint="Only enter a date confirmed by the source."
                >
                  <Input {...input("deadline")} type="date" />
                </Field>
                <Field
                  id="estimatedValue"
                  label="Estimated value (USD)"
                  hint="Optional. Record only when sourced and appropriate."
                >
                  <Input
                    {...input("estimatedValue")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Not known"
                  />
                </Field>
                <Field id="potentialSupplier" label="Potential supplier / manufacturer">
                  <Input {...input("potentialSupplier")} placeholder="Can be added later" />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="requirements" label="Requirements and eligibility notes">
                    <Textarea
                      {...form.register("requirements")}
                      id="requirements"
                      placeholder="Key specifications, documents, eligibility, or questions to verify"
                      className="min-h-24"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Assessment and responsibility
                </CardTitle>
                <CardDescription>
                  Make ownership and the next follow-up clear from the start.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field id="owner" label="Internal owner" hint="Leave blank to assign this to your account." error={errors.owner?.message}>
                  <Input {...input("owner")} placeholder="Defaults to you" />
                </Field>
                <Field id="priority" label="Priority">
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(v) =>
                      form.setValue("priority", v as FormValues["priority"], {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="status" label="Initial status">
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) =>
                      form.setValue("status", v as FormValues["status"], {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(([v, label]) => (
                        <SelectItem key={v} value={v}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="nextAction" label="Next action">
                  <Input {...input("nextAction")} placeholder="What needs to happen next?" />
                </Field>
                <Field id="nextActionDue" label="Next action due date">
                  <Input {...input("nextActionDue")} type="date" />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    id="closureReason"
                    label="Decision / closure reason"
                    hint="Use when declining or closing an opportunity; do not imply an award without confirmation."
                  >
                    <Textarea
                      {...form.register("closureReason")}
                      id="closureReason"
                      placeholder="Optional at initial capture"
                      className="min-h-20"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length} · Required fields are marked with *.
          </p>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((current) => current - 1)}
              >
                <ArrowLeft /> Back
              </Button>
            ) : (
              <Button asChild type="button" variant="outline">
                <Link href="/admin/opportunities">Cancel</Link>
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button type="button" onClick={continueStep}>
                Continue <ArrowRight />
              </Button>
            ) : (
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? (
                  "Adding…"
                ) : (
                  <>
                    <Save /> Add opportunity
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
