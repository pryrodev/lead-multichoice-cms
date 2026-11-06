import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AdminWorkspace } from "@/components/layout/admin-workspace";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let user;
  try {
    user = await getSessionUser();
  } catch {
    redirect("/portal/login?next=%2Fadmin");
  }
  if (!user) redirect("/portal/login?next=%2Fadmin");
  if (user.role !== "admin" && !(user.role === "staff" && user.canManageEngagements)) redirect("/portal");
  return <AdminWorkspace staffMode={user.role === "staff"}>{children}</AdminWorkspace>;
}
