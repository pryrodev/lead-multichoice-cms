import { PageShell } from "@/components/layout/page";
import { MediaGalleryEditor } from "@/components/cms/media-gallery-editor";

export default function MediaGalleryPage() {
  return <PageShell title="Media gallery" subtitle="Choose gallery images and manage their captions and order."><MediaGalleryEditor /></PageShell>;
}
