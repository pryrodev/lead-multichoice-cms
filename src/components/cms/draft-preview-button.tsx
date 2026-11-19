"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DraftPreviewButton({
  href,
  onPrepare,
  disabled = false,
}: {
  href: string;
  onPrepare: () => Promise<unknown>;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);

  async function openPreview() {
    const previewWindow = window.open("about:blank", "_blank");
    if (!previewWindow) {
      toast.error("Allow pop-ups to open the draft preview.");
      return;
    }

    setPending(true);
    try {
      await onPrepare();
      previewWindow.opener = null;
      previewWindow.location.replace(href);
    } catch (error) {
      previewWindow.close();
      toast.error(error instanceof Error ? error.message : "Could not prepare the draft preview.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={openPreview} disabled={disabled || pending}>
      <Eye data-icon="inline-start" />
      {pending ? "Preparing preview..." : "Preview draft"}
    </Button>
  );
}
