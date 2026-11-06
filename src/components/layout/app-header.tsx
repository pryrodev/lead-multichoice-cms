"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search, Settings2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { initials } from "@/components/layout/app-sidebar";
import { toast } from "sonner";
import { usePortalLogout, usePortalUser } from "@/features/client-portal/hooks";
import { useRouter } from "next/navigation";

const labelFromSegment = (segment: string) =>
  segment.replace(/[-_]+/g, " ").replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

export function AppHeader({ staffMode = false }: { staffMode?: boolean }) {
  const pathname = usePathname();
  const { data: auth } = usePortalUser();
  const signOut = usePortalLogout();
  const router = useRouter();
  const profile = auth?.user ?? { name: "Operations", email: "", organization: "", role: "admin" as const, id: "" };
  const routeParts = pathname.split("/").filter(Boolean);
  const adminParts = routeParts[0] === "admin" ? routeParts.slice(1) : routeParts;
  const breadcrumbs = adminParts.length
    ? adminParts.map((segment, index) => ({
        label: labelFromSegment(segment),
        href: `/admin/${adminParts.slice(0, index + 1).join("/")}`,
      }))
    : [{ label: "Dashboard", href: "/admin" }];

  return (
    <header className="flex h-14 w-full shrink-0 items-center bg-transparent px-3 md:px-6">
      <div className="relative flex h-full min-w-0 flex-1 items-center gap-4">
        <SidebarTrigger className="h-9 w-9 shrink-0 rounded-xl border bg-card shadow-sm md:hidden" />
        <Breadcrumb className="shrink-0">
          <BreadcrumbList className="flex-nowrap text-sm">
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/admin">Home</Link></BreadcrumbLink></BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1
                    ? <BreadcrumbPage className="font-medium text-primary">{breadcrumb.label}</BreadcrumbPage>
                    : <BreadcrumbLink asChild><Link href={breadcrumb.href}>{breadcrumb.label}</Link></BreadcrumbLink>}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <label className="absolute left-1/2 hidden w-[min(30vw,420px)] -translate-x-1/2 lg:block" aria-label="Search records">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
          <Input placeholder="Search…" className="h-10 rounded-xl border-0 bg-muted/80 pl-10 shadow-sm placeholder:text-muted-foreground" />
        </label>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Notifications" className="relative h-9 w-9 rounded-xl bg-card shadow-sm">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold ring-2 ring-card" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-1 rounded-full px-1.5 pr-2" aria-label="Open profile menu">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary text-sm font-medium text-secondary-foreground">{initials(profile.name)}</AvatarFallback></Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel><span className="block text-sm">{profile.name}</span><span className="block truncate text-xs font-normal text-muted-foreground">{profile.email}</span></DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!staffMode && <DropdownMenuItem asChild><Link href="/admin/settings"><Settings2 aria-hidden="true" />Profile & settings</Link></DropdownMenuItem>}
              <DropdownMenuItem
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive focus:text-destructive-foreground"
                onClick={() => signOut.mutate(undefined, { onSuccess: () => router.replace("/portal/login"), onError: (error) => toast.error(error.message) })}
              >
                <LogOut aria-hidden="true" />Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
