// Tái hiện lỗi sổ chung: hai người khác nhau nhắn cho cùng một bot, rồi người thứ nhất hỏi /tong.
// Không cần token hay mạng: update giả + transformer chặn lời gọi tới Telegram (như thu-offline.ts).
import type { Update, UserFromGetMe } from "grammy/types";

import { taoBot } from "./src/bot.ts";

const botInfo = {
  id: 1, is_bot: true, first_name: "Sổ chi tiêu", username: "so_chi_tieu_bot",
  can_join_groups: false, can_read_all_group_messages: false, supports_inline_queries: false,
  can_connect_to_business: false, has_main_web_app: false, has_topics_enabled: false,
  allows_users_to_create_topics: false, can_manage_bots: false, supports_join_request_queries: false,
} satisfies UserFromGetMe;

const bot = taoBot("token-gia", { botInfo });
let traLoi = "";
bot.api.config.use(async (_prev, _method, payload) => {
  traLoi = (payload as { text?: string }).text ?? "";
  return { ok: true, result: { message_id: 0, date: 0, chat: { id: 0, type: "private", first_name: "" }, text: "" } } as never;
});

const luc = Math.floor(new Date("2026-12-01T06:30+07:00").getTime() / 1000);
let updateId = 0;
function nhan(id: number, ten: string, text: string): Update {
  const nguoi = { id, is_bot: false, first_name: ten };
  return { update_id: ++updateId, message: { message_id: updateId, date: luc, chat: { id, type: "private", first_name: ten }, from: nguoi, text } };
}

for (const [id, ten, text] of [[42, "Mình", "cà phê 35k"], [77, "Bạn mình", "trà sữa 32k"], [42, "Mình", "/tong"]] as const) {
  await bot.handleUpdate(nhan(id, ten, text));
  console.log(`${ten} (id ${id}) nhắn "${text}" → ${traLoi}`);
}
