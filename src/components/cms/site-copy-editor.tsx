"use client";

import { useState } from "react";
import { Languages, Save, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { SITE_COPY_FIELDS, type SiteCopyContent } from "@/lib/cms/site-copy";
import { cmsLanguageOptions, type CmsLanguage } from "@/i18n/messages";
import { usePublishSiteCopy, useSaveSiteCopyDraft, useSiteCopyDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";

const languageFlags: Record<CmsLanguage, string> = { en: "🇬🇧", rw: "🇷🇼", fr: "🇫🇷", sw: "🇹🇿" };

export function SiteCopyEditor() {
  const saved = useSiteCopyDraft();
  const saveDraft = useSaveSiteCopyDraft();
  const publishCopy = usePublishSiteCopy();
  const [content, setContent] = useState<SiteCopyContent>(saved.content);
  const [search, setSearch] = useState("");
  const groups = [...new Set(SITE_COPY_FIELDS.map((field) => field.group))];
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved.content);

  const save = async () => {
    try {
      await saveDraft.mutateAsync(content);
      toast.success("Website copy draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save website copy");
    }
  };

  const publish = async () => {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync(content);
      await publishCopy.mutateAsync();
      toast.success("Website copy published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish website copy");
    }
  };

  const updateTranslation = (language: CmsLanguage, fieldId: string, value: string) => {
    setContent((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: { ...current.translations[language], [fieldId]: value },
      },
    }));
  };

  const lowerSearch = search.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Website copy and translations</CardTitle>
            <CardDescription className="mt-1">Edit shared labels and public page copy in English, Kinyarwanda, French, and Swahili.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={save} disabled={!isDirty || saveDraft.isPending}><Save data-icon="inline-start" />Save draft</Button>
            <Button onClick={publish} disabled={saveDraft.isPending || publishCopy.isPending}><Send data-icon="inline-start" />Publish</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
          {saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}
          {saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}
          {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
        </CardContent>
      </Card>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English copy or translation key" className="pl-9" aria-label="Search website copy" />
      </div>

      <Tabs defaultValue={groups[0] ?? "Website copy"}>
        <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto">
          {groups.map((group) => <TabsTrigger key={group} value={group}>{group}</TabsTrigger>)}
        </TabsList>
        {groups.map((group) => (
          <TabsContent key={group} value={group} className="mt-4">
            <Tabs defaultValue="en">
              <TabsList className="mb-4">
                {cmsLanguageOptions.map(({ code, name }) => <TabsTrigger key={code} value={code}>{languageFlags[code]} {name}</TabsTrigger>)}
              </TabsList>
              {cmsLanguageOptions.map(({ code }) => (
                <TabsContent key={code} value={code} className="mt-0">
                  <CopyFields
                    language={code}
                    fields={SITE_COPY_FIELDS.filter((field) => field.group === group && (!lowerSearch || `${field.source} ${field.id}`.toLowerCase().includes(lowerSearch)))}
                    content={content}
                    onChange={updateTranslation}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><Languages className="size-4" />English source text identifies the matching content on the public site. Each language is saved independently.</p>
    </div>
  );
}

function CopyFields({
  language,
  fields,
  content,
  onChange,
}: {
  language: CmsLanguage;
  fields: typeof SITE_COPY_FIELDS;
  content: SiteCopyContent;
  onChange: (language: CmsLanguage, fieldId: string, value: string) => void;
}) {
  const columns: DataTableColumn<(typeof SITE_COPY_FIELDS)[number]>[] = [
    { id: "source", header: "English source", className: "min-w-64 max-w-md", cell: (field) => <div><p className="text-sm leading-relaxed">{field.source}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{field.id}</p></div> },
    { id: "translation", header: "Translation", className: "min-w-[24rem]", cell: (field) => {
      const value = content.translations[language][field.id] ?? field.defaults[language];
      const id = `site-copy-${language}-${field.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
      return <><Label htmlFor={id} className="sr-only">{field.source} ({language})</Label>{Math.max(field.source.length, value.length) > 100
        ? <Textarea id={id} rows={2} maxLength={5000} value={value} onChange={(event) => onChange(language, field.id, event.target.value)} />
        : <Input id={id} maxLength={5000} value={value} onChange={(event) => onChange(language, field.id, event.target.value)} />}</>;
    } },
  ];

  return (
    <div className="rounded-md border"><ReusableTable rows={fields} columns={columns} getRowId={(field) => field.id} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No copy fields match this search." /></div>
  );
}
