import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { profileQuery, settingsQuery, useProfile, useSettings, useUpdateProfile, useUpdateSettings } from "@/lib/api/hooks";
import { PageShell } from "@/components/layout/page";
import { initials } from "@/components/layout/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Profile, Settings } from "@/lib/api/types";

const ROLES = ["Operations Manager", "Management", "Procurement Officer", "Logistics Coordinator", "External Supplier", "External Partner"];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LEAD MULTICHOICE Ltd" },
      { name: "description", content: "Profile, notification and system preferences." },
      { property: "og:title", content: "Settings — LEAD MULTICHOICE Ltd" },
      { property: "og:description", content: "Profile, notification and system preferences." },
    ],
  }),
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([qc.ensureQueryData(profileQuery), qc.ensureQueryData(settingsQuery)]).then(() => undefined),
  component: SettingsPage,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function SettingsPage() {
  return (
    <PageShell title="Settings" subtitle="Your profile, notifications and system preferences">
      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileForm /></TabsContent>
        <TabsContent value="notifications"><NotificationsForm /></TabsContent>
        <TabsContent value="system"><SystemForm /></TabsContent>
      </Tabs>
    </PageShell>
  );
}

function ProfileForm() {
  const profile = useProfile();
  const save = useUpdateProfile();
  const [f, setF] = useState<Profile>(profile);
  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Profile</CardTitle>
        <CardDescription>How you appear to colleagues and partners.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-lg text-primary-foreground">{initials(f.name || "?")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{f.name}</div>
            <div className="text-sm text-muted-foreground">{f.role}</div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={f.name} onChange={set("name")} /></div>
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={f.email} onChange={set("email")} /></div>
          <div className="space-y-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" value={f.phone} onChange={set("phone")} /></div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={f.role} onValueChange={(role) => setF({ ...f, role })}>
              <SelectTrigger><SelectValue>{f.role}</SelectValue></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <Button disabled={save.isPending} onClick={() => {
          if (!f.name.trim()) { toast.error("Name is required"); return; }
          save.mutate(f, { onSuccess: () => toast.success("Profile saved"), onError: () => toast.error("Could not save profile") });
        }}>Save profile</Button>
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
  const rows: [keyof Settings, string, string][] = [
    ["emailAlerts", "Deadline email alerts", "Email me when a tender or milestone deadline is approaching."],
    ["blockerAlerts", "Blocker alerts", "Notify me immediately when a blocker is logged on my engagements."],
    ["weeklyDigest", "Weekly management digest", "A Monday summary of pipeline, clearances and attention items."],
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Notifications</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {rows.map(([k, label, desc]) => (
          <div key={k} className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div><div className="font-medium">{label}</div><div className="text-sm text-muted-foreground">{desc}</div></div>
            <Switch checked={f[k] as boolean} onCheckedChange={(v) => setF({ ...f, [k]: v })} aria-label={label} />
          </div>
        ))}
        <Button disabled={pending} onClick={submit}>Save notifications</Button>
      </CardContent>
    </Card>
  );
}

function SystemForm() {
  const { f, setF, submit, pending } = useSettingsForm();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">System</CardTitle>
        <CardDescription>Values used across the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="rate">USD → RWF exchange rate</Label>
            <Input id="rate" type="number" min={1} value={f.usdToRwf} onChange={(e) => setF({ ...f, usdToRwf: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="warn">Deadline warning (days)</Label>
            <Input id="warn" type="number" min={1} value={f.deadlineWarningDays} onChange={(e) => setF({ ...f, deadlineWarningDays: Number(e.target.value) })} />
          </div>
        </div>
        <Button disabled={pending} onClick={() => {
          if (!(f.usdToRwf > 0) || !(f.deadlineWarningDays > 0)) { toast.error("Values must be greater than zero"); return; }
          submit();
        }}>Save system settings</Button>
      </CardContent>
    </Card>
  );
}
