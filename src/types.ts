export interface HelpyConfig {
  projectId: string;
  apiKey: string;
  apiUrl?: string;
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
  sessionId: string;
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