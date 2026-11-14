// Cùng một cuộc trò chuyện chạy hai lần: bản đầu (không có trạng thái, không có phiếu) và bản có tổng đài.
import { NhatKy } from "./src/nhat-ky.ts";
import { xuLyNgayTho } from "./src/ngay-tho.ts";
import { TongDai } from "./src/tong-dai.ts";

const KHACH = ["Đơn 1042 giao trễ gần hai tiếng rồi, đền mình nhé", "Cho mình gặp nhân viên", "alo, có ai không?"];

console.log("--- Bản đầu ---");
for (const tin of KHACH) {
  console.log(`Khách: ${tin}`);
  console.log(`Mộc:   ${xuLyNgayTho(tin)}`);
}

console.log("\n--- Bản có tổng đài ---");
const tongDai = new TongDai(new NhatKy(() => new Date("2026-11-20T03:10:00Z")), () => new Date("2026-11-20T03:10:00Z"));
for (const tin of KHACH) {
  console.log(`Khách: ${tin}`);
  console.log(`Mộc:   ${tongDai.khach("h-01", tin)}`);
}
console.log(`\nPhiếu đang chờ: ${tongDai.phieu.length}`);
for (const p of tongDai.phieu) console.log(`${p.ma}: ${p.tomTat}`);
