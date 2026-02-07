import { useEffect, useRef } from "preact/hooks";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  primaryColor: string;
}

export function MessageList({
  messages,
  isLoading,
  primaryColor,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

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
      {isLoading && (
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