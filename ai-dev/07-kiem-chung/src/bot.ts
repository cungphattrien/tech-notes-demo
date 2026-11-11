// Nối app sổ chi tiêu với Telegram qua grammY. Mọi logic vẫn nằm trong handleMessage.
import { Bot, type BotConfig, type Context } from "grammy";

import { parseExpense } from "./parse-expense.ts";
import { handleMessage, vnd, type Entry } from "./so-chi-tieu.ts";

// donVi chỉ để minh họa lỗi đơn vị thời gian ở bài trước; code thật luôn dùng "giay".
export function taoBot(token: string, config?: BotConfig<Context>, donVi: "giay" | "mili-giay" = "giay"): Bot {
  const bot = new Bot(token, config);
  // Mỗi người dùng Telegram một cuốn sổ riêng, theo id của họ. Trước đây cả bot dùng chung một mảng.
  const soTheoNguoi = new Map<number, Entry[]>();

  // "message:text" chỉ khớp tin nhắn MỚI có chữ: không khớp ảnh, sticker hay tin nhắn được sửa (xem handler bên dưới).
  bot.on("message:text", async (ctx) => {
    const nguoi = ctx.from.id;
    let so = soTheoNguoi.get(nguoi);
    if (!so) {
      so = [];
      soTheoNguoi.set(nguoi, so);
    }
    // Telegram gửi thời điểm theo GIÂY (Unix time), còn Date của JavaScript cần mili giây.
    const luc = new Date(donVi === "giay" ? ctx.message.date * 1000 : ctx.message.date);
    const soKhoanTruoc = so.length;
    const traLoi = handleMessage(ctx.message.text, luc, so);
    // Nhớ tin nhắn nào đã tạo ra khoản chi vừa ghi, để còn tìm lại khi người dùng sửa tin nhắn đó.
    if (so.length > soKhoanTruoc) so[so.length - 1].messageId = ctx.message.message_id;
    await ctx.reply(traLoi);
  });

  // Người dùng sửa một tin nhắn đã gửi (spec v1.3): cập nhật đúng khoản chi do tin nhắn đó tạo ra, không ghi thêm.
  // Bộ lọc là "edited_message:text" (dấu hai chấm): tin nhắn được sửa là một loại update riêng, khác "message".
  bot.on("edited_message:text", async (ctx) => {
    const so = soTheoNguoi.get(ctx.from.id) ?? [];
    const khoanChi = so.find((entry) => entry.messageId === ctx.editedMessage.message_id);
    if (!khoanChi) return; // sửa một tin nhắn không phải khoản chi, hoặc bot đã khởi động lại và quên sổ
    const khoanMoi = parseExpense(ctx.editedMessage.text.trim().normalize("NFC"));
    if (!khoanMoi) return void (await ctx.reply("Mình không đọc được khoản chi sau khi sửa, nên giữ nguyên khoản cũ."));
    khoanChi.note = khoanMoi.note;
    khoanChi.amount = khoanMoi.amount;
    await ctx.reply(`Đã sửa: ${khoanMoi.note}, ${vnd(khoanMoi.amount)}`);
  });

  // catch là một HÀM nhận error handler. Không có nó, lỗi trong handler sẽ làm bot dừng nhận tin.
  bot.catch((err) => console.error(`Lỗi khi xử lý update ${err.ctx.update.update_id}:`, err.error));
  return bot;
}
