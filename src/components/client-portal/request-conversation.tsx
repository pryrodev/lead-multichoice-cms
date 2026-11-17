"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, MessageCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useRequestMessages, useSendRequestMessage } from "@/features/client-portal/hooks";
import type { RequestMessage } from "@/features/client-portal/types";

type Props = { scope: "client"; id: string } | { scope: "admin"; id: string };

const dateTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));

export function RequestConversation({ scope, id }: Props) {
  const query = useRequestMessages(scope, id);
  const send = useSendRequestMessage(scope, id);
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageCount = query.data?.messages.length ?? 0;

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messageCount]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (message.length < 2 || send.isPending) return;
    try {
      await send.mutateAsync(message);
      setDraft("");
    } catch {
      // Keep the draft in place so the sender can retry.
    }
  }

  return (
    <section aria-label="Request conversation" className="flex min-h-64 flex-1 flex-col">
      <div
        ref={messagesRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain py-4"
      >
        {query.isPending ? (
          <div className="flex flex-col gap-3" role="status" aria-label="Loading conversation">
            <Skeleton className="h-16 w-4/5 rounded-md" />
            <Skeleton className="ml-auto h-14 w-3/5 rounded-md" />
            <Skeleton className="h-12 w-2/3 rounded-md" />
          </div>
        ) : query.isError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>{query.error.message || "Could not load messages."}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void query.refetch()}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : query.data?.messages.length ? (
          query.data.messages.map((message) => (
            <MessageBubble key={message.id} message={message} scope={scope} />
          ))
        ) : (
          <div className="m-auto flex max-w-xs flex-col items-center gap-1 py-8 text-center">
            <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <MessageCircle className="size-5" />
            </span>
            <p className="text-sm font-semibold tracking-tight text-charcoal">No messages yet</p>
            <p className="text-sm text-steel">
              {scope === "admin"
                ? "Send the client a message to start the conversation."
                : "Send a question to start the conversation with our team."}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="flex shrink-0 flex-col gap-2 border-t border-border pt-4">
        <label htmlFor={`message-draft-${id}`} className="sr-only">
          Write a message
        </label>
        <div className="flex items-end gap-2">
          <Textarea
            id={`message-draft-${id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={3000}
            rows={3}
            placeholder={scope === "admin" ? "Reply to the client…" : "Ask the team a question…"}
            className="min-h-20 resize-none rounded-md border-input bg-background text-sm shadow-none"
            disabled={send.isPending}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            title="Send message"
            disabled={draft.trim().length < 2 || send.isPending}
            className="shrink-0 bg-brand-primary text-brand-white hover:bg-brand-primary/90"
          >
            {send.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex min-h-5 items-center justify-between gap-3">
          {send.isError ? (
            <p role="alert" className="text-xs text-destructive">
              {send.error.message || "Message could not be sent. Try again."}
            </p>
          ) : (
            <span />
          )}
          {draft.length > 0 && (
            <span className="shrink-0 text-xs tabular-nums text-steel">{draft.length}/3000</span>
          )}
        </div>
      </form>
    </section>
  );
}

function MessageBubble({ message, scope }: { message: RequestMessage; scope: Props["scope"] }) {
  const isTeam = message.senderType === "team";
  return (
    <article className={`flex ${isTeam ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] rounded-md px-3.5 py-2.5 sm:max-w-[78%] ${isTeam ? "bg-muted text-charcoal" : "bg-brand-primary text-brand-white"}`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className={`text-xs font-semibold ${isTeam ? "text-charcoal" : "text-brand-white"}`}>
            {isTeam
              ? scope === "admin"
                ? message.senderName
                : "Our team"
              : scope === "admin"
                ? message.senderName
                : "You"}
          </p>
          <time
            className={`text-[10px] ${isTeam ? "text-steel" : "text-brand-white/75"}`}
            dateTime={message.createdAt}
          >
            {dateTime(message.createdAt)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.message}
        </p>
      </div>
    </article>
  );
}
