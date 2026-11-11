// Đồ nghề để thử bot không cần token hay mạng: dựng bot với botInfo giả, chặn mọi lời gọi tới Telegram
// bằng một transformer và ghi lại, rồi đưa update giả vào bot.handleUpdate. Chung cho các file test.
import type { Update, UserFromGetMe } from "grammy/types";

import { taoBot } from "./bot.ts";

const botInfo = {
  id: 1, is_bot: true, first_name: "Sổ chi tiêu", username: "so_chi_tieu_bot",
  can_join_groups: false, can_read_all_group_messages: false, supports_inline_queries: false,
  can_connect_to_business: false, has_main_web_app: false, has_topics_enabled: false,
  allows_users_to_create_topics: false, can_manage_bots: false, supports_join_request_queries: false,
} satisfies UserFromGetMe;

const giay = (isoGioVN: string) => Math.floor(new Date(`${isoGioVN}+07:00`).getTime() / 1000);

export function taoBotThu() {
  const bot = taoBot("token-gia", { botInfo });
  const daGui: string[] = [];
  bot.api.config.use(async (_prev, _method, payload) => {
    daGui.push((payload as { text?: string }).text ?? "");
    return { ok: true, result: { message_id: 0, date: 0, chat: { id: 0, type: "private", first_name: "" }, text: "" } } as never;
  });

  let updateId = 0;
  const chatCua = (id: number) => ({ id, type: "private" as const, first_name: `Người ${id}` });
  const nguoi = (id: number) => ({ id, is_bot: false, first_name: `Người ${id}` });

  return {
    bot, // để test cần gọi thẳng vào bot khi có lý do
    daGui,
    /** Người dùng `id` nhắn `text` lúc `luc` (giờ Việt Nam, dạng ISO). Trả về câu bot trả lời, hoặc null nếu bot im lặng. */
    async nhan(id: number, text: string, luc = "2026-12-01T06:30"): Promise<string | null> {
      daGui.length = 0;
      const update: Update = { update_id: ++updateId, message: { message_id: updateId, date: giay(luc), chat: chatCua(id), from: nguoi(id), text } };
      await bot.handleUpdate(update);
      return daGui.at(-1) ?? null;
    },
    /** Người dùng `id` gửi một tấm ảnh, không có chữ. */
    async guiAnh(id: number, luc = "2026-12-01T06:30"): Promise<string | null> {
      daGui.length = 0;
      const update: Update = { update_id: ++updateId, message: { message_id: updateId, date: giay(luc), chat: chatCua(id), from: nguoi(id), photo: [{ file_id: "f", file_unique_id: "u", width: 90, height: 90 }] } };
      await bot.handleUpdate(update);
      return daGui.at(-1) ?? null;
    },
    /** Người dùng `id` SỬA một tin nhắn cũ thành `text`. */
    async sua(id: number, text: string, luc = "2026-12-01T06:30"): Promise<string | null> {
      daGui.length = 0;
      const update: Update = { update_id: ++updateId, edited_message: { message_id: 1, date: giay(luc), edit_date: giay(luc), chat: chatCua(id), from: nguoi(id), text } };
      await bot.handleUpdate(update);
      return daGui.at(-1) ?? null;
    },
  };
}
