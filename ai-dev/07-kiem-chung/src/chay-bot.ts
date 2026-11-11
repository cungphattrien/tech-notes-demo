// Chạy bot thật: BOT_TOKEN=<token từ @BotFather> node src/chay-bot.ts
import { taoBot } from "./bot.ts";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("Thiếu biến môi trường BOT_TOKEN (lấy từ @BotFather trên Telegram).");

const bot = taoBot(token); // sổ của từng người tạm giữ trong bộ nhớ: tắt bot là mất
await bot.start({ onStart: (me) => console.log(`Bot @${me.username} đang nhận tin nhắn. Nhấn Ctrl+C để dừng.`) });
