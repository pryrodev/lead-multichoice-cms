"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Save, Send, Trash2 } from "lucide-react";
import { seoPages, type SeoPageId } from "@/lib/cms/site-seo";
import { usePublishSiteNavigation, useSaveSiteNavigationDraft, useSiteNavigationDraft } from "@/lib/api/hooks";
import type { SiteNavigationContent, SiteNavigationGroup, SiteNavigationLink } from "@/lib/cms/site-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DraftPreviewButton } from "@/components/cms/draft-preview-button";

const availablePages = seoPages.filter((page) => page.id !== "home");
const idFrom = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "group";

export function SiteNavigationEditor() {
  const saved = useSiteNavigationDraft();
  const saveMutation = useSaveSiteNavigationDraft();
  const publishMutation = usePublishSiteNavigation();
  const [content, setContent] = useState<SiteNavigationContent>(saved.content);
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);

  async function saveDraft() {
    try { const result = await saveMutation.mutateAsync(content); setContent(result.content); toast.success("Navigation draft saved"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not save navigation"); }
  }
  async function publish() {
    try { if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content); await publishMutation.mutateAsync(); toast.success("Navigation published"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not publish navigation"); }
  }
  function updateGroup(groupIndex: number, patch: Partial<SiteNavigationGroup>) {
    setContent((current) => ({ ...current, groups: current.groups.map((group, index) => index === groupIndex ? { ...group, ...patch } : group) }));
  }
  function moveGroup(index: number, offset: number) {
    setContent((current) => { const groups = [...current.groups]; const target = index + offset; if (target < 0 || target >= groups.length) return current; [groups[index], groups[target]] = [groups[target]!, groups[index]!]; return { ...current, groups }; });
  }
  function updateLink(groupIndex: number, linkIndex: number, patch: Partial<SiteNavigationLink>) {
    const group = content.groups[groupIndex];
    if (!group) return;
    updateGroup(groupIndex, { links: group.links.map((link, index) => index === linkIndex ? { ...link, ...patch } : link) });
  }
  function moveLink(groupIndex: number, linkIndex: number, offset: number) {
    const group = content.groups[groupIndex];
    if (!group) return;
    const links = [...group.links]; const target = linkIndex + offset;
    if (target < 0 || target >= links.length) return;
    [links[linkIndex], links[target]] = [links[target]!, links[linkIndex]!];
    updateGroup(groupIndex, { links });
  }
  function addGroup() {
    const id = `section-${crypto.randomUUID().slice(0, 8)}`;
    setContent((current) => ({ ...current, groups: [...current.groups, { id, label: "New section", links: [] }] }));
  }
  function addLink(groupIndex: number) {
    const group = content.groups[groupIndex];
    if (!group) return;
    const used = new Set(content.groups.flatMap((item) => item.links.map((link) => link.pageId)));
    const page = availablePages.find((item) => !used.has(item.id as Exclude<SeoPageId, "home">));
    if (!page) { toast.error("All available pages are already in the header."); return; }
    updateGroup(groupIndex, { links: [...group.links, { id: idFrom(page.id), pageId: page.id as SiteNavigationLink["pageId"], label: page.label }] });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div><CardTitle>Header navigation</CardTitle><CardDescription className="mt-0.5">Edit menu labels, page links, groups, and order.</CardDescription></div>
          <div className="flex flex-wrap gap-2"><DraftPreviewButton href="/cms-preview/site-navigation?view=home" onPrepare={async () => { if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content); }} disabled={saveMutation.isPending} /><Button type="button" variant="outline" onClick={saveDraft} disabled={!isDirty || saveMutation.isPending}><Save data-icon="inline-start" />Save draft</Button><Button type="button" onClick={publish} disabled={saveMutation.isPending || publishMutation.isPending}><Send data-icon="inline-start" />Publish</Button></div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">{saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}{saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}{isDirty && <Badge variant="outline">Unsaved changes</Badge>}</CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-semibold">Menu groups</h2><p className="text-sm text-muted-foreground">Home’s section menu is managed in the Homepage editor.</p></div><Button type="button" variant="outline" onClick={addGroup}><Plus data-icon="inline-start" />Add group</Button></div>
      {content.groups.map((group, groupIndex) => {
        const usedByOtherGroups = new Set(content.groups.flatMap((item, index) => index === groupIndex ? [] : item.links.map((link) => link.pageId)));
        return <Card key={group.id} className="rounded-md shadow-none">
          <CardHeader className="flex flex-row flex-wrap items-end gap-3">
            <div className="grid min-w-48 flex-1 gap-2"><Label htmlFor={`nav-group-${group.id}`}>Group label</Label><Input id={`nav-group-${group.id}`} value={group.label} onChange={(event) => updateGroup(groupIndex, { label: event.target.value })} placeholder="e.g. Company" /></div>
            <div className="flex gap-1"><Button type="button" size="icon" variant="ghost" aria-label="Move group up" disabled={groupIndex === 0} onClick={() => moveGroup(groupIndex, -1)}><ArrowUp /></Button><Button type="button" size="icon" variant="ghost" aria-label="Move group down" disabled={groupIndex === content.groups.length - 1} onClick={() => moveGroup(groupIndex, 1)}><ArrowDown /></Button><Button type="button" size="icon" variant="ghost" aria-label="Remove group" disabled={content.groups.length === 1} onClick={() => setContent((current) => ({ ...current, groups: current.groups.filter((_, index) => index !== groupIndex) }))}><Trash2 className="text-destructive" /></Button></div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {group.links.map((link, linkIndex) => <div key={link.id} className="grid gap-2 rounded-md border p-3 sm:grid-cols-[minmax(140px,0.8fr)_minmax(180px,1fr)_minmax(130px,0.8fr)_auto] sm:items-end">
              <div className="grid gap-2"><Label>Page</Label><Select value={link.pageId} onValueChange={(value) => { const page = availablePages.find((item) => item.id === value); if (page) updateLink(groupIndex, linkIndex, { pageId: page.id as SiteNavigationLink["pageId"], label: page.label, id: idFrom(page.id) }); }}><SelectTrigger><SelectValue placeholder="Choose page" /></SelectTrigger><SelectContent>{availablePages.filter((page) => !usedByOtherGroups.has(page.id as Exclude<SeoPageId, "home">) && !group.links.some((other, index) => index !== linkIndex && other.pageId === page.id) || page.id === link.pageId).map((page) => <SelectItem key={page.id} value={page.id}>{page.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label htmlFor={`nav-label-${link.id}`}>Menu label</Label><Input id={`nav-label-${link.id}`} value={link.label} onChange={(event) => updateLink(groupIndex, linkIndex, { label: event.target.value })} placeholder="Visible navigation text" /></div>
              <div className="truncate text-xs text-muted-foreground">/{link.pageId}</div>
              <div className="flex gap-1"><Button type="button" size="icon" variant="ghost" aria-label="Move link up" disabled={linkIndex === 0} onClick={() => moveLink(groupIndex, linkIndex, -1)}><ArrowUp /></Button><Button type="button" size="icon" variant="ghost" aria-label="Move link down" disabled={linkIndex === group.links.length - 1} onClick={() => moveLink(groupIndex, linkIndex, 1)}><ArrowDown /></Button><Button type="button" size="icon" variant="ghost" aria-label="Remove link" onClick={() => updateGroup(groupIndex, { links: group.links.filter((_, index) => index !== linkIndex) })}><Trash2 className="text-destructive" /></Button></div>
            </div>)}
            <Button type="button" variant="outline" className="w-fit" onClick={() => addLink(groupIndex)}><Plus data-icon="inline-start" />Add page link</Button>
          </CardContent>
        </Card>;
      })}
    </div>
  );
}
