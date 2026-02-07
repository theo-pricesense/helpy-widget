import type { Message } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
  welcomeMessage: string;
  placeholder: string;
  primaryColor: string;
}

export function ChatWindow({
  messages,
  isLoading,
  onSend,
  onClose,
  welcomeMessage,
  placeholder,
  primaryColor,
}: ChatWindowProps) {
  return (
    <div class="helpy-window">
      <div class="helpy-header" style={{ backgroundColor: primaryColor }}>
        <div class="helpy-header-content">
          <div class="helpy-header-avatar">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 8V4H8" />
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="6" y="14" width="12" height="8" rx="2" />
              <path d="M12 10v4" />
            </svg>
          </div>
          <div>
            <h3 class="helpy-header-title">Helpy AI</h3>
            <p class="helpy-header-subtitle">Always here to help</p>
          </div>
        </div>
        <button
          type="button"
          class="helpy-close-btn"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="helpy-body">
        {messages.length === 0 && !isLoading && (
          <div class="helpy-welcome">
            <p>{welcomeMessage}</p>
          </div>
        )}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          primaryColor={primaryColor}
        />
      </div>

      <MessageInput
        onSend={onSend}
        placeholder={placeholder}
        disabled={isLoading}
        primaryColor={primaryColor}
      />
    </div>
  );
}