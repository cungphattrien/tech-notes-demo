// Đọc một tin nhắn chi tiêu theo SPEC.md, mục "Quy tắc đọc số tiền".
export type Expense = { note: string; amount: number };

const MAX_AMOUNT = 1_000_000_000;
// 35k · 32K · 3tr · 1tr2 · 45.000 · 50000 (một "token" số tiền, đứng riêng)
const AMOUNT = /(?<![\p{L}\d])(\d{1,3}(?:[.,]\d{3})+|\d+)(k|tr(\d)?)?(?![\p{L}\d])/giu;

function toAmount(digits: string, unit: string | undefined, decimal: string | undefined): number {
  const base = Number(digits.replace(/[.,]/g, ""));
  const lower = unit?.toLowerCase();
  if (lower === "k") return base * 1_000;
  if (lower?.startsWith("tr")) return base * 1_000_000 + Number(decimal ?? 0) * 100_000;
  return base;
}

export function parseExpense(message: string): Expense | null {
  const matches = [...message.matchAll(AMOUNT)];
  if (matches.length !== 1) return null; // thiếu số tiền, hoặc có nhiều hơn một

  const [token, digits, unit, decimal] = matches[0];
  const amount = toAmount(digits, unit, decimal);
  if (amount <= 0 || amount > MAX_AMOUNT) return null;

  const note = message.replace(token, " ").replace(/\s+/g, " ").trim();
  if (!note) return null;
  return { note, amount };
}
