// Đoạn code "AI viết" khi được nhờ: "khi người dùng sửa một tin nhắn thì cập nhật khoản chi đã ghi".
// Đây là bản mình dựng để minh họa, không trích từ một lần chạy AI cụ thể. Nó đọc rất hợp lý và có ba chỗ bịa.
import { Bot } from "grammy";

import { parseExpense } from "../src/parse-expense.ts";
import type { Entry } from "../src/so-chi-tieu.ts";

const bot = new Bot("token-gia");
const soTheoNguoi = new Map<number, Entry[]>();

bot.on("edited_message.text", async (ctx) => {
  const so = soTheoNguoi.get(ctx.from.id) ?? [];
  const khoanMoi = parseExpense(ctx.editedMessage.text ?? "");
  so.capNhat(ctx.editedMessage.message_id, khoanMoi);
  await ctx.replyWithMarkdown("Đã cập nhật khoản chi");
});

console.log("Đã đăng ký xong handler sửa tin nhắn.");
