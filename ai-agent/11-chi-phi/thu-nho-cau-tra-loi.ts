// Nhớ câu trả lời để khỏi gọi mô hình: cách sai (theo nội dung tin) và cách đúng (chỉ câu hỏi chung). Chạy: node thu-nho-cau-tra-loi.ts
import { NhoCauHoiChung, NhoTheoTin } from "./src/bo-nho-tra-loi.ts";

const hoi = "Đơn của em đâu rồi?";
let luot = 0;
const dem = () => luot++;

console.log("Cách sai: nhớ theo nội dung tin nhắn");
const sai = new NhoTheoTin();
console.log(`  Khách 0901000002 hỏi "${hoi}" -> ${sai.hoi("0901000002", hoi, dem)}`);
console.log(`  Khách 0901000003 hỏi "${hoi}" -> ${sai.hoi("0901000003", hoi, dem)}  (${luot} lượt gọi mô hình)`);

luot = 0;
console.log("Cách đúng: chỉ nhớ câu hỏi chung");
const dung = new NhoCauHoiChung();
console.log(`  Khách 0901000002 hỏi "${hoi}" -> ${dung.hoi("0901000002", hoi, 0, dem)}`);
console.log(`  Khách 0901000003 hỏi "${hoi}" -> ${dung.hoi("0901000003", hoi, 1, dem)}`);
const gio = "Quán mấy giờ đóng cửa vậy?";
const truoc = luot;
for (let i = 0; i < 3; i++) dung.hoi(`09010000${10 + i}`, gio, 10 + i, dem);
console.log(`  Ba khách khác hỏi "${gio}" -> ${luot - truoc} lượt gọi mô hình (câu hỏi chung chỉ gọi một lần)`);
