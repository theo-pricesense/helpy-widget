export type Locale = "ko" | "en" | "ja" | "zh";

export interface Translations {
  // Header
  headerTitle: string;
  headerSubtitle: string;

  // Chat
  welcomeMessage: string;
  placeholder: string;

  // Pre-chat form
  preChatTitle: string;
  preChatSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  privacyText: string;

  // Validation
  emailRequired: string;
  emailInvalid: string;
  nameRequired: string;

  // Badges
  aiBadge: string;
  agentBadge: string;
}

const ko: Translations = {
  headerTitle: "Helpy AI",
  headerSubtitle: "언제든 도움을 드릴게요",

  welcomeMessage: "안녕하세요! 무엇을 도와드릴까요?",
  placeholder: "메시지를 입력하세요...",

  preChatTitle: "문의하기",
  preChatSubtitle: "보통 몇 분 내에 답변드려요.",
  nameLabel: "이름",
  namePlaceholder: "이름을 입력하세요",
  emailLabel: "이메일",
  emailPlaceholder: "example@email.com",
  submitButton: "대화 시작하기",
  privacyText: "대화를 시작하면 개인정보 처리방침에 동의하게 됩니다.",

  emailRequired: "이메일을 입력해주세요",
  emailInvalid: "올바른 이메일 형식을 입력해주세요",
  nameRequired: "이름을 입력해주세요",

  aiBadge: "AI",
  agentBadge: "상담사",
};

const en: Translations = {
  headerTitle: "Helpy AI",
  headerSubtitle: "Always here to help",

  welcomeMessage: "Hi! How can I help you today?",
  placeholder: "Type a message...",

  preChatTitle: "Start a conversation",
  preChatSubtitle: "We usually reply within a few minutes.",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  emailLabel: "Email",
  emailPlaceholder: "your@email.com",
  submitButton: "Start chat",
  privacyText: "By starting a chat, you agree to our privacy policy.",

  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email",
  nameRequired: "Name is required",

  aiBadge: "AI",
  agentBadge: "Agent",
};

const ja: Translations = {
  headerTitle: "Helpy AI",
  headerSubtitle: "いつでもお手伝いします",

  welcomeMessage: "こんにちは！何かお手伝いできますか？",
  placeholder: "メッセージを入力...",

  preChatTitle: "お問い合わせ",
  preChatSubtitle: "通常、数分以内に返信いたします。",
  nameLabel: "お名前",
  namePlaceholder: "お名前を入力",
  emailLabel: "メール",
  emailPlaceholder: "example@email.com",
  submitButton: "チャットを開始",
  privacyText: "チャットを開始すると、プライバシーポリシーに同意したことになります。",

  emailRequired: "メールアドレスを入力してください",
  emailInvalid: "有効なメールアドレスを入力してください",
  nameRequired: "お名前を入力してください",

  aiBadge: "AI",
  agentBadge: "担当者",
};

const zh: Translations = {
  headerTitle: "Helpy AI",
  headerSubtitle: "随时为您提供帮助",

  welcomeMessage: "您好！有什么可以帮助您的吗？",
  placeholder: "输入消息...",

  preChatTitle: "开始对话",
  preChatSubtitle: "我们通常会在几分钟内回复。",
  nameLabel: "姓名",
  namePlaceholder: "请输入姓名",
  emailLabel: "邮箱",
  emailPlaceholder: "example@email.com",
  submitButton: "开始聊天",
  privacyText: "开始聊天即表示您同意我们的隐私政策。",

  emailRequired: "请输入邮箱",
  emailInvalid: "请输入有效的邮箱地址",
  nameRequired: "请输入姓名",

  aiBadge: "AI",
  agentBadge: "客服",
};

const locales: Record<Locale, Translations> = {
  ko,
  en,
  ja,
  zh,
};

export function getTranslations(locale: Locale = "ko"): Translations {
  return locales[locale] || locales.ko;
}

export default locales;
