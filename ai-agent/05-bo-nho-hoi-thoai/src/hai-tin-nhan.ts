// Hai tin nhắn liên tiếp của cùng một khách, lần này đi qua một phiên có giữ lịch sử.
import { taoPhien } from "./phien.ts";

const phien = taoPhien();
for (const tinNhan of ["Đơn 1041 của em giao chưa ạ?", "Vậy thêm cho em một bạc xỉu nữa nhé"]) {
  const kq = await phien.nhan(tinNhan);
  console.log(`Khách: ${tinNhan}`);
  for (const dong of kq.nhatKy) console.log(`  ${dong}`);
  console.log(`Mộc:   ${kq.traLoi}`);
  console.log(`       (lịch sử giờ có ${phien.lichSu.length} tin nhắn)\n`);
}
