"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, BellRing, Building2, ChevronRight, Globe2, LockKeyhole, Pencil, PlugZap, Save, Settings2, ShieldCheck, Upload, UserRound, UsersRound, X } from "lucide-react";
import { toast } from "sonner";
import { useCompanySettings, useProfile, useSettings, useUpdateCompanySettings, useUpdateProfile, useUpdateSettings } from "@/lib/api/hooks";
import { PageShell } from "@/components/layout/page";
import { initials } from "@/components/layout/app-sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CompanySettings, Profile, Settings } from "@/lib/api/types";
import { TeamManagement } from "@/components/client-portal/team-management";

const ROLES = ["Operations Manager", "Management", "Procurement Officer", "Logistics Coordinator", "External Supplier", "External Partner"];

type SettingsCategory = "profile" | "company" | "notifications" | "team" | "security" | "integrations" | "localization" | "system";

const settingsCategories: { id: SettingsCategory; label: string; icon: typeof UserRound; available: boolean }[] = [
  { id: "profile", label: "Profile", icon: UserRound, available: true },
  { id: "company", label: "Company", icon: Building2, available: true },
  { id: "notifications", label: "Notifications", icon: BellRing, available: true },
  { id: "team", label: "Team", icon: UsersRound, available: true },
  { id: "security", label: "Privacy & Security", icon: ShieldCheck, available: false },
  { id: "integrations", label: "Integrations", icon: PlugZap, available: false },
  { id: "localization", label: "Localization", icon: Globe2, available: false },
  { id: "system", label: "System", icon: Settings2, available: true },
];

export default function SettingsPage() {
  const [active, setActive] = useState<SettingsCategory>("company");
  const activeCategory = settingsCategories.find((category) => category.id === active)!;
  return (
    <PageShell title="Settings" subtitle="Choose a category to manage company and account preferences.">
      <div className="grid min-w-0 gap-6 md:grid-cols-[190px_minmax(0,1fr)] md:gap-8">
        <aside className="min-w-0 border-b pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-5">
          <nav aria-label="Settings categories" className="flex gap-1 overflow-x-auto md:flex-col">
            {settingsCategories.map(({ id, label, icon: Icon, available }) => (
              <Button key={id} type="button" variant="ghost" aria-current={active === id ? "page" : undefined}
                className={`h-9 shrink-0 justify-start gap-2 px-2.5 text-sm ${active === id ? "bg-secondary font-medium text-primary hover:bg-secondary" : available ? "text-muted-foreground" : "text-muted-foreground/60"}`}
                onClick={() => setActive(id)}>
                <Icon className="size-4" aria-hidden="true" />{label}{active === id && <ChevronRight className="ml-auto size-4" aria-hidden="true" />}
              </Button>
            ))}
          </nav>
        </aside>
        <section className="min-w-0" aria-labelledby="settings-section-title">
          {active === "company" ? <CompanySettingsForm /> : active === "profile" ? <ProfileForm /> : active === "notifications" ? <NotificationsForm /> : active === "team" ? <TeamManagement /> : active === "system" ? <SystemForm /> : <UnavailableCategory category={activeCategory.label} icon={activeCategory.icon} />}
        </section>
      </div>
    </PageShell>
  );
}

function UnavailableCategory({ category, icon: Icon }: { category: string; icon: typeof UserRound }) {
  return <Card><CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><Icon className="size-8 text-muted-foreground" aria-hidden="true" /><h2 id="settings-section-title" className="mt-3 font-display text-lg font-semibold">{category}</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">These settings are not configured yet.</p></CardContent></Card>;
}

function CompanySettingsForm() {
  const query = useCompanySettings();
  if (query.isPending) return <div className="space-y-4" role="status" aria-label="Loading company settings"><div className="h-12 animate-pulse rounded-md bg-muted" /><div className="h-20 animate-pulse rounded-md bg-muted" /><div className="h-20 animate-pulse rounded-md bg-muted" /><div className="h-20 animate-pulse rounded-md bg-muted" /></div>;
  if (query.isError) return <Alert variant="destructive"><AlertTitle>Could not load company settings</AlertTitle><AlertDescription className="flex flex-wrap items-center justify-between gap-3">{query.error.message}<Button type="button" variant="outline" size="sm" onClick={() => void query.refetch()}>Try again</Button></AlertDescription></Alert>;
  return <CompanySettingsEditor settings={query.data} />;
}

function CompanySettingsEditor({ settings }: { settings: CompanySettings }) {
  const update = useUpdateCompanySettings();
  const [form, setForm] = useState<CompanySettings>(settings);

  const saveField = async (key: keyof CompanySettings, value: string) => {
    const updated = await update.mutateAsync({ ...form, [key]: value });
    setForm(updated);
    toast.success("Company details saved");
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-3 border-b pb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground"><Building2 className="size-5" aria-hidden="true" /></span>
        <div><h2 id="settings-section-title" className="font-display text-base font-semibold">Company Settings</h2><p className="text-sm text-muted-foreground">Customize and edit essential company details.</p></div>
      </div>
      <div className="divide-y divide-border">
        <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)] sm:items-center sm:gap-6">
          <div><p className="text-sm font-medium">Upload Logo</p><p className="text-xs text-muted-foreground">Min 400×400px. PNG or JPEG formats.</p></div>
          <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center overflow-hidden rounded-full border bg-muted/40"><Image src="/lead_multi-choice_logo.png" alt="LEAD MULTI-CHOICE ® logo" width={512} height={191} className="h-auto w-10 object-contain" /></span><Button asChild type="button" variant="outline" size="sm"><Link href="/admin/content/media"><Upload data-icon="inline-start" />Manage media</Link></Button></div>
        </div>
        <CompanySettingsRow id="legalName" label="Legal Name" description="The official legal name of your company." value={form.legalName} placeholder="Enter the registered company name" onSave={(value) => saveField("legalName", value)} />
        <CompanySettingsRow id="taxId" label="Tax ID Number" description="Registered in the official jurisdiction of your company." value={form.taxId} placeholder="Add a tax identification number" onSave={(value) => saveField("taxId", value)} />
        <CompanySettingsRow id="companyEmail" label="Email Address" description="The official email address for billing and contact requests." value={form.email} placeholder="Add a company email address" type="email" onSave={(value) => saveField("email", value)} />
        <CompanySettingsRow id="companyPhone" label="Phone Number" description="The phone number for billing and contact requests." value={form.phone} placeholder="Add a company phone number" type="tel" onSave={(value) => saveField("phone", value)} />
        <CompanySettingsRow id="legalAddress" label="Legal Address" description="The official residential address for billing details and shipments." value={form.legalAddress} placeholder="Add the registered company address" multiline onSave={(value) => saveField("legalAddress", value)} />
        <CompanySettingsRow id="websiteUrl" label="Web Links" description="Links to your company website and social media accounts." value={form.websiteUrl} placeholder="https://example.com" type="url" onSave={(value) => saveField("websiteUrl", value)} />
      </div>
    </div>
  );
}

function CompanySettingsRow({
  id, label, description, value, placeholder, type = "text", multiline = false, onSave,
}: {
  id: string;
  label: string;
  description: string;
  value: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  onSave: (value: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const cancel = () => { setDraft(value); setEditing(false); };
  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
    } catch (error) {
      toast.error("Could not save company detail", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)] sm:items-start sm:gap-6">
      <div><Label htmlFor={id} className="text-sm font-medium">{label}</Label><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></div>
      <div className="min-w-0">
        {editing ? <div className="space-y-2">{multiline ? <Textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} rows={3} /> : <Input id={id} type={type} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} />}
          <div className="flex gap-2"><Button type="button" size="sm" onClick={() => void save()} disabled={saving}><Save data-icon="inline-start" />{saving ? "Saving…" : "Save"}</Button><Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={saving}><X data-icon="inline-start" />Cancel</Button></div>
        </div> : <><p className={`break-words text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{value || "Not set"}</p><Button type="button" variant="link" size="sm" className="mt-1 h-auto p-0 text-primary" onClick={() => setEditing(true)}><Pencil className="mr-1 size-3.5" aria-hidden="true" />Edit<ChevronRight className="ml-0.5 size-3.5" aria-hidden="true" /></Button></>}
      </div>
    </div>
  );
}

function ProfileForm() {
  const profile = useProfile();
  const save = useUpdateProfile();
  const [f, setF] = useState<Profile>(profile);
  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Card><CardHeader><CardTitle className="font-display">Profile</CardTitle><CardDescription>How you appear to colleagues and partners.</CardDescription></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4"><Avatar className="h-14 w-14 rounded-lg"><AvatarFallback className="rounded-lg bg-primary text-lg text-primary-foreground">{initials(f.name || "?")}</AvatarFallback></Avatar><div><div className="font-medium">{f.name}</div><div className="text-sm text-muted-foreground">{f.role}</div></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={f.name} onChange={set("name")} /></div>
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={f.email} onChange={set("email")} /></div>
          <div className="space-y-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" value={f.phone} onChange={set("phone")} /></div>
          <div className="space-y-1.5"><Label>Role</Label><Select value={f.role} onValueChange={(role) => setF({ ...f, role })}><SelectTrigger><SelectValue>{f.role}</SelectValue></SelectTrigger><SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <Button disabled={save.isPending} onClick={() => { if (!f.name.trim()) { toast.error("Name is required"); return; } save.mutate(f, { onSuccess: () => toast.success("Profile saved"), onError: () => toast.error("Could not save profile") }); }}>Save profile</Button>
      </CardContent>
    </Card>
  );
}

function useSettingsForm() {
  const settings = useSettings();
  const save = useUpdateSettings();
  const [f, setF] = useState<Settings>(settings);
  const submit = () => save.mutate(f, { onSuccess: () => toast.success("Settings saved"), onError: () => toast.error("Could not save settings") });
  return { f, setF, submit, pending: save.isPending };
}

function NotificationsForm() {
  const { f, setF, submit, pending } = useSettingsForm();
  const rows: [keyof Settings, string, string][] = [["emailAlerts", "Deadline email alerts", "Email me when a tender or milestone deadline is approaching."], ["blockerAlerts", "Blocker alerts", "Notify me when a blocker is logged on my engagements."], ["weeklyDigest", "Weekly management digest", "A Monday summary of pipeline, clearances and attention items."]];
  return <Card><CardHeader><CardTitle className="font-display">Notifications</CardTitle></CardHeader><CardContent className="space-y-4">{rows.map(([k, label, desc]) => <div key={k} className="flex items-center justify-between gap-4 rounded-lg border p-4"><div><div className="font-medium">{label}</div><div className="text-sm text-muted-foreground">{desc}</div></div><Switch checked={f[k] as boolean} onCheckedChange={(v) => setF({ ...f, [k]: v })} aria-label={label} /></div>)}<Button disabled={pending} onClick={submit}>Save notifications</Button></CardContent></Card>;
}

function SystemForm() {
  const { f, setF, submit, pending } = useSettingsForm();
  return <Card><CardHeader><CardTitle className="font-display">System</CardTitle><CardDescription>Values used across the dashboard.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="rate">USD → RWF exchange rate</Label><Input id="rate" type="number" min={1} value={f.usdToRwf} onChange={(e) => setF({ ...f, usdToRwf: Number(e.target.value) })} /></div><div className="space-y-1.5"><Label htmlFor="warn">Deadline warning (days)</Label><Input id="warn" type="number" min={1} value={f.deadlineWarningDays} onChange={(e) => setF({ ...f, deadlineWarningDays: Number(e.target.value) })} /></div></div><Button disabled={pending} onClick={() => { if (!(f.usdToRwf > 0) || !(f.deadlineWarningDays > 0)) { toast.error("Values must be greater than zero"); return; } submit(); }}>Save system settings</Button></CardContent></Card>;
}
