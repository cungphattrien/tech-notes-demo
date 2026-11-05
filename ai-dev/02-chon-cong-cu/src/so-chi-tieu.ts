// Xử lý một tin nhắn theo SPEC.md: ghi khoản chi, hoặc trả lời lệnh /tong.
// Dữ liệu tạm giữ trong bộ nhớ; các tập sau mới lưu vào database.
import { parseExpense } from "./parse-expense.ts";

export type Entry = { note: string; amount: number; at: Date };

const VN_TIME = "Asia/Ho_Chi_Minh";
const HUONG_DAN = 'Mình chưa hiểu. Nhắn kiểu "cà phê 35k" để ghi một khoản chi, hoặc /tong để xem tổng tháng này.';

// Tháng/năm theo giờ Việt Nam, kể cả khi máy chủ chạy theo giờ UTC.
function thangVN(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: VN_TIME, month: "2-digit", year: "numeric" }).formatToParts(date);
  const month = parts.find((p) => p.type === "month")!.value;
  const year = parts.find((p) => p.type === "year")!.value;
  return `${month}/${year}`;
}

const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export function tongThang(entries: Entry[], now: Date): string {
  const thang = thangVN(now);
  const trongThang = entries.filter((entry) => thangVN(entry.at) === thang);
  if (trongThang.length === 0) return `Tháng ${thang} chưa có khoản chi nào.`;
  const tong = trongThang.reduce((sum, entry) => sum + entry.amount, 0);
  return `Tháng ${thang}: ${trongThang.length} khoản, tổng ${vnd(tong)}`;
}

export function handleMessage(text: string, now: Date, entries: Entry[]): string {
  if (text.trim().toLowerCase() === "/tong") return tongThang(entries, now);

  const expense = parseExpense(text);
  if (!expense) return HUONG_DAN;
  entries.push({ ...expense, at: now });
  return `Đã ghi: ${expense.note}, ${vnd(expense.amount)}`;
}
