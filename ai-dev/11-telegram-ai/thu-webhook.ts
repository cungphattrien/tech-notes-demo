// Gửi ba yêu cầu giả tới handler webhook: thiếu header, sai secret, đúng secret. Chạy: node thu-webhook.ts
import { taoWebhook } from "./src/bot.ts";
import { taoBotThu, taoUpdate } from "./src/thu-bot.ts";

const SECRET = "bi-mat-demo-123"; // chỉ dùng để thử; secret thật bạn tự sinh và cất trong biến môi trường
const { bot, daGui } = taoBotThu("ngoan");
const webhook = taoWebhook(bot, SECRET);

const goi = (header: string | null) =>
  webhook(new Request("https://example.com/api/telegram", {
    method: "POST",
    headers: { "content-type": "application/json", ...(header ? { "X-Telegram-Bot-Api-Secret-Token": header } : {}) },
    body: JSON.stringify(taoUpdate(1, 42, "cà phê 35k")),
  }));

for (const [ten, header] of [["thiếu header", null], ["sai secret", "doan-bua"], ["đúng secret", SECRET]] as const) {
  const res = await goi(header);
  console.log(`${ten.padEnd(13)} -> HTTP ${res.status}, bot trả lời ${daGui.length} lần`);
  daGui.length = 0;
}
