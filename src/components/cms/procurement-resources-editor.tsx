"use client";

import { useState } from "react";
import { Eye, Pencil, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProcurementResourcesDraft, usePublishProcurementResources, useSaveProcurementResourcesDraft } from "@/lib/api/hooks";
import type { ProcurementResource } from "@/lib/cms/procurement-resources";
import { getResourceDomain } from "@/lib/cms/procurement-resources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ProcurementResourcesEditor() {
  const saved = useProcurementResourcesDraft();
  const saveDraft = useSaveProcurementResourcesDraft();
  const publishResources = usePublishProcurementResources();
  const [resources, setResources] = useState(saved.content.resources);
  const [editingResource, setEditingResource] = useState<ProcurementResource | null>(null);
  const isDirty = JSON.stringify(resources) !== JSON.stringify(saved.content.resources);
  const columns: DataTableColumn<ProcurementResource>[] = [
    { id: "resource", header: "Resource", className: "min-w-56", cell: (resource) => <div className="min-w-0"><p className="font-medium">{resource.name}</p><a href={resource.url} target="_blank" rel="noreferrer" className="mt-1 block max-w-64 truncate text-xs text-muted-foreground hover:text-primary hover:underline" title={resource.url}>{getResourceDomain(resource.url)}</a></div> },
    { id: "description", header: "Description", className: "min-w-64 max-w-md", cell: (resource) => <p className="line-clamp-2 text-sm text-muted-foreground" title={resource.description}>{resource.description}</p> },
    { id: "link-label", header: "Button label", className: "min-w-40", cell: (resource) => <span className="text-sm">{resource.cta}</span> },
    { id: "actions", header: "Action", className: "w-28", cell: (resource) => <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${resource.name}`} onClick={() => setEditingResource({ ...resource })}><Pencil className="size-4" /></Button>
      <AlertDialog>
        <AlertDialogTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label={`Delete ${resource.name}`}><Trash2 className="size-4 text-destructive" /></Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this resource?</AlertDialogTitle><AlertDialogDescription>{resource.name} will be removed from the homepage and procurement resources page when you publish.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => setResources((current) => current.filter((item) => item.id !== resource.id))}>Delete resource</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div> },
  ];

  function addResource() {
    const id = `resource-${crypto.randomUUID().slice(0, 8)}`;
    setEditingResource({ id, name: "", description: "", cta: "Visit website", url: "https://" });
  }

  function saveResource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingResource) return;
    const resource = {
      ...editingResource,
      name: editingResource.name.trim(),
      description: editingResource.description.trim(),
      cta: editingResource.cta.trim(),
      url: editingResource.url.trim(),
    };
    try {
      if (!resource.name || !resource.description || !resource.cta) throw new Error("Complete the resource name, description, and button label.");
      if (resource.name.length > 160 || resource.description.length > 500 || resource.cta.length > 100) throw new Error("One or more fields are too long.");
      if (new URL(resource.url).protocol !== "https:") throw new Error("Use a secure HTTPS link.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enter a valid resource.");
      return;
    }
    setResources((current) => current.some((item) => item.id === resource.id)
      ? current.map((item) => item.id === resource.id ? resource : item)
      : [...current, resource]);
    setEditingResource(null);
  }

  async function save() {
    try {
      const result = await saveDraft.mutateAsync({ resources });
      setResources(result.content.resources);
      toast.success("Resource draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save resources");
    }
  }

  async function publish() {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync({ resources });
      await publishResources.mutateAsync();
      toast.success("Procurement resources published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish resources");
    }
  }

  return (
    <div className="space-y-5">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>External procurement resources</CardTitle>
            <CardDescription className="mt-1">Manage the public links shown on the homepage and Procurement Opportunities page.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><a href="/procurement-opportunities" target="_blank" rel="noreferrer"><Eye data-icon="inline-start" />Preview page</a></Button>
            <Button variant="outline" onClick={save} disabled={!isDirty || saveDraft.isPending}><Save data-icon="inline-start" />Save draft</Button>
            <Button onClick={publish} disabled={saveDraft.isPending || publishResources.isPending}><Send data-icon="inline-start" />Publish</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
          {saved.hasDraft ? <Badge variant="secondary">Draft saved</Badge> : <Badge variant="outline">No saved draft</Badge>}
          {saved.publishedAt && <span className="text-muted-foreground">Last published {new Date(saved.publishedAt).toLocaleString()}</span>}
          {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <div><h2 className="font-display text-lg font-semibold">Resources <span className="ml-1 text-sm font-normal text-muted-foreground">{resources.length}</span></h2><p className="text-sm text-muted-foreground">Visitors can browse the published links in a horizontal carousel.</p></div>
        <Button type="button" variant="outline" onClick={addResource}><Plus data-icon="inline-start" />Add resource</Button>
      </div>

      <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={resources} columns={columns} getRowId={(resource) => resource.id} initialPageSize={10} pageSizeOptions={[10, 20, 50]} emptyMessage="No resources yet. Add a link to show it on the public website." /></CardContent></Card>

      <Dialog open={editingResource !== null} onOpenChange={(open) => { if (!open) setEditingResource(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{resources.some((resource) => resource.id === editingResource?.id) ? "Edit resource" : "Add resource"}</DialogTitle>
            <DialogDescription>Update the portal details shown to visitors.</DialogDescription>
          </DialogHeader>
          {editingResource && <form onSubmit={saveResource} className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="resource-name">Resource name</Label><Input id="resource-name" required maxLength={160} value={editingResource.name} onChange={(event) => setEditingResource({ ...editingResource, name: event.target.value })} placeholder="e.g. Rwanda Medical Supply" /></div>
            <div className="grid gap-2"><Label htmlFor="resource-url">Website URL</Label><Input id="resource-url" type="url" required value={editingResource.url} onChange={(event) => setEditingResource({ ...editingResource, url: event.target.value })} placeholder="https://example.gov.rw" /></div>
            <div className="grid gap-2"><Label htmlFor="resource-description">Description</Label><Textarea id="resource-description" required maxLength={500} rows={3} value={editingResource.description} onChange={(event) => setEditingResource({ ...editingResource, description: event.target.value })} placeholder="What visitors will find on this website" /></div>
            <div className="grid gap-2"><Label htmlFor="resource-cta">Button label</Label><Input id="resource-cta" required maxLength={100} value={editingResource.cta} onChange={(event) => setEditingResource({ ...editingResource, cta: event.target.value })} placeholder="Visit official portal" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditingResource(null)}>Cancel</Button><Button type="submit">Save resource</Button></DialogFooter>
          </form>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
