// Một khách nhắn 30 tin trong buổi sáng. Sau mỗi tin, in ra lần gọi mô hình cuối cùng đã gửi đi bao nhiêu.
import { taoPhien } from "./phien.ts";

const CAU_HOI = [
  "Đơn 1041 của em giao chưa ạ?",
  "Quán mở cửa tới mấy giờ ạ?",
  "Cà phê muối bao nhiêu tiền vậy?",
  "Phí ship thế nào ạ?",
  "Bánh mì trứng giá sao ạ?",
  "Bạc xỉu bao nhiêu ạ?",
];

const phien = taoPhien();
let tongKyTu = 0;
let tongLanGoi = 0;
console.log("tin thứ | tin nhắn gửi đi | ký tự gửi đi | cộng dồn ký tự");
for (let i = 1; i <= 30; i++) {
  const kq = await phien.nhan(CAU_HOI[(i - 1) % CAU_HOI.length]);
  tongLanGoi += kq.cacLanGoi.length;
  for (const lan of kq.cacLanGoi) tongKyTu += lan.kyTu;
  const cuoi = kq.cacLanGoi.at(-1)!;
  if (i === 1 || i % 5 === 0) {
    console.log(`${String(i).padStart(7)} | ${String(cuoi.soTinNhan).padStart(15)} | ${String(cuoi.kyTu).padStart(12)} | ${String(tongKyTu).padStart(14)}`);
  }
}
console.log(`\n30 tin của khách, ${tongLanGoi} lần gọi mô hình, lịch sử cuối cùng có ${phien.lichSu.length} tin nhắn.`);
