"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, ImagePlus, Languages, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { HOME_CMS_FIELDS, HOME_SECTION_NAV_ITEMS, defaultHomePageContent, type HomePageContent } from "@/lib/cms/homepage";
import { cmsLanguageOptions, type CmsLanguage } from "@/i18n/messages";
import { useAdminHomePage, useMediaAssets, usePublishHomePage, useSaveHomePageDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DraftPreviewButton } from "@/components/cms/draft-preview-button";

const languageFlags: Record<CmsLanguage, string> = { en: "🇬🇧", fr: "🇫🇷", zh: "🇨🇳", de: "🇩🇪", ar: "🇸🇦" };

export function HomepageEditor() {
  const saved = useAdminHomePage();
  const media = useMediaAssets();
  const saveDraft = useSaveHomePageDraft();
  const publishPage = usePublishHomePage();
  const [content, setContent] = useState<HomePageContent>(saved.content);
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);
  const sections = [...new Set([...HOME_CMS_FIELDS.map((field) => field.section), "Home menu"])];

  const updateTranslation = (language: CmsLanguage, source: string, value: string) => {
    setContent((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: { ...current.translations[language], [source]: value },
      },
    }));
  };

  const toggleHomeMenuItem = (id: string, enabled: boolean) => {
    setContent((current) => ({
      ...current,
      homeMenuEnabledIds: enabled
        ? [...current.homeMenuEnabledIds, id]
        : current.homeMenuEnabledIds.filter((itemId) => itemId !== id),
    }));
  };
  const updateHomeMenuLabel = (id: (typeof HOME_SECTION_NAV_ITEMS)[number]["id"], value: string) => {
    setContent((current) => ({
      ...current,
      homeMenuLabels: {
        ...current.homeMenuLabels,
        [id]: value,
      },
    }));
  };

  const save = async () => {
    try {
      await saveDraft.mutateAsync(content);
      toast.success("Homepage draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the draft");
    }
  };

  const publish = async () => {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync(content);
      await publishPage.mutateAsync();
      toast.success("Homepage published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish the homepage");
    }
  };

  return <div className="flex flex-col gap-5">
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div>
          <CardTitle>Homepage</CardTitle>
          <CardDescription className="mt-1">Edit each section in the four CMS languages. Draft changes stay private until published.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <DraftPreviewButton href="/cms-preview/home?view=home" onPrepare={async () => { if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync(content); }} disabled={saveDraft.isPending} />
          <Button variant="outline" onClick={save} disabled={!isDirty || saveDraft.isPending}><Save data-icon="inline-start" />{saveDraft.isPending ? "Saving…" : "Save draft"}</Button>
          <Button onClick={publish} disabled={saveDraft.isPending || publishPage.isPending}><Send data-icon="inline-start" />{publishPage.isPending ? "Publishing…" : "Publish"}</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
        {saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}
        {saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}
        {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ImagePlus /> Hero image</CardTitle><CardDescription>Choose an image from the Cloudinary media library. You can upload images on the Media library page.</CardDescription></CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-[1fr_18rem] md:items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="home-hero-image">Image</Label>
          <Select value={content.heroImageUrl || "__default__"} onValueChange={(value) => setContent((current) => ({ ...current, heroImageUrl: value === "__default__" ? defaultHomePageContent.heroImageUrl : value }))}>
            <SelectTrigger id="home-hero-image"><SelectValue placeholder="Choose a hero image" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__default__">Current website image</SelectItem>
              {media.map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}
            </SelectContent>
          </Select>
          <Link href="/admin/content/media" className="text-sm text-primary hover:underline">Open media library <ExternalLink className="ml-1 inline size-3" /></Link>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          <Image src={content.heroImageUrl || defaultHomePageContent.heroImageUrl} alt="Homepage hero image preview" fill unoptimized sizes="288px" className="object-cover" />
        </div>
      </CardContent>
    </Card>

    <Tabs defaultValue="Hero" className="flex flex-col gap-4">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto">
        {sections.map((section) => <TabsTrigger key={section} value={section}>{section}</TabsTrigger>)}
      </TabsList>
      {sections.map((section) => <TabsContent key={section} value={section} className="mt-0">
        <Card className="rounded-md shadow-none">
          <CardHeader>
            <CardTitle>{section}</CardTitle>
            <CardDescription>
              {section === "Home menu"
                ? "Choose visible homepage sections and edit their menu labels."
                : "Edit the text visitors see in each language."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {section === "Home menu" ? (
              <div>
                <div className="divide-y rounded-md border">
                  {HOME_SECTION_NAV_ITEMS.map((item) => {
                    const fieldId = `home-menu-${item.id}`;
                    return (
                      <div key={item.id} className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,1.5fr)] sm:items-center">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`${fieldId}-enabled`}
                            checked={content.homeMenuEnabledIds.includes(item.id)}
                            disabled={content.homeMenuEnabledIds.length === 1 && content.homeMenuEnabledIds.includes(item.id)}
                            onCheckedChange={(checked) => toggleHomeMenuItem(item.id, checked === true)}
                          />
                          <Label htmlFor={`${fieldId}-enabled`} className="font-medium">
                            {item.label}
                          </Label>
                        </div>
                        <Input
                          id={fieldId}
                          aria-label={`${item.label} menu label`}
                          value={content.homeMenuLabels[item.id] ?? item.label}
                          onChange={(event) => updateHomeMenuLabel(item.id, event.target.value)}
                          maxLength={80}
                          placeholder={item.label}
                          disabled={!content.homeMenuEnabledIds.includes(item.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Tabs defaultValue="en">
                <TabsList className="mb-5">
                  {cmsLanguageOptions.map(({ code, name }) => <TabsTrigger key={code} value={code}>{languageFlags[code]} {name}</TabsTrigger>)}
                </TabsList>
                {cmsLanguageOptions.map(({ code }) => <TabsContent key={code} value={code} className="mt-0">
                <div className="grid items-start gap-x-5 gap-y-6 md:grid-cols-2">
                  {HOME_CMS_FIELDS.filter((field) => field.section === section).map((field) => {
                    const fieldId = `${section}-${code}-${HOME_CMS_FIELDS.indexOf(field)}`;
                    const value = content.translations[code][field.text] ?? "";
                    const isLongCopy = Math.max(field.text.length, value.length) > 120;
                    return <div key={field.text} className={`flex min-w-0 flex-col gap-2 ${isLongCopy ? "md:col-span-2" : ""}`}>
                      <Label htmlFor={fieldId} className="text-sm font-semibold">{field.label}</Label>
                      {code !== "en" && <p className="rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">English source: </span>{field.text}</p>}
                      {isLongCopy
                        ? <Textarea id={fieldId} value={value} onChange={(event) => updateTranslation(code, field.text, event.target.value)} rows={4} maxLength={5000} />
                        : <Input id={fieldId} value={value} onChange={(event) => updateTranslation(code, field.text, event.target.value)} maxLength={5000} />}
                    </div>;
                  })}
                </div>
              </TabsContent>)}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </TabsContent>)}
    </Tabs>
    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Languages className="size-4" />Translations are prefilled from the current site language copy and can be edited independently.</div>
  </div>;
}
