// Chạy bot thật: BOT_TOKEN=<token từ @BotFather> node src/chay-bot.ts
import { taoBot } from "./bot.ts";
import type { Entry } from "./so-chi-tieu.ts";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("Thiếu biến môi trường BOT_TOKEN (lấy từ @BotFather trên Telegram).");

const so: Entry[] = []; // tạm giữ trong bộ nhớ: tắt bot là mất
const bot = taoBot(token, so);
await bot.start({ onStart: (me) => console.log(`Bot @${me.username} đang nhận tin nhắn. Nhấn Ctrl+C để dừng.`) });
