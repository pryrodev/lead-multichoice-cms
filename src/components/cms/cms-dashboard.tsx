"use client";

import Link from "next/link";
import { ArrowUpRight, Eye, FilePenLine, ImagePlus, Images, Languages, Link as LinkIcon, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CmsContentItem } from "@/lib/cms/dashboard";

const contentIcons = {
  home: FilePenLine,
  "site-copy": Languages,
  "site-visuals": ImagePlus,
  "procurement-resources": LinkIcon,
  media: Images,
} as const;

const formatDate = (date: string | null) => date
  ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Kigali" }).format(new Date(date))
  : "Not edited yet";

export function CmsDashboard({ items }: { items: CmsContentItem[] }) {
  const drafts = items.filter((item) => item.status === "Draft").length;
  const published = items.filter((item) => item.status === "Published").length;
  const rows = items;

  const columns: DataTableColumn<CmsContentItem>[] = [
    {
      id: "content",
      header: "Content",
      className: "min-w-64",
      cell: (item) => {
        const Icon = contentIcons[item.id];
        return <div className="flex items-start gap-3"><span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-primary"><Icon className="size-4" /></span><div className="min-w-0"><Link href={item.href} className="font-semibold text-foreground hover:text-brand-primary hover:underline">{item.title}</Link><p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p></div></div>;
      },
    },
    {
      id: "status",
      header: "Workflow",
      className: "whitespace-nowrap",
      cell: (item) => <Badge className={item.status === "Draft" ? "bg-brand-gold text-charcoal hover:bg-brand-gold" : item.status === "Published" ? "bg-brand-primary text-brand-white hover:bg-brand-primary" : "border border-brand-primary/20 bg-brand-white text-muted-foreground hover:bg-brand-white"}>{item.status}</Badge>,
    },
    { id: "updated", header: "Last modified", className: "min-w-40 whitespace-nowrap text-sm text-muted-foreground", cell: (item) => formatDate(item.updatedAt) },
    { id: "editor", header: "Modified by", className: "min-w-32 text-sm text-muted-foreground", cell: (item) => item.modifiedBy || "—" },
    {
      id: "action",
      header: "",
      className: "w-24 text-right",
      cell: (item) => <Button asChild variant="ghost" size="sm" className="text-brand-primary"><Link href={item.href}>Edit <ArrowUpRight className="size-4" /></Link></Button>,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl bg-brand-primary text-brand-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(var(--brand-white)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div className="flex flex-wrap items-end justify-between gap-5 px-6 py-6 sm:px-8 sm:py-7">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-gold">CONTENT OVERVIEW</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Your website, in one place.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-white/85">Edit content, review saved drafts, and publish updates to the public website.</p>
          </div>
          <Button asChild className="bg-brand-white text-brand-primary hover:bg-brand-white/90"><Link href="/" target="_blank">View live website <Eye data-icon="inline-end" /></Link></Button>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Published areas" value={published} detail="Visible on the website" icon={Send} tone="blue" />
        <SummaryCard label="Draft changes" value={drafts} detail="Saved, awaiting publication" icon={FilePenLine} tone="gold" />
        <SummaryCard label="Media assets" value={items.find((item) => item.id === "media")?.assetCount ?? 0} detail="Available to website editors" icon={Images} tone="white" />
      </div>

      <section className="overflow-hidden rounded-xl border bg-card" aria-labelledby="cms-content-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4 sm:px-6">
          <div><p className="eyebrow">Content inventory</p><h2 id="cms-content-heading" className="mt-1 font-display text-xl font-semibold">Website content</h2></div>
          <Button asChild variant="outline" size="sm"><Link href="/admin/content/media"><Images data-icon="inline-start" />Open media library</Link></Button>
        </div>
        <div className="p-4 sm:p-5">
          <Tabs defaultValue="all">
            <TabsList className="mb-4 h-auto flex-wrap justify-start bg-transparent p-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-surface data-[state=active]:text-brand-primary">All content <span className="ml-2 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs">{items.length}</span></TabsTrigger>
              <TabsTrigger value="drafts" className="data-[state=active]:bg-brand-gold/20">Drafts <span className="ml-2 rounded-full bg-brand-gold/30 px-2 py-0.5 text-xs">{drafts}</span></TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-brand-primary/10 data-[state=active]:text-brand-primary">Published <span className="ml-2 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs">{published}</span></TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0"><CmsContentTable items={rows} columns={columns} /></TabsContent>
            <TabsContent value="drafts" className="mt-0"><CmsContentTable items={rows.filter((item) => item.status === "Draft")} columns={columns} /></TabsContent>
            <TabsContent value="published" className="mt-0"><CmsContentTable items={rows.filter((item) => item.status === "Published")} columns={columns} /></TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  );
}

function CmsContentTable({ items, columns }: { items: CmsContentItem[]; columns: DataTableColumn<CmsContentItem>[] }) {
  return <DataTable data={items} columns={columns} getRowId={(item) => item.id} getSearchText={(item) => `${item.title} ${item.description} ${item.status} ${item.modifiedBy ?? ""}`} searchPlaceholder="Search website content..." pageSizeOptions={[5, 10]} />;
}

function SummaryCard({ label, value, detail, icon: Icon, tone }: { label: string; value: number; detail: string; icon: typeof Send; tone: "blue" | "gold" | "white" }) {
  const iconClass = tone === "blue" ? "bg-brand-primary text-brand-white" : tone === "gold" ? "bg-brand-gold text-charcoal" : "bg-brand-white text-brand-primary ring-1 ring-brand-primary/20";
  return <Card className="shadow-none"><CardContent className="flex items-center gap-4 p-4"><span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}><Icon className="size-5" /></span><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-0.5 font-display text-2xl font-semibold tabular-nums">{value}</p><p className="truncate text-xs text-muted-foreground">{detail}</p></div></CardContent></Card>;
}
