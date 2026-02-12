import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { HelpyApi } from "./api";
import { ChatBubble } from "./components/ChatBubble";
import { ChatWindow } from "./components/ChatWindow";
import { PreChatForm } from "./components/PreChatForm";
import { getTranslations } from "./locales";
import type { CustomerInfo, HelpyConfig, Message, WidgetState } from "./types";

interface WidgetProps {
  config: HelpyConfig;
}

const SESSION_KEY = "helpy_session_id";
const CONVERSATION_KEY = "helpy_conversation_id";
const CUSTOMER_KEY = "helpy_customer";

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getSavedCustomer(): Partial<CustomerInfo> | null {
  try {
    const saved = localStorage.getItem(CUSTOMER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function Widget({ config }: WidgetProps) {
  const [state, setState] = useState<WidgetState>("closed");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem(CONVERSATION_KEY)
  );
  const [isRequestingAgent, setIsRequestingAgent] = useState(false);
  const [agentRequested, setAgentRequested] = useState(false);
  const [collectedCustomer, setCollectedCustomer] = useState<Partial<CustomerInfo> | null>(
    getSavedCustomer()
  );
  const [api] = useState(
    () => new HelpyApi(config.projectId, config.apiKey, config.apiUrl)
  );

  const translations = useMemo(
    () => getTranslations(config.locale || "ko"),
    [config.locale]
  );
  const primaryColor = config.primaryColor || "#0891b2";
  const position = config.position || "bottom-right";

  // Check if we need to show pre-chat form
  const needsPreChatForm =
    config.preChatForm?.enabled &&
    !config.customer && // Not already identified by parent site
    !collectedCustomer && // Not already collected
    !conversationId; // No existing conversation

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
      // Priority: config.customer > collectedCustomer > sessionId
      let params: { customer?: CustomerInfo; sessionId?: string };

      if (config.customer) {
        params = { customer: config.customer };
      } else if (collectedCustomer) {
        params = {
          customer: {
            id: collectedCustomer.email || getSessionId(),
            ...collectedCustomer,
          } as CustomerInfo,
        };
      } else {
        params = { sessionId: getSessionId() };
      }

      const result = await api.startConversation(params);
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
  }, [api, config.customer, collectedCustomer]);

  const handlePreChatSubmit = useCallback((customer: Partial<CustomerInfo>) => {
    setCollectedCustomer(customer);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      let currentConversationId = conversationId;

      // Start conversation if needed
      if (!currentConversationId) {
        currentConversationId = await startConversation();
        if (!currentConversationId) return;
      }

      setIsLoading(true);
      setStreamingContent("");

      await api.sendMessageStream(currentConversationId, content, {
        onStart: (userMessage) => {
          setMessages((prev) => [...prev, userMessage]);
        },
        onToken: (_token, fullContent) => {
          setStreamingContent(fullContent);
        },
        onComplete: (aiMessage) => {
          setMessages((prev) => [...prev, aiMessage]);
          setStreamingContent("");
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("Stream error:", error);
          setStreamingContent("");
          setIsLoading(false);
        },
      });
    },
    [conversationId, api, startConversation]
  );

  const handleRequestAgent = useCallback(async () => {
    if (!conversationId || isRequestingAgent || agentRequested) return;

    setIsRequestingAgent(true);
    try {
      await api.requestAgent(conversationId);
      setAgentRequested(true);
    } catch (error) {
      console.error("Failed to request agent:", error);
    } finally {
      setIsRequestingAgent(false);
    }
  }, [conversationId, api, isRequestingAgent, agentRequested]);

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
      {state === "open" && needsPreChatForm && (
        <PreChatForm
          config={config.preChatForm!}
          translations={translations}
          primaryColor={primaryColor}
          onSubmit={handlePreChatSubmit}
          onClose={closeWidget}
        />
      )}
      {state === "open" && !needsPreChatForm && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          streamingContent={streamingContent}
          translations={translations}
          onSend={handleSend}
          onClose={closeWidget}
          onRequestAgent={handleRequestAgent}
          isRequestingAgent={isRequestingAgent}
          agentRequested={agentRequested}
          welcomeMessage={config.welcomeMessage}
          placeholder={config.placeholder}
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
