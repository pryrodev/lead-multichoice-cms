"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RequestConversation } from "@/components/client-portal/request-conversation";

export function ClientRequestConversationSheet({
  reference,
  title,
  compact = false,
}: {
  reference: string;
  title: string;
  compact?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          className="shrink-0 rounded-md border-brand-primary/25 text-brand-primary hover:bg-brand-primary/5"
        >
          <MessageCircle data-icon="inline-start" />
          {compact ? "Message" : "Message the team"}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-xl">
        <SheetHeader className="mb-5 shrink-0 text-left">
          <SheetTitle>Message the team</SheetTitle>
          <SheetDescription className="max-w-[calc(100%-2rem)] truncate">{title}</SheetDescription>
        </SheetHeader>
        <RequestConversation scope="client" id={reference} />
      </SheetContent>
    </Sheet>
  );
}
