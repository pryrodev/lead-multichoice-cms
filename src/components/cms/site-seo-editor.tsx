"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Send } from "lucide-react";
import { seoPages, type SiteSeoEntry, type SiteSeoContent } from "@/lib/cms/site-seo";
import { usePublishSiteSeo, useSaveSiteSeoDraft, useSiteSeoDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { DraftPreviewButton } from "@/components/cms/draft-preview-button";

export function SiteSeoEditor() {
  const saved = useSiteSeoDraft();
  const saveMutation = useSaveSiteSeoDraft();
  const publishMutation = usePublishSiteSeo();
  const [content, setContent] = useState<SiteSeoContent>(saved.content);
  const [editing, setEditing] = useState<SiteSeoEntry | null>(null);
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);
  const columns: DataTableColumn<SiteSeoEntry>[] = [
    { id: "page", header: "Page", className: "min-w-40 font-medium", cell: (item) => seoPages.find((page) => page.id === item.pageId)?.label ?? item.pageId },
    { id: "slug", header: "Public URL", className: "min-w-40", cell: (item) => item.pageId === "home" ? "/" : `/${item.slug}` },
    { id: "title", header: "SEO title", className: "min-w-56", cell: (item) => <span className="block max-w-80 truncate" title={item.seoTitle}>{item.seoTitle}</span> },
    { id: "description", header: "Description", className: "min-w-64", cell: (item) => <span className="block max-w-[28rem] truncate text-muted-foreground" title={item.seoDescription}>{item.seoDescription}</span> },
    { id: "action", header: "Action", className: "w-24 text-right", cell: (item) => <Button type="button" variant="ghost" size="sm" onClick={() => setEditing({ ...item })}>Edit</Button> },
  ];

  async function saveDraft(next = content) {
    try {
      const result = await saveMutation.mutateAsync(next);
      setContent(result.content);
      toast.success("SEO draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save SEO settings");
    }
  }

  async function publish() {
    try {
      if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content);
      await publishMutation.mutateAsync();
      toast.success("SEO settings published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish SEO settings");
    }
  }

  function savePage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const value = { ...editing, slug: editing.pageId === "home" ? "" : editing.slug.trim().toLowerCase() };
    const slugOwner = content.pages.find((page) => page.pageId !== value.pageId && page.slug === value.slug);
    if (slugOwner) {
      toast.error("That URL is already assigned to another page.");
      return;
    }
    setContent((current) => ({ ...current, pages: current.pages.map((page) => page.pageId === value.pageId ? value : page) }));
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Page SEO & URLs</CardTitle>
            <CardDescription className="mt-0.5">Manage search titles, descriptions, and page addresses.</CardDescription>
          </div>
          <div className="flex gap-2">
            <DraftPreviewButton href="/cms-preview/site-seo?view=home" onPrepare={async () => { if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content); }} disabled={saveMutation.isPending} />
            <Button type="button" variant="outline" onClick={() => saveDraft()} disabled={!isDirty || saveMutation.isPending}><Save data-icon="inline-start" />Save draft</Button>
            <Button type="button" onClick={publish} disabled={saveMutation.isPending || publishMutation.isPending}><Send data-icon="inline-start" />Publish</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
          {saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}
          {saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}
          {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
        </CardContent>
      </Card>
      <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0">
        <ReusableTable rows={content.pages} columns={columns} getRowId={(item) => item.pageId} initialPageSize={10} pageSizeOptions={[10, 20]} emptyMessage="No pages have SEO settings." />
      </CardContent></Card>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-md sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit page metadata</DialogTitle>
            <DialogDescription>{editing ? seoPages.find((page) => page.id === editing.pageId)?.label : ""}</DialogDescription>
          </DialogHeader>
          {editing && <form id="page-seo-form" onSubmit={savePage} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="seo-slug">Slug</Label>
              <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">{editing.pageId === "home" ? "https://leadmultichoice.com/" : "/"}</span><Input id="seo-slug" value={editing.pageId === "home" ? "" : editing.slug} disabled={editing.pageId === "home"} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} placeholder="about-us" /></div>
              <p className="text-xs text-muted-foreground">Published slugs work as page aliases; the original URL remains available.</p>
            </div>
            <div className="grid gap-2"><Label htmlFor="seo-title">SEO title</Label><Input id="seo-title" maxLength={120} required value={editing.seoTitle} onChange={(event) => setEditing({ ...editing, seoTitle: event.target.value })} placeholder="Page title for search results" /></div>
            <div className="grid gap-2"><Label htmlFor="seo-description">SEO description</Label><Textarea id="seo-description" maxLength={320} required rows={4} value={editing.seoDescription} onChange={(event) => setEditing({ ...editing, seoDescription: event.target.value })} placeholder="A short summary for search results" /></div>
          </form>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" form="page-seo-form">Save page</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
