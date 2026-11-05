"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Images, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { SITE_VISUAL_FIELDS, type SiteVisualKey, type SiteVisuals } from "@/lib/cms/site-visuals";
import { useMediaAssets, usePublishSiteVisuals, useSaveSiteVisualsDraft, useSiteVisualsDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      toast.success("Website image draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save website images");
    }
  };

  const publish = async () => {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync(content);
      await publishVisuals.mutateAsync();
      toast.success("Website images published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish website images");
    }
  };

  const updateImage = (key: SiteVisualKey, image: string) => {
    setContent((current) => ({ ...current, [key]: image }));
  };

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Website images</CardTitle>
            <CardDescription className="mt-1">Choose the fixed background and hero images used across public pages. Drafts stay private until published.</CardDescription>
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

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Images className="size-4" /> Upload files in the Media Library, then assign them to the site sections below.
      </div>

      <Tabs defaultValue={pages[0] ?? "home"}>
        <TabsList className="h-auto max-w-full justify-start overflow-x-auto">
          {pages.map((page) => <TabsTrigger key={page} value={page} className="capitalize">{page.replace(/([A-Z])/g, " $1")}</TabsTrigger>)}
        </TabsList>
        {pages.map((page) => (
          <TabsContent key={page} value={page} className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {SITE_VISUAL_FIELDS.filter(({ key }) => key.startsWith(`${page}.`)).map(({ key, label, fallback }) => {
                const value = content[key];
                const id = `visual-${key.replaceAll(".", "-")}`;
                return (
                  <Card key={key}>
                    <CardHeader className="pb-3"><CardTitle className="text-base">{label}</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-[1fr_12rem] sm:items-end">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={id}>Image</Label>
                        <Select value={value} onValueChange={(image) => updateImage(key, image)}>
                          <SelectTrigger id={id}><SelectValue placeholder="Choose an image" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={fallback}>Use default image</SelectItem>
                            {media.map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Use a clear, wide photo. The page overlay and text stay controlled by the design.</p>
                      </div>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted">
                        <Image src={value || fallback} alt={`${label} preview`} fill unoptimized sizes="192px" className="object-cover" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
