export interface CustomerInfo {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PreChatFormConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  fields?: {
    email?: { enabled: boolean; required?: boolean; placeholder?: string };
    name?: { enabled: boolean; required?: boolean; placeholder?: string };
  };
  submitText?: string;
}

export interface HelpyConfig {
  projectId: string;
  apiKey: string;
  apiUrl?: string;

  // Locale (default: 'ko')
  locale?: "ko" | "en" | "ja" | "zh";

  // Customer identification (optional)
  customer?: CustomerInfo;

  // Pre-chat form (collect email/name before chat)
  preChatForm?: PreChatFormConfig;

  // UI customization
  position?: "bottom-left" | "bottom-right";
  theme?: "light" | "dark" | "auto";
  primaryColor?: string;
  welcomeMessage?: string;
  placeholder?: string;
  zIndex?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "USER" | "AI" | "AGENT";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  sessionId?: string;
  customerId?: string;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface StartConversationResponse {
  conversation: Conversation;
  welcomeMessage?: Message;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
}

export type WidgetState = "closed" | "open" | "minimized";
