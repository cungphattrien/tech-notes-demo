// Thử bot mà không cần token hay mạng: tự dựng update giả, đưa vào bot.handleUpdate,
// và chặn mọi lời gọi tới Telegram bằng một transformer để xem bot định gửi gì.
import type { Update, UserFromGetMe } from "grammy/types";

import { taoBot } from "./src/bot.ts";
import type { Entry } from "./src/so-chi-tieu.ts";

// Có botInfo thì bot không cần gọi getMe lên Telegram lúc khởi động.
const botInfo: UserFromGetMe = {
  id: 1,
  is_bot: true,
  first_name: "Sổ chi tiêu",
  username: "so_chi_tieu_bot",
  can_join_groups: false,
  can_read_all_group_messages: false,
  supports_inline_queries: false,
  can_connect_to_business: false,
  has_main_web_app: false,
  has_topics_enabled: false,
  allows_users_to_create_topics: false,
  can_manage_bots: false,
  supports_join_request_queries: false,
};

const nguoiNhan = { id: 42, is_bot: false, first_name: "Mình" };
const chat = { id: 42, type: "private" as const, first_name: "Mình" };
const giay = (isoGioVN: string) => Math.floor(new Date(`${isoGioVN}+07:00`).getTime() / 1000);

let updateId = 0;
const tinNhan = (text: string, luc: string): Update => ({
  update_id: ++updateId,
  message: { message_id: updateId, date: giay(luc), chat, from: nguoiNhan, text },
});

const UPDATES: [string, Update][] = [
  ['tin nhắn "cà phê 35k"', tinNhan("cà phê 35k", "2026-12-01T06:30")],
  ['tin nhắn "/tong"', tinNhan("/tong", "2026-12-01T06:31")],
  ["một tấm ảnh, không có chữ", { update_id: ++updateId, message: { message_id: updateId, date: giay("2026-12-01T06:32"), chat, from: nguoiNhan, photo: [{ file_id: "f", file_unique_id: "u", width: 90, height: 90 }] } }],
  ['SỬA tin nhắn cũ thành "cà phê 45k"', { update_id: ++updateId, edited_message: { message_id: 1, date: giay("2026-12-01T06:30"), edit_date: giay("2026-12-01T06:33"), chat, from: nguoiNhan, text: "cà phê 45k" } }],
  ['tin nhắn "/tong" lần nữa', tinNhan("/tong", "2026-12-01T06:34")],
];

async function chay(donVi: "giay" | "mili-giay") {
  const so: Entry[] = [];
  const bot = taoBot("token-gia", so, { botInfo }, donVi);
  const daGui: string[] = [];
  // Transformer đứng giữa bot và Telegram: ghi lại lời gọi rồi trả về kết quả giả, không gọi mạng.
  bot.api.config.use(async (_prev, method, payload) => {
    daGui.push(`${method}: ${(payload as { text?: string }).text ?? ""}`);
    return { ok: true, result: { message_id: 0, date: 0, chat, text: "" } } as never;
  });

  console.log(`--- thời điểm tính theo ${donVi === "giay" ? "GIÂY (đúng)" : "MILI GIÂY (sai)"} ---`);
  for (const [moTa, update] of UPDATES) {
    daGui.length = 0;
    await bot.handleUpdate(update);
    console.log(`${moTa} → ${daGui.length ? daGui.join(" | ") : "(bot không trả lời)"}`);
  }
  console.log();
}

await chay("giay");
await chay("mili-giay");
