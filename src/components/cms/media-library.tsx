"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteMedia, useMediaAssets, useUploadMedia } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function MediaLibrary() {
  const assets = useMediaAssets();
  const upload = useUploadMedia();
  const deleteAsset = useDeleteMedia();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");

  const submit = () => {
    if (!file) { toast.error("Choose an image first"); return; }
    upload.mutate({ file, altText }, {
      onSuccess: () => { toast.success("Image uploaded"); setFile(null); setAltText(""); if (fileInput.current) fileInput.current.value = ""; },
      onError: (error) => toast.error(error.message),
    });
  };

  return <div className="space-y-6">
    <Card><CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div className="space-y-2"><Label htmlFor="media-file">Image</Label><Input ref={fileInput} id="media-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></div>
      <div className="space-y-2"><Label htmlFor="media-alt">Alt text</Label><Input id="media-alt" value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe this image for accessibility" maxLength={500} /></div>
      <Button onClick={submit} disabled={!file || upload.isPending}><ImagePlus className="mr-2 h-4 w-4" />{upload.isPending ? "Uploading…" : "Upload image"}</Button>
      <p className="text-xs text-muted-foreground md:col-span-3">JPG, PNG, WebP, or AVIF · maximum 10 MB. Images are stored in Cloudinary; the library metadata is stored in MySQL.</p>
    </CardContent></Card>

    {assets.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{assets.map((asset) => <Card key={asset.id} className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted"><Image src={asset.secureUrl} alt={asset.altText || "Uploaded media"} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover" /></div>
      <CardContent className="space-y-3 p-4"><div><p className="truncate text-sm font-medium" title={asset.altText || asset.publicId}>{asset.altText || asset.publicId}</p><p className="mt-1 text-xs text-muted-foreground">{asset.width} × {asset.height} · {formatBytes(asset.bytes)}</p></div>
        <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="w-full" disabled={deleteAsset.isPending}><Trash2 className="mr-2 h-4 w-4" /> Delete image</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this image?</AlertDialogTitle><AlertDialogDescription>This removes the image from Cloudinary and from the website media library.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteAsset.mutate(asset.id, { onSuccess: () => toast.success("Image deleted"), onError: (error) => toast.error(error.message) })}>Delete image</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </CardContent>
    </Card>)}</div> : <Card><CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 p-6 text-center"><ImagePlus className="h-8 w-8 text-muted-foreground" /><p className="font-medium">No media uploaded yet</p><p className="text-sm text-muted-foreground">Images uploaded here will be available to website content editors.</p></CardContent></Card>}
  </div>;
}

function formatBytes(bytes: number) {
  return new Intl.NumberFormat("en", { style: "unit", unit: "kilobyte", maximumFractionDigits: 0 }).format(bytes / 1024);
}
