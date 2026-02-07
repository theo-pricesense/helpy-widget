import { useState } from "preact/hooks";
import type { Translations } from "../locales";
import type { CustomerInfo, PreChatFormConfig } from "../types";

interface PreChatFormProps {
  config: PreChatFormConfig;
  translations: Translations;
  primaryColor: string;
  onSubmit: (customer: Partial<CustomerInfo>) => void;
  onClose: () => void;
}

export function PreChatForm({
  config,
  translations: t,
  primaryColor,
  onSubmit,
  onClose,
}: PreChatFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  // Default: both enabled but NOT required
  const emailField = config.fields?.email ?? { enabled: true, required: false };
  const nameField = config.fields?.name ?? { enabled: true, required: false };

  const validateEmail = (value: string) => {
    if (!value && emailField.required) {
      return t.emailRequired;
    }
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t.emailInvalid;
    }
    return undefined;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const newErrors: { email?: string; name?: string } = {};

    if (emailField.enabled) {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    }

    if (nameField.enabled && nameField.required && !name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customer: Partial<CustomerInfo> = {};
    if (email) customer.email = email;
    if (name) customer.name = name;

    onSubmit(customer);
  };

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
            <h3 class="helpy-header-title">{t.headerTitle}</h3>
            <p class="helpy-header-subtitle">{t.headerSubtitle}</p>
          </div>
        </div>
        <button
          type="button"
          class="helpy-close-btn"
          onClick={onClose}
          aria-label="Close"
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

      <div class="helpy-prechat">
        <div class="helpy-prechat-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={primaryColor}
            stroke-width="1.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        </div>

        <h2 class="helpy-prechat-title">
          {config.title || t.preChatTitle}
        </h2>
        <p class="helpy-prechat-subtitle">
          {config.subtitle || t.preChatSubtitle}
        </p>

        <form class="helpy-prechat-form" onSubmit={handleSubmit}>
          {nameField.enabled && (
            <div class="helpy-form-field">
              <label class="helpy-form-label">
                {t.nameLabel}
                {nameField.required && <span class="helpy-required">*</span>}
              </label>
              <input
                type="text"
                class={`helpy-form-input ${errors.name ? "helpy-form-input-error" : ""}`}
                placeholder={nameField.placeholder || t.namePlaceholder}
                value={name}
                onInput={(e) => {
                  setName((e.target as HTMLInputElement).value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              {errors.name && <span class="helpy-form-error">{errors.name}</span>}
            </div>
          )}

          {emailField.enabled && (
            <div class="helpy-form-field">
              <label class="helpy-form-label">
                {t.emailLabel}
                {emailField.required && <span class="helpy-required">*</span>}
              </label>
              <input
                type="email"
                class={`helpy-form-input ${errors.email ? "helpy-form-input-error" : ""}`}
                placeholder={emailField.placeholder || t.emailPlaceholder}
                value={email}
                onInput={(e) => {
                  setEmail((e.target as HTMLInputElement).value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && <span class="helpy-form-error">{errors.email}</span>}
            </div>
          )}

          <button
            type="submit"
            class="helpy-prechat-submit"
            style={{ backgroundColor: primaryColor }}
          >
            {config.submitText || t.submitButton}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        <p class="helpy-prechat-privacy">{t.privacyText}</p>
      </div>
    </div>
  );
}
