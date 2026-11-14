// Đồ nghề để thử bot không cần token hay mạng: bot với botInfo giả, một transformer chặn mọi lời gọi tới Telegram
// và ghi lại câu bot định gửi, rồi đưa update giả vào bot.handleUpdate.
import type { Update, UserFromGetMe } from "grammy/types";

import { taoBot } from "./bot.ts";
import { moHinhGia, type KieuGia } from "./mo-hinh.ts";
import { PhanLoai } from "./phan-loai.ts";

export const botInfo = {
  id: 1, is_bot: true, first_name: "Sổ chi tiêu", username: "so_chi_tieu_bot",
  can_join_groups: false, can_read_all_group_messages: false, supports_inline_queries: false,
  can_connect_to_business: false, has_main_web_app: false, has_topics_enabled: false,
  allows_users_to_create_topics: false, can_manage_bots: false, supports_join_request_queries: false,
} satisfies UserFromGetMe;

export function taoUpdate(updateId: number, nguoi: number, text: string): Update {
  return {
    update_id: updateId,
    message: { message_id: updateId, date: 1_796_000_000, chat: { id: nguoi, type: "private", first_name: `Người ${nguoi}` }, from: { id: nguoi, is_bot: false, first_name: `Người ${nguoi}` }, text },
  };
}

export function taoBotThu(kieu: KieuGia, gioiHanMs = 3000) {
  const phanLoai = new PhanLoai(moHinhGia(kieu), gioiHanMs);
  const bot = taoBot("token-gia", phanLoai, { botInfo });
  const daGui: string[] = [];
  bot.api.config.use(async (_prev, _method, payload) => {
    daGui.push((payload as { text?: string }).text ?? "");
    return { ok: true, result: { message_id: 0, date: 0, chat: { id: 0, type: "private", first_name: "" }, text: "" } } as never;
  });
  let updateId = 0;
  return {
    bot,
    phanLoai,
    daGui,
    /** Người dùng `nguoi` nhắn `text`; trả về câu bot trả lời (hoặc null nếu im lặng). */
    async nhan(nguoi: number, text: string): Promise<string | null> {
      daGui.length = 0;
      await bot.handleUpdate(taoUpdate(++updateId, nguoi, text));
      return daGui.at(-1) ?? null;
    },
  };
}
