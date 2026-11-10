// BẢN NHÁP ĐẦU TIÊN: AI viết theo trí nhớ, chưa đọc mã nguồn của grammY trong node_modules.
// Giữ lại để so sánh. Chạy `npx tsc` sẽ thấy nó sai ở đâu.
import { Bot } from "grammy";

const bot = new Bot("token-gia", {
  botInfo: {
    id: 1,
    is_bot: true,
    first_name: "Sổ chi tiêu",
    username: "so_chi_tieu_bot",
    can_join_groups: false,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
  },
});

bot.on("message:text", (ctx) => ctx.reply(`Bạn vừa nhắn: ${ctx.message.text}`));

// Làm theo đúng lời nhắc mà grammY in ra khi chưa có error handler.
bot.catch = (err) => console.error("Lỗi:", err.error);
