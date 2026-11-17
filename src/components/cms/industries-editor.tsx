"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useIndustriesDraft, useMediaAssets, usePublishIndustries, useSaveIndustriesDraft } from "@/lib/api/hooks";
import type { IndustrySector } from "@/lib/cms/industries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";

type IndustryDraft = {
  heroTitle: string;
  heroIntro: string;
  sectors: IndustrySector[];
};

const makeId = (title: string) => title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);

export function IndustriesEditor() {
  const saved = useIndustriesDraft();
  const media = useMediaAssets().filter((asset) => asset.resourceType === "image");
  const saveDraft = useSaveIndustriesDraft();
  const publishIndustries = usePublishIndustries();
  const [content, setContent] = useState<IndustryDraft>(saved.content);
  const [editing, setEditing] = useState<IndustrySector | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const dirty = JSON.stringify(content) !== JSON.stringify(saved.content);

  const columns: DataTableColumn<IndustrySector>[] = [
    { id: "industry", header: "Industry", className: "min-w-64", cell: (sector) => <div className="flex items-center gap-3"><span className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted"><Image src={sector.image} alt="" fill unoptimized sizes="56px" className="object-cover" /></span><div className="min-w-0"><p className="font-medium">{sector.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">/{sector.id}</p></div></div> },
    { id: "description", header: "Description", className: "min-w-64 max-w-lg", cell: (sector) => <p className="line-clamp-2 text-sm text-muted-foreground">{sector.text}</p> },
    { id: "support", header: "Support areas", className: "min-w-32", cell: (sector) => <span className="text-sm text-muted-foreground">{sector.points.length} items</span> },
    { id: "actions", header: "Action", className: "w-24", cell: (sector) => <div className="flex items-center gap-1"><Button type="button" variant="ghost" size="icon" aria-label={`Edit ${sector.title}`} onClick={() => { setOriginalId(sector.id); setEditing({ ...sector, points: [...sector.points] }); }}><Pencil className="size-4" /></Button><Button type="button" variant="ghost" size="icon" aria-label={`Delete ${sector.title}`} onClick={() => setContent((current) => ({ ...current, sectors: current.sectors.filter((item) => item.id !== sector.id) }))}><Trash2 className="size-4 text-destructive" /></Button></div> },
  ];

  function addSector() {
    setOriginalId(null);
    setEditing({ id: "", title: "", text: "", image: "/site/healthcare.jpg", alt: "", points: [] });
  }

  function saveSector(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const sector = { ...editing, id: makeId(editing.id || editing.title), title: editing.title.trim(), text: editing.text.trim(), alt: editing.alt.trim(), points: editing.points.map((point) => point.trim()).filter(Boolean) };
    if (!sector.id || !sector.title || !sector.text || !sector.image || !sector.alt || sector.points.length === 0) {
      toast.error("Complete the industry details and add at least one support area.");
      return;
    }
    if (content.sectors.some((item) => item.id === sector.id && item.id !== originalId)) {
      toast.error("That industry URL is already in use.");
      return;
    }
    setContent((current) => ({
      ...current,
      sectors: originalId
        ? current.sectors.map((item) => item.id === originalId ? sector : item)
        : [...current.sectors, sector],
    }));
    setEditing(null);
    setOriginalId(null);
  }

  async function save() {
    try { const result = await saveDraft.mutateAsync(content); setContent(result.content); toast.success("Industries draft saved"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not save industries"); }
  }

  async function publish() {
    try { if (dirty || !saved.hasDraft) await saveDraft.mutateAsync(content); await publishIndustries.mutateAsync(); toast.success("Industries page published"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not publish industries"); }
  }

  return <div className="flex flex-col gap-5">
    <Card className="rounded-md shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div><CardTitle>Industries page</CardTitle><CardDescription className="mt-1">Manage the page introduction and each sector, image, and support area.</CardDescription></div>
        <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link href="/industries" target="_blank" rel="noreferrer"><Eye data-icon="inline-start" />Preview page</Link></Button><Button variant="outline" onClick={save} disabled={!dirty || saveDraft.isPending}><Save data-icon="inline-start" />Save draft</Button><Button onClick={publish} disabled={saveDraft.isPending || publishIndustries.isPending}><Send data-icon="inline-start" />Publish</Button></div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">{saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}{saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}{dirty && <Badge variant="outline">Unsaved changes</Badge>}</CardContent>
    </Card>

    <Card className="rounded-md shadow-none">
      <CardHeader><CardTitle className="text-base">Page introduction</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="industries-hero-title">Heading</Label><Input id="industries-hero-title" maxLength={200} value={content.heroTitle} onChange={(event) => setContent((current) => ({ ...current, heroTitle: event.target.value }))} placeholder="Industry page heading" /></div>
        <div className="grid gap-2"><Label htmlFor="industries-hero-intro">Introduction</Label><Textarea id="industries-hero-intro" maxLength={500} rows={2} value={content.heroIntro} onChange={(event) => setContent((current) => ({ ...current, heroIntro: event.target.value }))} placeholder="Short introduction to the sectors" /></div>
      </CardContent>
    </Card>

    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-semibold">Industry sections <span className="ml-1 text-sm font-normal text-muted-foreground">{content.sectors.length}</span></h2><Button type="button" variant="outline" onClick={addSector}><Plus data-icon="inline-start" />Add industry</Button></div>
    <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={content.sectors} columns={columns} getRowId={(sector) => sector.id} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No industries added. Add a sector to the page." /></CardContent></Card>

    <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) { setEditing(null); setOriginalId(null); } }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md sm:max-w-2xl">
        <DialogHeader><DialogTitle>{originalId ? "Edit industry" : "Add industry"}</DialogTitle><DialogDescription>Set the public sector title, description, image, and support areas.</DialogDescription></DialogHeader>
        {editing && <form onSubmit={saveSector} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="industry-title">Title</Label><Input id="industry-title" required maxLength={180} value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} placeholder="e.g. Pharmaceuticals & Healthcare" /></div>
            <div className="grid gap-2"><Label htmlFor="industry-id">Section URL id</Label><Input id="industry-id" required maxLength={100} value={editing.id} onChange={(event) => setEditing({ ...editing, id: makeId(event.target.value) })} placeholder="e.g. healthcare" /></div>
          </div>
          <div className="grid gap-2"><Label htmlFor="industry-description">Description</Label><Textarea id="industry-description" required maxLength={600} rows={2} value={editing.text} onChange={(event) => setEditing({ ...editing, text: event.target.value })} placeholder="Summarize the company's work in this sector." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="industry-image">Image</Label><Select value={editing.image} onValueChange={(image) => setEditing({ ...editing, image })}><SelectTrigger id="industry-image"><SelectValue placeholder="Choose an image" /></SelectTrigger><SelectContent>{editing.image && !media.some((asset) => asset.secureUrl === editing.image) && <SelectItem value={editing.image}>Keep current image</SelectItem>}{media.map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}</SelectContent></Select><p className="text-xs text-muted-foreground">Upload images in the <Link className="text-primary underline-offset-4 hover:underline" href="/admin/content/media">Media Library</Link>.</p></div>
            <div className="grid gap-2"><Label htmlFor="industry-alt">Image description</Label><Input id="industry-alt" required maxLength={300} value={editing.alt} onChange={(event) => setEditing({ ...editing, alt: event.target.value })} placeholder="Describe the image" /></div>
          </div>
          <div className="grid gap-2"><Label htmlFor="industry-points">Support areas</Label><Textarea id="industry-points" rows={5} value={editing.points.join("\n")} onChange={(event) => setEditing({ ...editing, points: event.target.value.split("\n") })} placeholder={"Enter one support area per line\nSupplier engagement\nLogistics support"} /><p className="text-xs text-muted-foreground">Enter one point per line.</p></div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => { setEditing(null); setOriginalId(null); }}>Cancel</Button><Button type="submit">Save industry</Button></DialogFooter>
        </form>}
      </DialogContent>
    </Dialog>
  </div>;
}
