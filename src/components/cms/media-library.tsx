"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { useDeleteMedia, useMediaAssets, useUploadMedia } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import type { MediaAsset } from "@/lib/api/types";

export function MediaLibrary() {
  const assets = useMediaAssets();
  const upload = useUploadMedia();
  const deleteAsset = useDeleteMedia();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const columns: DataTableColumn<MediaAsset>[] = [
    { id: "preview", header: "Preview", className: "w-20", cell: (asset) => <div className="relative size-12 overflow-hidden rounded-md border bg-muted">{asset.resourceType === "video" ? <video src={asset.secureUrl} muted playsInline preload="metadata" className="size-full object-cover" /> : <Image src={asset.secureUrl} alt="" fill unoptimized sizes="48px" className="object-cover" />}</div> },
    { id: "name", header: "Media", className: "min-w-52", cell: (asset) => <div className="max-w-sm"><p className="flex items-center gap-2 truncate font-medium" title={asset.altText || asset.publicId}>{asset.resourceType === "video" && <Video className="size-4 shrink-0 text-muted-foreground" />}{asset.altText || asset.publicId}</p><p className="mt-1 truncate text-xs text-muted-foreground">{asset.publicId} · {asset.resourceType}</p></div> },
    { id: "dimensions", header: "Dimensions", className: "whitespace-nowrap text-sm", cell: (asset) => `${asset.width} × ${asset.height}` },
    { id: "size", header: "File size", className: "whitespace-nowrap text-sm", cell: (asset) => formatBytes(asset.bytes) },
    { id: "date", header: "Uploaded", className: "whitespace-nowrap text-sm text-muted-foreground", cell: (asset) => new Date(asset.createdAt).toLocaleDateString() },
    { id: "actions", header: "Action", className: "w-24", cell: (asset) => <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Delete ${asset.altText || asset.publicId}`} disabled={deleteAsset.isPending}><Trash2 className="size-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this media item?</AlertDialogTitle><AlertDialogDescription>This removes the file from Cloudinary and the website media library.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteAsset.mutate(asset.id, { onSuccess: () => toast.success("Media item deleted"), onError: (error) => toast.error(error.message) })}>Delete media</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> },
  ];

  const submit = () => {
    if (!file) { toast.error("Choose a media file first"); return; }
    const maxBytes = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) { toast.error(file.type.startsWith("video/") ? "Videos must be 100 MB or smaller." : "Images must be 10 MB or smaller."); return; }
    upload.mutate({ file, altText }, {
      onSuccess: () => { toast.success("Media uploaded"); setFile(null); setAltText(""); if (fileInput.current) fileInput.current.value = ""; },
      onError: (error) => toast.error(error.message),
    });
  };

  return <div className="space-y-6">
    <Card><CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div className="space-y-2"><Label htmlFor="media-file">Image or video</Label><Input ref={fileInput} id="media-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/ogg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></div>
      <div className="space-y-2"><Label htmlFor="media-alt">Media title</Label><Input id="media-alt" value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="e.g. Procurement warehouse video" maxLength={500} /></div>
      <Button onClick={submit} disabled={!file || upload.isPending}><ImagePlus className="mr-2 h-4 w-4" />{upload.isPending ? "Uploading…" : "Upload media"}</Button>
      <p className="text-xs text-muted-foreground md:col-span-3">Images up to 10 MB and MP4, WebM, or Ogg videos up to 100 MB. Files are stored in Cloudinary; media details are stored in MySQL.</p>
    </CardContent></Card>

    <Card className="rounded-md shadow-none"><CardContent className="px-0 pb-0"><ReusableTable rows={assets} columns={columns} getRowId={(asset) => asset.id} emptyMessage="No images uploaded yet. Upload an image to make it available to website editors." initialPageSize={10} pageSizeOptions={[10, 20, 50]} /></CardContent></Card>
  </div>;
}

function formatBytes(bytes: number) {
  return new Intl.NumberFormat("en", { style: "unit", unit: "kilobyte", maximumFractionDigits: 0 }).format(bytes / 1024);
}
