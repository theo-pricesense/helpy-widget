import { render } from "preact";
import "./styles.css";
import type { HelpyConfig } from "./types";
import { Widget } from "./Widget";

// Re-export types
export type { HelpyConfig, Message, Conversation } from "./types";

let containerElement: HTMLElement | null = null;
let currentConfig: HelpyConfig | null = null;

/**
 * Initialize the Helpy chat widget
 * @param config - Widget configuration
 */
function init(config: HelpyConfig): void {
  if (!config.projectId || !config.apiKey) {
    console.error("Helpy: projectId and apiKey are required");
    return;
  }

  // Remove existing widget if present
  destroy();

  currentConfig = config;

  // Create container
  containerElement = document.createElement("div");
  containerElement.id = "helpy-widget-container";
  document.body.appendChild(containerElement);

  // Render widget
  render(<Widget config={config} />, containerElement);
}

/**
 * Destroy the widget and clean up
 */
function destroy(): void {
  if (containerElement) {
    render(null, containerElement);
    containerElement.remove();
    containerElement = null;
  }
  currentConfig = null;
}

/**
 * Update widget configuration
 * @param config - Partial configuration to update
 */
function update(config: Partial<HelpyConfig>): void {
  if (!currentConfig) {
    console.error("Helpy: Widget not initialized. Call init() first.");
    return;
  }

  init({ ...currentConfig, ...config });
}

/**
 * Open the chat widget
 */
function open(): void {
  const bubble = document.querySelector(".helpy-bubble") as HTMLButtonElement;
  if (bubble) {
    bubble.click();
  }
}

/**
 * Close the chat widget
 */
function close(): void {
  const closeBtn = document.querySelector(
    ".helpy-close-btn"
  ) as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.click();
  }
}

// Helpy SDK object
const Helpy = {
  init,
  destroy,
  update,
  open,
  close,
};

// Auto-init if config is present in window
declare global {
  interface Window {
    Helpy: typeof Helpy;
    helpyConfig?: HelpyConfig;
  }
}

// Expose to window for script tag usage
if (typeof window !== "undefined") {
  window.Helpy = Helpy;

  // Auto-init if config exists
  if (window.helpyConfig) {
    init(window.helpyConfig);
  }
}

export default Helpy;