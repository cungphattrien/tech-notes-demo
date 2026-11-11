// Xử lý một tin nhắn theo SPEC.md (v1.2): ghi khoản chi, hoặc trả lời lệnh.
// Dữ liệu tạm giữ trong bộ nhớ; các tập sau mới lưu vào database.
import { parseExpense } from "./parse-expense.ts";

// messageId: id tin nhắn Telegram đã tạo ra khoản chi, để tìm lại khi người dùng sửa tin nhắn đó.
export type Entry = { note: string; amount: number; at: Date; messageId?: number };

const HUONG_DAN = 'Mình chưa hiểu. Nhắn kiểu "cà phê 35k" để ghi một khoản chi, hoặc /tong để xem tổng tháng này.';

// Tạo MỘT lần rồi dùng lại: tạo Intl.DateTimeFormat mới ở mỗi lần gọi chậm hơn hàng chục lần (xem do-toc-do.ts).
// "en-GB" vì nó trả về đúng "12/2026"; "vi-VN" trả về "tháng 12, 2026".
const THANG_VN = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit", year: "numeric" });

// Tháng/năm theo giờ Việt Nam, kể cả khi máy chủ chạy theo giờ UTC.
function thangVN(date: Date): string {
  const parts = THANG_VN.formatToParts(date);
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  if (!month || !year) throw new Error(`Không tách được tháng/năm từ ${date.toISOString()}`);
  return `${month}/${year}`;
}

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export function tongThang(entries: Entry[], now: Date): string {
  const thang = thangVN(now);
  const trongThang = entries.filter((entry) => thangVN(entry.at) === thang);
  if (trongThang.length === 0) return `Tháng ${thang} chưa có khoản chi nào.`;
  const tong = trongThang.reduce((sum, entry) => sum + entry.amount, 0);
  return `Tháng ${thang}: ${trongThang.length} khoản, tổng ${vnd(tong)}`;
}

export function handleMessage(text: string, now: Date, entries: Entry[]): string {
  const message = text.trim().normalize("NFC");
  // Tin nhắn bắt đầu bằng "/" là lệnh, không bao giờ là khoản chi (spec v1.2).
  if (message.startsWith("/")) {
    const lenh = message.toLowerCase();
    if (lenh === "/tong" || lenh === "/tổng") return tongThang(entries, now);
    return `Mình chưa có lệnh ${message.split(/\s/)[0]}. Nhắn /tong để xem tổng tháng này.`;
  }

  const expense = parseExpense(message);
  if (!expense) return HUONG_DAN;
  entries.push({ ...expense, at: now });
  return `Đã ghi: ${expense.note}, ${vnd(expense.amount)}`;
}
