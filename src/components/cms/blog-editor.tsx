"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useBlogDraft, useMediaAssets, usePublishBlog, useSaveBlogDraft } from "@/lib/api/hooks";
import type { InsightArticle } from "@/content/insights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DraftPreviewButton } from "@/components/cms/draft-preview-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";

const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);

export function BlogEditor() {
  const saved = useBlogDraft();
  const media = useMediaAssets().filter((asset) => asset.resourceType === "image");
  const saveDraft = useSaveBlogDraft();
  const publishBlog = usePublishBlog();
  const [articles, setArticles] = useState(saved.content.articles);
  const [editing, setEditing] = useState<InsightArticle | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const dirty = JSON.stringify(articles) !== JSON.stringify(saved.content.articles);

  const columns: DataTableColumn<InsightArticle>[] = [
    { id: "article", header: "Article", className: "min-w-64", cell: (article) => <div className="flex items-center gap-3"><span className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">{article.image && <Image src={article.image} alt="" fill unoptimized sizes="56px" className="object-cover" />}</span><div className="min-w-0"><p className="font-medium">{article.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">/blog/{article.slug}</p></div></div> },
    { id: "category", header: "Category", className: "min-w-36", cell: (article) => <span className="text-sm text-muted-foreground">{article.category}</span> },
    { id: "summary", header: "Summary", className: "min-w-64 max-w-lg", cell: (article) => <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p> },
    { id: "actions", header: "Action", className: "w-24", cell: (article) => <div className="flex items-center gap-1"><Button asChild type="button" variant="ghost" size="icon" aria-label={`Preview ${article.title}`}><Link href={`/blog/${article.slug}`} target="_blank"><Eye className="size-4" /></Link></Button><Button type="button" variant="ghost" size="icon" aria-label={`Edit ${article.title}`} onClick={() => { setOriginalSlug(article.slug); setEditing({ ...article }); }}><Pencil className="size-4" /></Button><Button type="button" variant="ghost" size="icon" aria-label={`Delete ${article.title}`} onClick={() => setArticles((current) => current.filter((item) => item.slug !== article.slug))}><Trash2 className="size-4 text-destructive" /></Button></div> },
  ];

  function addArticle() {
    setOriginalSlug(null);
    setEditing({ slug: "", category: "", title: "", summary: "", body: "", image: "/site/warehouse.jpg", imageAlt: "" });
  }

  function saveArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const article = { ...editing, slug: slugify(editing.slug || editing.title), category: editing.category.trim(), title: editing.title.trim(), summary: editing.summary.trim(), body: editing.body.trim(), imageAlt: editing.imageAlt.trim() };
    if (!article.slug || !article.category || !article.title || !article.summary || !article.body || !article.image || !article.imageAlt) {
      toast.error("Complete the article details and choose an image.");
      return;
    }
    if (articles.some((item) => item.slug === article.slug && item.slug !== originalSlug)) {
      toast.error("That article URL is already in use.");
      return;
    }
    setArticles((current) => originalSlug
      ? current.map((item) => item.slug === originalSlug ? article : item)
      : [...current, article]);
    setOriginalSlug(null);
    setEditing(null);
  }

  async function save() {
    try { const result = await saveDraft.mutateAsync({ articles }); setArticles(result.content.articles); toast.success("Blog draft saved"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not save the blog draft"); }
  }
  async function publish() {
    try { if (dirty || !saved.hasDraft) await saveDraft.mutateAsync({ articles }); await publishBlog.mutateAsync(); toast.success("Blog published"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not publish the blog"); }
  }

  return <div className="flex flex-col gap-5">
    <Card className="rounded-md shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div><CardTitle>Blog articles</CardTitle><CardDescription className="mt-1">Write articles for the public blog and homepage.</CardDescription></div>
        <div className="flex flex-wrap gap-2"><DraftPreviewButton href="/cms-preview/blog?view=blog" onPrepare={async () => { if (dirty || !saved.hasDraft) await saveDraft.mutateAsync({ articles }); }} disabled={saveDraft.isPending} /><Button variant="outline" onClick={save} disabled={!dirty || saveDraft.isPending}><Save data-icon="inline-start" />Save draft</Button><Button onClick={publish} disabled={saveDraft.isPending || publishBlog.isPending}><Send data-icon="inline-start" />Publish</Button></div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">{saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}{saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}{dirty && <Badge variant="outline">Unsaved changes</Badge>}</CardContent>
    </Card>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-semibold">Articles <span className="ml-1 text-sm font-normal text-muted-foreground">{articles.length}</span></h2></div><Button type="button" variant="outline" onClick={addArticle}><Plus data-icon="inline-start" />Add article</Button></div>
    <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={articles} columns={columns} getRowId={(article) => article.slug || article.title} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No articles yet. Add an article to publish it on the website." /></CardContent></Card>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) { setEditing(null); setOriginalSlug(null); } }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md sm:max-w-2xl">
        <DialogHeader><DialogTitle>{articles.some((article) => article.slug === editing?.slug) ? "Edit article" : "New article"}</DialogTitle><DialogDescription>Write the article and select its image from the media library.</DialogDescription></DialogHeader>
        {editing && <form onSubmit={saveArticle} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="blog-title">Title</Label><Input id="blog-title" required maxLength={200} value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} placeholder="Article title" /></div>
            <div className="grid gap-2"><Label htmlFor="blog-category">Category</Label><Input id="blog-category" required maxLength={100} value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} placeholder="e.g. Market access" /></div>
          </div>
          <div className="grid gap-2"><Label htmlFor="blog-slug">URL slug</Label><Input id="blog-slug" required maxLength={120} value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })} placeholder="article-url" /></div>
          <div className="grid gap-2"><Label htmlFor="blog-summary">Summary</Label><Textarea id="blog-summary" required maxLength={500} rows={2} value={editing.summary} onChange={(event) => setEditing({ ...editing, summary: event.target.value })} placeholder="A short introduction shown in article cards." /></div>
          <div className="grid gap-2"><Label htmlFor="blog-body">Article content</Label><Textarea id="blog-body" required maxLength={20000} rows={8} value={editing.body} onChange={(event) => setEditing({ ...editing, body: event.target.value })} placeholder="Write the article. Separate paragraphs with a blank line." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="blog-image">Featured image</Label><Select value={editing.image} onValueChange={(image) => setEditing({ ...editing, image })}><SelectTrigger id="blog-image"><SelectValue placeholder="Choose an image" /></SelectTrigger><SelectContent><SelectItem value="/site/warehouse.jpg">Default warehouse image</SelectItem><SelectItem value="/site/hero-port.jpg">Default port image</SelectItem>{editing.image.startsWith("http") && !media.some((asset) => asset.secureUrl === editing.image) && <SelectItem value={editing.image}>Keep current image</SelectItem>}{media.map((asset) => <SelectItem key={asset.id} value={asset.secureUrl}>{asset.altText || asset.publicId}</SelectItem>)}</SelectContent></Select><p className="text-xs text-muted-foreground">Upload images in the <Link className="text-primary underline-offset-4 hover:underline" href="/admin/content/media">Media Library</Link>.</p></div>
            <div className="grid gap-2"><Label htmlFor="blog-alt">Image description</Label><Input id="blog-alt" required maxLength={300} value={editing.imageAlt} onChange={(event) => setEditing({ ...editing, imageAlt: event.target.value })} placeholder="Describe the image" /></div>
          </div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save article</Button></DialogFooter>
        </form>}
      </DialogContent>
    </Dialog>
  </div>;
}
