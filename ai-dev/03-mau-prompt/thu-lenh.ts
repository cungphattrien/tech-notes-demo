// Gửi lần lượt từng tin nhắn vào handleMessage, dùng chung một sổ chi tiêu, rồi in câu trả lời.
import { handleMessage, type Entry } from "./src/so-chi-tieu.ts";

const luc = new Date("2026-12-01T06:30+07:00");
const so: Entry[] = [];
for (const tinNhan of ["cà phê 35k", "/tong", "/TONG", " /tong ", "/tong tháng 10", "/tổng", "tong"]) {
  console.log(JSON.stringify(tinNhan), "→", handleMessage(tinNhan, luc, so));
}
