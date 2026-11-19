"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Save, Send, Trash2 } from "lucide-react";
import { cmsLanguageOptions, type CmsLanguage } from "@/i18n/messages";
import type { MediaGalleryContent } from "@/lib/cms/media-gallery";
import { useMediaAssets, useMediaGalleryDraft, usePublishMediaGallery, useSaveMediaGalleryDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { DraftPreviewButton } from "@/components/cms/draft-preview-button";

type GalleryStory = MediaGalleryContent["stories"][number];
const locales = cmsLanguageOptions.map(({ code }) => code);

function emptyStory(id: string, image = ""): GalleryStory {
  const localized = (fallback: string) => Object.fromEntries(locales.map((locale) => [locale, fallback])) as Record<CmsLanguage, string>;
  return { id, image, alt: localized(""), category: localized(""), title: localized(""), description: localized("") };
}

export function MediaGalleryEditor() {
  const saved = useMediaGalleryDraft();
  const media = useMediaAssets().filter((asset) => asset.resourceType === "image");
  const saveMutation = useSaveMediaGalleryDraft();
  const publishMutation = usePublishMediaGallery();
  const [content, setContent] = useState<MediaGalleryContent>(saved.content);
  const [editing, setEditing] = useState<GalleryStory | null>(null);
  const [language, setLanguage] = useState<CmsLanguage>("en");
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);
  const columns: DataTableColumn<GalleryStory>[] = [
    { id: "image", header: "Image", className: "w-24", cell: (story) => <div className="relative size-14 overflow-hidden rounded-md border bg-muted">{story.image && <Image src={story.image} alt="" fill unoptimized sizes="56px" className="object-cover" />}</div> },
    { id: "story", header: "Story", className: "min-w-52", cell: (story) => <div className="min-w-0"><p className="font-medium">{story.title["en"] || "Untitled story"}</p><p className="text-xs text-muted-foreground">{story.category["en"] || "No category"}</p></div> },
    { id: "description", header: "Description", className: "min-w-52", cell: (story) => <span className="block max-w-80 truncate text-muted-foreground" title={story.description["en"]}>{story.description["en"] || "—"}</span> },
    { id: "order", header: "Order", className: "w-28", cell: (story) => {
      const index = content.stories.findIndex((entry) => entry.id === story.id);
      return <div className="flex gap-1"><Button type="button" size="icon" variant="ghost" aria-label={`Move ${story.title["en"] || "story"} up`} disabled={index <= 0} onClick={() => moveStory(index, -1)}><ArrowUp /></Button><Button type="button" size="icon" variant="ghost" aria-label={`Move ${story.title["en"] || "story"} down`} disabled={index >= content.stories.length - 1} onClick={() => moveStory(index, 1)}><ArrowDown /></Button></div>;
    } },
    { id: "actions", header: "Action", className: "w-28 text-right", cell: (story) => <div className="flex justify-end gap-1"><Button type="button" size="sm" variant="ghost" onClick={() => { setLanguage("en"); setEditing({ ...story }); }}>Edit</Button><Button type="button" size="icon" variant="ghost" aria-label={`Remove ${story.title["en"] || "gallery story"}`} onClick={() => setContent((current) => ({ ...current, stories: current.stories.filter((entry) => entry.id !== story.id) }))}><Trash2 className="text-destructive" /></Button></div> },
  ];

  function moveStory(index: number, offset: number) {
    setContent((current) => {
      const next = [...current.stories];
      const target = index + offset;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return { ...current, stories: next };
    });
  }

  async function saveDraft(next = content) {
    try {
      const result = await saveMutation.mutateAsync(next);
      setContent(result.content);
      toast.success("Gallery draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save gallery");
    }
  }

  async function publish() {
    try {
      if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content);
      await publishMutation.mutateAsync();
      toast.success("Media gallery published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish gallery");
    }
  }

  function saveStory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.image) { toast.error("Choose an image from the Media Library."); return; }
    setContent((current) => ({ ...current, stories: current.stories.some((story) => story.id === editing.id) ? current.stories.map((story) => story.id === editing.id ? editing : story) : [...current.stories, editing] }));
    setEditing(null);
  }

  function addStory() {
    setLanguage("en");
    setEditing(emptyStory(`story-${crypto.randomUUID().slice(0, 8)}`, media[0]?.secureUrl ?? ""));
  }

  function updateLocalized(field: "alt" | "category" | "title" | "description", value: string) {
    if (!editing) return;
    setEditing({ ...editing, [field]: { ...editing[field], [language]: value } });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div><CardTitle>Media gallery</CardTitle><CardDescription className="mt-0.5">Manage the stories and images shown on the public gallery page.</CardDescription></div>
          <div className="flex flex-wrap gap-2"><DraftPreviewButton href="/cms-preview/media-gallery?view=media" onPrepare={async () => { if (isDirty || !saved.hasDraft) await saveMutation.mutateAsync(content); }} disabled={saveMutation.isPending} /><Button type="button" variant="outline" onClick={() => saveDraft()} disabled={!isDirty || saveMutation.isPending}><Save data-icon="inline-start" />Save draft</Button><Button type="button" onClick={publish} disabled={saveMutation.isPending || publishMutation.isPending}><Send data-icon="inline-start" />Publish</Button></div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">{saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}{saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}{isDirty && <Badge variant="outline">Unsaved changes</Badge>}</CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-semibold">Stories <span className="text-sm font-normal text-muted-foreground">{content.stories.length}</span></h2><p className="text-sm text-muted-foreground">Choose order with the arrows. Upload images in the Media Library.</p></div><Button type="button" onClick={addStory}><ImagePlus data-icon="inline-start" />Add story</Button></div>
      <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={content.stories} columns={columns} getRowId={(story) => story.id} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No gallery stories. Add a story to begin." /></CardContent></Card>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-md sm:max-w-2xl">
          <DialogHeader><DialogTitle>{content.stories.some((story) => story.id === editing?.id) ? "Edit gallery story" : "Add gallery story"}</DialogTitle><DialogDescription>Choose an image and add captions in each site language.</DialogDescription></DialogHeader>
          {editing && <form id="gallery-story-form" onSubmit={saveStory} className="grid gap-4">
            <div className="grid gap-2"><Label>Image</Label><Select value={editing.image || "__none__"} onValueChange={(image) => setEditing({ ...editing, image: image === "__none__" ? "" : image })}><SelectTrigger><SelectValue placeholder="Select image from Media Library" /></SelectTrigger><SelectContent><SelectItem value="__none__">Choose an image</SelectItem>{media.map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}</SelectContent></Select>{media.length === 0 && <p className="text-sm text-muted-foreground">Upload an image in the Media Library first.</p>}</div>
          <Tabs value={language} onValueChange={(value) => setLanguage(value as CmsLanguage)}><TabsList className="h-auto max-w-full flex-wrap">{cmsLanguageOptions.map((item) => <TabsTrigger key={item.code} value={item.code}>{item.name}</TabsTrigger>)}</TabsList><TabsContent value={language} className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="gallery-category">Category</Label><Input id="gallery-category" value={editing.category[language] ?? ""} onChange={(event) => updateLocalized("category", event.target.value)} placeholder="e.g. Supplier engagement" /></div>
              <div className="grid gap-2"><Label htmlFor="gallery-title">Title</Label><Input id="gallery-title" required value={editing.title[language] ?? ""} onChange={(event) => updateLocalized("title", event.target.value)} placeholder="Story title" /></div>
              <div className="grid gap-2"><Label htmlFor="gallery-alt">Image description</Label><Input id="gallery-alt" value={editing.alt[language] ?? ""} onChange={(event) => updateLocalized("alt", event.target.value)} placeholder="Describe the image for accessibility" /></div>
              <div className="grid gap-2"><Label htmlFor="gallery-description">Caption</Label><Textarea id="gallery-description" rows={3} value={editing.description[language] ?? ""} onChange={(event) => updateLocalized("description", event.target.value)} placeholder="Short story caption" /></div>
            </TabsContent></Tabs>
          </form>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" form="gallery-story-form">Save story</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
