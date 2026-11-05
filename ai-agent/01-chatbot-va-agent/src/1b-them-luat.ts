// Thử "vá" chatbot theo luật: đưa luật "đơn" lên đầu và thêm từ "đặt".
// Ba câu hỏi về đơn hàng được sửa — nhưng xem chuyện gì xảy ra với hai tin nhắn mới.
import { messages, type Intent } from "./messages.ts";

const patchedRules: { pattern: RegExp; intent: Intent }[] = [
  { pattern: /đơn|đặt/i, intent: "tra-don" }, // vá: ưu tiên câu hỏi về đơn
  { pattern: /giờ|mở cửa/i, intent: "gio-mo-cua" },
  { pattern: /ship|giao/i, intent: "phi-ship" },
  { pattern: /giá|bao nhiêu/i, intent: "gia-mon" },
];

const bot = (text: string): Intent => patchedRules.find((rule) => rule.pattern.test(text))?.intent ?? "khac";

const newMessages: { text: string; intent: Intent }[] = [
  { text: "Quán có giao đơn lẻ 1 ly không ạ?", intent: "phi-ship" },
  { text: "Bánh mì trứng có đặt trước được không, giá sao ạ?", intent: "gia-mon" },
];

let correct = 0;
const all = [...messages, ...newMessages];
for (const message of all) {
  const guess = bot(message.text);
  if (guess === message.intent) correct += 1;
  else console.log(`✗ ${message.text}\n    → hiểu là "${guess}", đúng ra là "${message.intent}"`);
}
console.log(`\nĐúng ${correct}/${all.length} tin nhắn (8 tin cũ + 2 tin mới).`);
