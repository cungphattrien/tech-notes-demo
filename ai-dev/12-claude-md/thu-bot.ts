// Nhắn vài tin cho bot, lần đầu với AI hoạt động tốt, lần hai khi AI lỗi mạng. Chạy: node thu-bot.ts
import { taoBotThu } from "./src/thu-bot.ts";

async function kichBan(tieuDe: string, kieu: "ngoan" | "loi") {
  console.log(`--- ${tieuDe}`);
  const bot = taoBotThu(kieu);
  for (const tin of ["cà phê 35k", "grab đi làm 62k", "tiền nhà 3tr", "mua áo 250k", "cà phê 35k", "/loai"]) {
    console.log(`Bạn: ${tin}\nBot: ${await bot.nhan(42, tin)}`);
  }
  console.log(`(số lần gọi AI: ${bot.phanLoai.soLuotGoi})\n`);
}

await kichBan("AI hoạt động bình thường", "ngoan");
await kichBan("AI lỗi mạng (mọi lần gọi đều ném lỗi)", "loi");
