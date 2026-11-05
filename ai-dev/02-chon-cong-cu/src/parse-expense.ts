// Đọc một tin nhắn chi tiêu theo SPEC.md (v1.1), mục "Quy tắc đọc số tiền".
export type Expense = { note: string; amount: number };

const MAX_AMOUNT = 1_000_000_000;
// 35k · 32K · 3tr · 1tr2 · 45.000 · 50000 · 35 nghìn · 20 ngàn · 2 triệu (một "token" số tiền, đứng riêng)
const AMOUNT = /(?<![\p{L}\d])(\d{1,3}(?:[.,]\d{3})+|\d+)(?:(k|tr)(\d)?|\s+(nghìn|ngàn|triệu))?(?![\p{L}\d])/giu;

const UNIT: Record<string, number> = { k: 1_000, nghìn: 1_000, ngàn: 1_000, tr: 1_000_000, triệu: 1_000_000 };

function toAmount(digits: string, unit: string | undefined, decimal: string | undefined): number {
  const base = Number(digits.replace(/[.,]/g, ""));
  if (!unit) return base;
  const multiplier = UNIT[unit.toLowerCase()];
  // "1tr2": chữ số sau "tr" là hàng trăm nghìn. Regex chỉ cho phép chữ số này ngay sau "k" hoặc "tr".
  if (decimal && multiplier === 1_000_000) return base * multiplier + Number(decimal) * 100_000;
  if (decimal) return Number.NaN; // "35k2" không có trong spec
  return base * multiplier;
}

export function parseExpense(input: string): Expense | null {
  // Tin nhắn gõ trên điện thoại có thể ở dạng dấu tổ hợp (NFD); đưa về một dạng để so khớp "nghìn".
  const message = input.normalize("NFC");
  const matches = [...message.matchAll(AMOUNT)];
  if (matches.length !== 1) return null; // thiếu số tiền, hoặc có nhiều hơn một

  const [token, digits, shortUnit, decimal, wordUnit] = matches[0];
  const amount = toAmount(digits, shortUnit ?? wordUnit, decimal);
  if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_AMOUNT) return null;

  const note = message.replace(token, " ").replace(/\s+/g, " ").trim();
  if (!note) return null;
  return { note, amount };
}
