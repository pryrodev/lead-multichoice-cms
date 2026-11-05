import { PageShell } from "@/components/layout/page";
import { MediaLibrary } from "@/components/cms/media-library";

export default function MediaPage() {
  return <PageShell title="Media library" subtitle="Upload and manage images used by the website CMS"><MediaLibrary /></PageShell>;
}
