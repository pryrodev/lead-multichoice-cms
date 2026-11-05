"use client";

import { useMemo, useState } from "react";
import { Languages, Save, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { SITE_COPY_FIELDS, type SiteCopyContent } from "@/lib/cms/site-copy";
import { languageOptions, type Language } from "@/i18n/messages";
import { usePublishSiteCopy, useSaveSiteCopyDraft, useSiteCopyDraft } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 24;
const languageFlags: Record<Language, string> = { en: "🇬🇧", rw: "🇷🇼", fr: "🇫🇷", sw: "🇹🇿" };

export function SiteCopyEditor() {
  const saved = useSiteCopyDraft();
  const saveDraft = useSaveSiteCopyDraft();
  const publishCopy = usePublishSiteCopy();
  const [content, setContent] = useState<SiteCopyContent>(saved.content);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
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

  const updateTranslation = (language: Language, fieldId: string, value: string) => {
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
        <Input value={search} onChange={(event) => { setSearch(event.target.value); setPageIndex(0); }} placeholder="Search English copy or translation key" className="pl-9" aria-label="Search website copy" />
      </div>

      <Tabs defaultValue={groups[0] ?? "Website copy"} onValueChange={() => setPageIndex(0)}>
        <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto">
          {groups.map((group) => <TabsTrigger key={group} value={group}>{group}</TabsTrigger>)}
        </TabsList>
        {groups.map((group) => (
          <TabsContent key={group} value={group} className="mt-4">
            <Tabs defaultValue="en">
              <TabsList className="mb-4">
                {languageOptions.map(({ code, name }) => <TabsTrigger key={code} value={code}>{languageFlags[code]} {name}</TabsTrigger>)}
              </TabsList>
              {languageOptions.map(({ code }) => (
                <TabsContent key={code} value={code} className="mt-0">
                  <CopyFields
                    language={code}
                    fields={SITE_COPY_FIELDS.filter((field) => field.group === group && (!lowerSearch || `${field.source} ${field.id}`.toLowerCase().includes(lowerSearch)))}
                    content={content}
                    pageIndex={pageIndex}
                    onPageChange={setPageIndex}
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
  pageIndex,
  onPageChange,
  onChange,
}: {
  language: Language;
  fields: typeof SITE_COPY_FIELDS;
  content: SiteCopyContent;
  pageIndex: number;
  onPageChange: (index: number) => void;
  onChange: (language: Language, fieldId: string, value: string) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(fields.length / PAGE_SIZE));
  const visibleFields = useMemo(() => fields.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE), [fields, pageIndex]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{fields.length} copy fields</span>
        {totalPages > 1 && <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onPageChange(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0}>Previous</Button>
          <span>Page {pageIndex + 1} of {totalPages}</span>
          <Button size="sm" variant="outline" onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))} disabled={pageIndex >= totalPages - 1}>Next</Button>
        </div>}
      </div>
      {visibleFields.length ? <div className="grid gap-4 xl:grid-cols-2">
        {visibleFields.map((field, index) => {
          const id = `site-copy-${language}-${pageIndex}-${index}`;
          const value = content.translations[language][field.id] ?? field.defaults[language];
          return <Card key={field.id}>
            <CardHeader className="pb-2"><CardDescription>{field.id}</CardDescription><CardTitle className="text-sm font-medium leading-relaxed">{field.source}</CardTitle></CardHeader>
            <CardContent>
              <Label htmlFor={id} className="sr-only">{field.source} ({language})</Label>
              {Math.max(field.source.length, value.length) > 100
                ? <Textarea id={id} rows={3} maxLength={5000} value={value} onChange={(event) => onChange(language, field.id, event.target.value)} />
                : <Input id={id} maxLength={5000} value={value} onChange={(event) => onChange(language, field.id, event.target.value)} />}
            </CardContent>
          </Card>;
        })}
      </div> : <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No copy fields match this search.</CardContent></Card>}
    </div>
  );
}
