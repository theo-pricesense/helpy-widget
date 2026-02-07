import type {
  Conversation,
  Message,
  SendMessageResponse,
  StartConversationResponse,
} from "./types";

const DEFAULT_API_URL = "https://api.helpy.io";

export class HelpyApi {
  private apiUrl: string;
  private apiKey: string;
  private projectId: string;

  constructor(projectId: string, apiKey: string, apiUrl?: string) {
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || DEFAULT_API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async startConversation(sessionId: string): Promise<StartConversationResponse> {
    return this.request<StartConversationResponse>("/widget/conversations", {
      method: "POST",
      body: JSON.stringify({
        projectId: this.projectId,
        sessionId,
      }),
    });
  }

  async sendMessage(
    conversationId: string,
    content: string
  ): Promise<SendMessageResponse> {
    return this.request<SendMessageResponse>(
      `/widget/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      }
    );
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.request<Message[]>(
      `/widget/conversations/${conversationId}/messages`
    );
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request<Conversation>(
      `/widget/conversations/${conversationId}`
    );
  }
}