// Cách 1: chatbot theo luật — dò từ khóa, trả lời theo mẫu có sẵn.
import { messages, type Intent } from "./messages.ts";

const rules: { pattern: RegExp; intent: Intent }[] = [
  { pattern: /giờ|mở cửa/i, intent: "gio-mo-cua" },
  { pattern: /ship|giao/i, intent: "phi-ship" },
  { pattern: /giá|bao nhiêu/i, intent: "gia-mon" },
  { pattern: /đơn/i, intent: "tra-don" },
];

export function ruleBot(text: string): Intent {
  return rules.find((rule) => rule.pattern.test(text))?.intent ?? "khac";
}

let correct = 0;
for (const message of messages) {
  const guess = ruleBot(message.text);
  const ok = guess === message.intent;
  if (ok) correct += 1;
  console.log(`${ok ? "✓" : "✗"} ${message.text}\n    → hiểu là "${guess}"${ok ? "" : `, đúng ra là "${message.intent}"`}`);
}
console.log(`\nĐúng ${correct}/${messages.length} tin nhắn.`);
