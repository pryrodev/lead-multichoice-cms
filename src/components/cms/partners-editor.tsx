"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Handshake, Pencil, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useMediaAssets,
  usePartnersDraft,
  usePublishPartners,
  useSavePartnersDraft,
} from "@/lib/api/hooks";
import type { WebsitePartner } from "@/lib/cms/partners";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";

export function PartnersEditor() {
  const saved = usePartnersDraft();
  const media = useMediaAssets().filter((asset) => asset.resourceType === "image");
  const saveDraft = useSavePartnersDraft();
  const publishPartners = usePublishPartners();
  const [partners, setPartners] = useState(saved.content.partners);
  const [editingPartner, setEditingPartner] = useState<WebsitePartner | null>(null);
  const isDirty = JSON.stringify(partners) !== JSON.stringify(saved.content.partners);

  const columns: DataTableColumn<WebsitePartner>[] = [
    {
      id: "partner",
      header: "Partner",
      className: "min-w-56",
      cell: (partner) => (
        <div className="flex items-center gap-3">
          <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt=""
                fill
                unoptimized
                sizes="44px"
                className="object-contain p-1"
              />
            ) : (
              <Handshake className="size-5 text-muted-foreground" />
            )}
          </span>
          <span className="font-medium">{partner.name}</span>
        </div>
      ),
    },
    {
      id: "website",
      header: "Website",
      className: "min-w-48",
      cell: (partner) => (
        <a
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-64 truncate text-sm text-muted-foreground hover:text-brand-primary hover:underline"
          title={partner.href}
        >
          {partner.href}
        </a>
      ),
    },
    {
      id: "actions",
      header: "Action",
      className: "w-28",
      cell: (partner) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${partner.name}`}
            onClick={() => setEditingPartner({ ...partner })}
          >
            <Pencil className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${partner.name}`}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this partner?</AlertDialogTitle>
                <AlertDialogDescription>
                  {partner.name} will disappear from the homepage after you publish the changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() =>
                    setPartners((current) => current.filter((item) => item.id !== partner.id))
                  }
                >
                  Remove partner
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  function addPartner() {
    setEditingPartner({
      id: `partner-${crypto.randomUUID().slice(0, 8)}`,
      name: "",
      href: "https://",
      logo: "",
    });
  }

  function savePartner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingPartner) return;
    const partner = {
      ...editingPartner,
      name: editingPartner.name.trim(),
      href: editingPartner.href.trim(),
    };
    try {
      if (!partner.name) throw new Error("Enter a partner name.");
      if (partner.name.length > 160) throw new Error("Partner names can be up to 160 characters.");
      if (new URL(partner.href).protocol !== "https:")
        throw new Error("Use a secure HTTPS website link.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Check the partner details.");
      return;
    }
    setPartners((current) =>
      current.some((item) => item.id === partner.id)
        ? current.map((item) => (item.id === partner.id ? partner : item))
        : [...current, partner],
    );
    setEditingPartner(null);
  }

  async function save() {
    try {
      const result = await saveDraft.mutateAsync({ partners });
      setPartners(result.content.partners);
      toast.success("Partner draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save partners");
    }
  }

  async function publish() {
    try {
      if (isDirty || !saved.hasDraft) await saveDraft.mutateAsync({ partners });
      await publishPartners.mutateAsync();
      toast.success("Partners published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish partners");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Homepage partners</CardTitle>
            <CardDescription className="mt-1">
              Manage the names, logos, and links shown in the scrolling Partners section.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Eye data-icon="inline-start" />
                Preview homepage
              </Link>
            </Button>
            <Button variant="outline" onClick={save} disabled={!isDirty || saveDraft.isPending}>
              <Save data-icon="inline-start" />
              Save draft
            </Button>
            <Button onClick={publish} disabled={saveDraft.isPending || publishPartners.isPending}>
              <Send data-icon="inline-start" />
              Publish
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
          {saved.hasDraft ? (
            <Badge variant="secondary">Draft saved</Badge>
          ) : (
            <Badge variant="outline">No saved draft</Badge>
          )}
          {saved.publishedAt && (
            <span className="text-muted-foreground">
              Last published {new Date(saved.publishedAt).toLocaleString()}
            </span>
          )}
          {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">
            Partners{" "}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {partners.length}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            The published list scrolls across the homepage hero.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={addPartner}>
          <Plus data-icon="inline-start" />
          Add partner
        </Button>
      </div>

      <Card className="rounded-md shadow-none">
        <CardContent className="px-0 pb-0">
          <ReusableTable
            rows={partners}
            columns={columns}
            getRowId={(partner) => partner.id}
            initialPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            emptyMessage="No partners added yet. Add a name and website to show it on the homepage."
          />
        </CardContent>
      </Card>

      <Dialog
        open={editingPartner !== null}
        onOpenChange={(open) => {
          if (!open) setEditingPartner(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {partners.some((partner) => partner.id === editingPartner?.id)
                ? "Edit partner"
                : "Add partner"}
            </DialogTitle>
            <DialogDescription>
              Set the partner name, website, and an optional logo from the media library.
            </DialogDescription>
          </DialogHeader>
          {editingPartner && (
            <form onSubmit={savePartner} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="partner-name">Partner name</Label>
                <Input
                  id="partner-name"
                  required
                  maxLength={160}
                  value={editingPartner.name}
                  onChange={(event) =>
                    setEditingPartner({ ...editingPartner, name: event.target.value })
                  }
                  placeholder="e.g. Rwanda Development Board"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partner-website">Website</Label>
                <Input
                  id="partner-website"
                  type="url"
                  required
                  value={editingPartner.href}
                  onChange={(event) =>
                    setEditingPartner({ ...editingPartner, href: event.target.value })
                  }
                  placeholder="https://example.gov.rw"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partner-logo">Logo</Label>
                <Select
                  value={editingPartner.logo || "__none__"}
                  onValueChange={(value) =>
                    setEditingPartner({
                      ...editingPartner,
                      logo: value === "__none__" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="partner-logo">
                    <SelectValue placeholder="Choose a logo from the media library" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Show partner name only</SelectItem>
                    {editingPartner.logo &&
                      !media.some((asset) => asset.secureUrl === editingPartner.logo) && (
                        <SelectItem value={editingPartner.logo}>Keep current logo</SelectItem>
                      )}
                    {media.map((asset) => (
                      <SelectItem key={asset.id} value={asset.secureUrl}>
                        {asset.altText || asset.publicId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Upload new logos in the{" "}
                  <Link
                    href="/admin/content/media"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Media Library
                  </Link>
                  .
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingPartner(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save partner</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
