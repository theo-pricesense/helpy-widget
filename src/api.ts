import type {
  Conversation,
  Message,
  StartConversationResponse,
} from "./types";

const DEFAULT_API_URL = "https://api.helpy.io";

export interface StreamCallbacks {
  onStart?: (userMessage: Message) => void;
  onToken?: (token: string, fullContent: string) => void;
  onComplete?: (aiMessage: Message) => void;
  onError?: (error: Error) => void;
}

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

  async startConversation(
    sessionId: string
  ): Promise<StartConversationResponse> {
    return this.request<StartConversationResponse>("/widget/conversations", {
      method: "POST",
      body: JSON.stringify({
        projectId: this.projectId,
        sessionId,
      }),
    });
  }

  /**
   * Send a message with SSE streaming response
   */
  async sendMessageStream(
    conversationId: string,
    content: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const url = `${this.apiUrl}/widget/conversations/${conversationId}/messages/stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              switch (parsed.type) {
                case "user_message":
                  callbacks.onStart?.(parsed.message);
                  break;

                case "token":
                  fullContent += parsed.token;
                  callbacks.onToken?.(parsed.token, fullContent);
                  break;

                case "ai_message":
                  callbacks.onComplete?.(parsed.message);
                  break;

                case "error":
                  callbacks.onError?.(new Error(parsed.message));
                  break;
              }
            } catch {
              // Ignore parse errors for non-JSON data
            }
          }
        }
      }
    } catch (error) {
      callbacks.onError?.(
        error instanceof Error ? error : new Error("Stream failed")
      );
    }
  }

  /**
   * Send a message without streaming (fallback)
   */
  async sendMessage(
    conversationId: string,
    content: string
  ): Promise<{ userMessage: Message; aiMessage: Message }> {
    return this.request<{ userMessage: Message; aiMessage: Message }>(
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
