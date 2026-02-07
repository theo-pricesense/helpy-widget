import { useState } from "preact/hooks";

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder: string;
  disabled: boolean;
  primaryColor: string;
}

export function MessageInput({
  onSend,
  placeholder,
  disabled,
  primaryColor,
}: MessageInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form class="helpy-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        class="helpy-input"
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        class="helpy-send-btn"
        disabled={disabled || !value.trim()}
        style={{ backgroundColor: primaryColor }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </form>
  );
}