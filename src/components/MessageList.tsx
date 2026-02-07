import { useEffect, useRef } from "preact/hooks";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  primaryColor: string;
}

export function MessageList({
  messages,
  isLoading,
  streamingContent,
  primaryColor,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  return (
    <div class="helpy-messages" ref={listRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          class={`helpy-message helpy-message-${message.role.toLowerCase()}`}
          style={
            message.role === "USER"
              ? { backgroundColor: primaryColor }
              : undefined
          }
        >
          {message.role !== "USER" && (
            <span class="helpy-message-badge">
              {message.role === "AI" ? "AI" : "Agent"}
            </span>
          )}
          <p>{message.content}</p>
          <span class="helpy-message-time">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}

      {/* Streaming AI response */}
      {streamingContent && (
        <div class="helpy-message helpy-message-ai helpy-message-streaming">
          <span class="helpy-message-badge">AI</span>
          <p>
            {streamingContent}
            <span class="helpy-cursor" />
          </p>
        </div>
      )}

      {/* Loading indicator (before streaming starts) */}
      {isLoading && !streamingContent && (
        <div class="helpy-message helpy-message-ai">
          <div class="helpy-typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  );
}
