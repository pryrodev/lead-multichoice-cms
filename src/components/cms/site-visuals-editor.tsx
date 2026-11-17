"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Images, Save, Send, Video } from "lucide-react";
import { toast } from "sonner";
import { SITE_VIDEO_FIELDS, SITE_VISUAL_FIELDS, type SiteVideoKey, type SiteVisualKey, type SiteVisuals } from "@/lib/cms/site-visuals";
import { useMediaAssets, usePublishSiteVisuals, useSaveSiteVisualsDraft, useSiteVisualsDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";

type VisualField = (typeof SITE_VISUAL_FIELDS)[number];

export function SiteVisualsEditor() {
  const saved = useSiteVisualsDraft();
  const media = useMediaAssets();
  const saveDraft = useSaveSiteVisualsDraft();
  const publishVisuals = usePublishSiteVisuals();
  const [content, setContent] = useState<SiteVisuals>(saved.content);
  const pages = [...new Set(SITE_VISUAL_FIELDS.map(({ key }) => key.slice(0, key.indexOf("."))))];
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);

  const save = async () => {
    try {
      await saveDraft.mutateAsync(content);
      toast.success("Website media draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save website media");
    }
  };

  const publish = async () => {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync(content);
      await publishVisuals.mutateAsync();
      toast.success("Website media published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish website media");
    }
  };

  const updateImage = (key: SiteVisualKey, image: string) => {
    setContent((current) => ({ ...current, [key]: image }));
  };
  const updateVideo = (key: SiteVideoKey, source: string) => {
    setContent((current) => ({ ...current, [key]: source }));
  };

  const columns: DataTableColumn<VisualField>[] = [
    { id: "section", header: "Section", className: "min-w-52 font-medium", cell: (field) => field.label },
    { id: "preview", header: "Current image", className: "w-28", cell: (field) => <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted"><Image src={content[field.key] || field.fallback} alt="" fill unoptimized sizes="80px" className="object-cover" /></div> },
    { id: "image", header: "Choose image", className: "min-w-64", cell: (field) => <Select value={content[field.key]} onValueChange={(image) => updateImage(field.key, image)}>
      <SelectTrigger aria-label={`Choose image for ${field.label}`}><SelectValue placeholder="Choose an image" /></SelectTrigger>
      <SelectContent>
        <SelectItem value={field.fallback}>Restore original image</SelectItem>
        {media.filter((asset) => asset.secureUrl !== field.fallback).map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}
      </SelectContent>
    </Select> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
          <CardTitle>Website media</CardTitle>
          <CardDescription className="mt-1">Manage hero videos and the images used across public pages. Drafts stay private until published.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.open("/", "_blank", "noopener,noreferrer")}><Eye data-icon="inline-start" />Preview site</Button>
            <Button variant="outline" onClick={save} disabled={!isDirty || saveDraft.isPending}><Save data-icon="inline-start" />Save draft</Button>
            <Button onClick={publish} disabled={saveDraft.isPending || publishVisuals.isPending}><Send data-icon="inline-start" />Publish</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
          {saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}
          {saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}
          {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
        </CardContent>
      </Card>

      <Card className="rounded-md shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Hero background videos</CardTitle>
          <CardDescription>Paste a direct MP4, WebM, or Ogg URL hosted on Cloudinary or another media host. Clear it to show only the hero image.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {SITE_VIDEO_FIELDS.map((field) => (
            <div key={field.key} className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <div className="flex min-w-0 gap-2">
                <Input
                  id={field.key}
                  value={content[field.key]}
                  onChange={(event) => updateVideo(field.key, event.target.value)}
                  placeholder="https://…/background-video.mp4"
                  maxLength={1200}
                  autoComplete="url"
                  className="min-w-0 shadow-none"
                />
                <Button type="button" variant="outline" onClick={() => updateVideo(field.key, field.fallback)}>Default</Button>
              </div>
              <p className="truncate text-xs text-muted-foreground" title={content[field.key]}>
                {content[field.key] || "Video disabled"}
              </p>
              {content[field.key] && (
                <video
                  src={content[field.key]}
                  controls
                  muted
                  playsInline
                  preload="none"
                  className="mt-1 aspect-video w-full max-w-md bg-muted object-cover"
                />
              )}
            </div>
          ))}
          <p className="flex items-center gap-2 text-sm text-muted-foreground md:col-span-2">
            <Video className="size-4 shrink-0" /> Hero videos require a direct file URL; YouTube watch links are not supported. The homepage and procurement hero images remain visible if video playback is unavailable.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground md:col-span-2">
            <Images className="size-4 shrink-0" /> Upload still images in the <Link href="/admin/content/media" className="font-medium text-primary underline-offset-4 hover:underline">Media Library</Link>, then choose them in the page tabs below.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue={pages[0] ?? "home"}>
        <TabsList className="h-auto max-w-full justify-start overflow-x-auto">
          {pages.map((page) => <TabsTrigger key={page} value={page} className="capitalize">{page.replace(/([A-Z])/g, " $1")}</TabsTrigger>)}
        </TabsList>
        {pages.map((page) => (
          <TabsContent key={page} value={page} className="mt-4">
            <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={SITE_VISUAL_FIELDS.filter(({ key }) => key.startsWith(`${page}.`))} columns={columns} getRowId={(field) => field.key} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No images are configured for this page." /></CardContent></Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
