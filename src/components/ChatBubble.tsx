interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  primaryColor: string;
}

export function ChatBubble({ onClick, isOpen, primaryColor }: ChatBubbleProps) {
  return (
    <button
      type="button"
      class="helpy-bubble"
      onClick={onClick}
      style={{ backgroundColor: primaryColor }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
}