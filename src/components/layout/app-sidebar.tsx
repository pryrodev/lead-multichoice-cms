"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Briefcase,
  ClipboardList,
  FilePenLine,
  Gavel,
  LayoutDashboard,
  Images,
  ImagePlus,
  Link as LinkIcon,
  Languages,
  Settings,
  Truck,
  UserRoundSearch,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const overview = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Opportunities", url: "/admin/opportunities", icon: ClipboardList },
  { title: "Client requests", url: "/admin/client-requests", icon: UserRoundSearch },
  { title: "Engagements", url: "/admin/engagements", icon: Briefcase },
  { title: "Tender tracking", url: "/admin/tenders", icon: Gavel },
  { title: "Logistics", url: "/admin/logistics", icon: Truck },
] as const;

const website = [
  { title: "CMS dashboard", url: "/admin/content", icon: LayoutDashboard },
  { title: "Homepage editor", url: "/admin/content/home", icon: FilePenLine },
  { title: "Website copy", url: "/admin/content/copy", icon: Languages },
  { title: "Website images", url: "/admin/content/visuals", icon: ImagePlus },
  { title: "Procurement resources", url: "/admin/content/resources", icon: LinkIcon },
  { title: "Media library", url: "/admin/content/media", icon: Images },
] as const;

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function AppSidebar({ staffMode = false }: { staffMode?: boolean }) {
  const path = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-14 items-center justify-between gap-3 px-3">
          <Image
            src="/lead_multi-choice_logo.png"
            alt="LEAD MULTI-CHOICE ®"
            width={512}
            height={191}
            priority
            className="h-9 w-auto max-w-[180px] object-contain object-left group-data-[collapsible=icon]:hidden"
          />
          <div className="hidden h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white group-data-[collapsible=icon]:block">
            <Image
              src="/lead_multi-choice_logo.png"
              alt=""
              width={512}
              height={191}
              className="h-9 w-auto max-w-none"
            />
          </div>
          <SidebarTrigger className="h-9 w-9 shrink-0 rounded-xl border bg-card shadow-sm" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!staffMode && <SidebarGroupLabel>Overview</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {(staffMode ? overview.filter((i) => i.url === "/admin/client-requests") : overview).map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={path === i.url} tooltip={i.title}>
                    <Link href={i.url}>
                      <i.icon />
                      <span>{i.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!staffMode && <SidebarGroup>
          <SidebarGroupLabel>Website CMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {website.map((item) => <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                  <Link href={item.url}><item.icon /><span>{item.title}</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>}
        {!staffMode && <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path === "/admin/activity"} tooltip="Activity log">
                  <Link href="/admin/activity">
                    <Activity />
                    <span>Activity log</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                  2
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>}
        {!staffMode && <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={path === "/admin/settings"} tooltip="Settings">
                <Link href="/admin/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>}
      </SidebarContent>
    </Sidebar>
  );
}
