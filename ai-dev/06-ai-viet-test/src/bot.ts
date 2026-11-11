// Nối app sổ chi tiêu với Telegram qua grammY. Mọi logic vẫn nằm trong handleMessage.
import { Bot, type BotConfig, type Context } from "grammy";

import { handleMessage, type Entry } from "./so-chi-tieu.ts";

// donVi chỉ để minh họa lỗi đơn vị thời gian ở bài trước; code thật luôn dùng "giay".
export function taoBot(token: string, config?: BotConfig<Context>, donVi: "giay" | "mili-giay" = "giay"): Bot {
  const bot = new Bot(token, config);
  // Mỗi người dùng Telegram một cuốn sổ riêng, theo id của họ. Trước đây cả bot dùng chung một mảng.
  const soTheoNguoi = new Map<number, Entry[]>();

  // "message:text" chỉ khớp tin nhắn MỚI có chữ: không khớp ảnh, sticker hay tin nhắn được sửa.
  bot.on("message:text", async (ctx) => {
    const nguoi = ctx.from.id;
    let so = soTheoNguoi.get(nguoi);
    if (!so) {
      so = [];
      soTheoNguoi.set(nguoi, so);
    }
    // Telegram gửi thời điểm theo GIÂY (Unix time), còn Date của JavaScript cần mili giây.
    const luc = new Date(donVi === "giay" ? ctx.message.date * 1000 : ctx.message.date);
    await ctx.reply(handleMessage(ctx.message.text, luc, so));
  });

  // catch là một HÀM nhận error handler. Không có nó, lỗi trong handler sẽ làm bot dừng nhận tin.
  bot.catch((err) => console.error(`Lỗi khi xử lý update ${err.ctx.update.update_id}:`, err.error));
  return bot;
}
