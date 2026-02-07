import { useCallback, useEffect, useState } from "preact/hooks";
import { HelpyApi } from "./api";
import { ChatBubble } from "./components/ChatBubble";
import { ChatWindow } from "./components/ChatWindow";
import type { HelpyConfig, Message, WidgetState } from "./types";

interface WidgetProps {
  config: HelpyConfig;
}

const SESSION_KEY = "helpy_session_id";
const CONVERSATION_KEY = "helpy_conversation_id";

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function Widget({ config }: WidgetProps) {
  const [state, setState] = useState<WidgetState>("closed");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem(CONVERSATION_KEY)
  );
  const [api] = useState(
    () => new HelpyApi(config.projectId, config.apiKey, config.apiUrl)
  );

  const primaryColor = config.primaryColor || "#0891b2";
  const welcomeMessage =
    config.welcomeMessage || "Hi! How can I help you today?";
  const placeholder = config.placeholder || "Type a message...";
  const position = config.position || "bottom-right";

  // Load existing messages if conversation exists
  useEffect(() => {
    if (conversationId && state === "open" && messages.length === 0) {
      api
        .getMessages(conversationId)
        .then((msgs) => setMessages(msgs))
        .catch(() => {
          // Conversation may have expired, clear it
          localStorage.removeItem(CONVERSATION_KEY);
          setConversationId(null);
        });
    }
  }, [conversationId, state, api, messages.length]);

  const startConversation = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const result = await api.startConversation(sessionId);
      setConversationId(result.conversation.id);
      localStorage.setItem(CONVERSATION_KEY, result.conversation.id);
      if (result.welcomeMessage) {
        setMessages([result.welcomeMessage]);
      }
      return result.conversation.id;
    } catch (error) {
      console.error("Failed to start conversation:", error);
      return null;
    }
  }, [api]);

  const handleSend = useCallback(
    async (content: string) => {
      let currentConversationId = conversationId;

      // Start conversation if needed
      if (!currentConversationId) {
        currentConversationId = await startConversation();
        if (!currentConversationId) return;
      }

      // Optimistic update - add user message
      const tempUserMessage: Message = {
        id: `temp_${Date.now()}`,
        conversationId: currentConversationId,
        role: "USER",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);
      setIsLoading(true);

      try {
        const response = await api.sendMessage(currentConversationId, content);

        // Replace temp message with real ones
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id),
          response.userMessage,
          response.aiMessage,
        ]);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove temp message on error
        setMessages((prev) =>
          prev.filter((m) => m.id !== tempUserMessage.id)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, api, startConversation]
  );

  const toggleWidget = useCallback(() => {
    setState((prev) => (prev === "open" ? "closed" : "open"));
  }, []);

  const closeWidget = useCallback(() => {
    setState("closed");
  }, []);

  // Apply theme
  useEffect(() => {
    const container = document.getElementById("helpy-widget-container");
    if (container) {
      const theme =
        config.theme === "auto"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : config.theme || "light";
      container.setAttribute("data-theme", theme);
    }
  }, [config.theme]);

  return (
    <div
      class={`helpy-container helpy-${position}`}
      style={{ zIndex: config.zIndex || 9999 }}
    >
      {state === "open" && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          onClose={closeWidget}
          welcomeMessage={welcomeMessage}
          placeholder={placeholder}
          primaryColor={primaryColor}
        />
      )}
      <ChatBubble
        onClick={toggleWidget}
        isOpen={state === "open"}
        primaryColor={primaryColor}
      />
    </div>
  );
}