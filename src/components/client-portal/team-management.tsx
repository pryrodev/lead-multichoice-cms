"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useCreateStaff, useStaffMembers, useUpdateStaff } from "@/lib/api/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import type { StaffMember } from "@/lib/api/types";

export function TeamManagement() {
  const query = useStaffMembers();
  const create = useCreateStaff();
  const update = useUpdateStaff();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const columns: DataTableColumn<StaffMember>[] = [
    {
      id: "name",
      header: "Staff member",
      className: "min-w-40 font-medium",
      cell: (member) => member.name,
    },
    {
      id: "email",
      header: "Work email",
      className: "min-w-52 text-muted-foreground",
      cell: (member) => member.email,
    },
    {
      id: "status",
      header: "Account",
      cell: (member) => (
        <Badge variant={member.isActive ? "secondary" : "outline"}>
          {member.isActive ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      id: "permission",
      header: "Client requests & updates",
      className: "min-w-52",
      cell: (member) => (
        <Switch
          checked={member.canManageEngagements}
          disabled={update.isPending || !member.isActive}
          onCheckedChange={(checked) =>
            update.mutate(
              { id: member.id, canManageEngagements: checked },
              {
                onSuccess: () => toast.success("Staff permission updated"),
                onError: (error) => toast.error(error.message),
              },
            )
          }
          aria-label={`Allow ${member.name} to manage client requests and updates`}
        />
      ),
    },
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await create.mutateAsync({ ...form, organization: "Lead Multi-Choice ® Ltd" });
      setForm({ name: "", email: "", password: "" });
      toast.success("Staff account created", {
        description: "Engagement access is disabled until you grant it below.",
      });
    } catch (error) {
      toast.error("Could not create staff account", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-base font-semibold">Team access</h2>
        <p className="text-sm text-muted-foreground">
          Create staff accounts and grant permission to create client requests and publish tracking
          updates.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add staff member</CardTitle>
          <CardDescription>
            Use a temporary password and share it securely with the staff member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Full name</Label>
              <Input
                id="staff-name"
                required
                minLength={2}
                maxLength={160}
                placeholder="Staff member name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">Work email</Label>
              <Input
                id="staff-email"
                type="email"
                required
                maxLength={254}
                placeholder="name@leadmultichoice.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="staff-password">Temporary password</Label>
              <Input
                id="staff-password"
                type="password"
                required
                minLength={14}
                maxLength={128}
                placeholder="At least 14 characters"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>
            <Button type="submit" disabled={create.isPending} className="sm:col-span-2">
              {create.isPending ? "Creating…" : "Create staff account"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {query.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : query.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load team</AlertTitle>
          <AlertDescription>{query.error.message}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Staff members</CardTitle>
            <CardDescription>
              Only staff with engagement access can enter the client request workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ReusableTable
              rows={query.data}
              columns={columns}
              getRowId={(member) => member.id}
              emptyMessage="No staff accounts yet."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
