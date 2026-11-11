// Khách nói mã đơn ở đầu buổi, hỏi vài câu khác, rồi mới nhờ thêm món.
// Chạy ba lần với ba cách chọn lịch sử để so sánh.
import { catTheoLuot } from "./cat-lich-su.ts";
import { datLaiDonHang } from "./don-hang.ts";
import { systemCoGhiNho } from "./ghi-nho.ts";
import { taoPhien, type TuyChonPhien } from "./phien.ts";

const TIN_NHAN = [
  "Đơn 1041 của em giao chưa ạ?",
  "Quán mở cửa tới mấy giờ ạ?",
  "Phí ship thế nào ạ?",
  "Cà phê muối bao nhiêu tiền vậy?",
  "Vậy thêm cho em một cà phê muối nhé",
];

const CACH: [string, TuyChonPhien][] = [
  ["gửi toàn bộ lịch sử", {}],
  ["chỉ gửi 2 lượt cuối", { chonLichSu: (lichSu) => catTheoLuot(lichSu, 2) }],
  ["gửi 2 lượt cuối, kèm ghi nhớ mã đơn", { chonLichSu: (lichSu) => catTheoLuot(lichSu, 2), soanSystem: systemCoGhiNho }],
];

for (const [ten, tuyChon] of CACH) {
  datLaiDonHang(); // mỗi cách chạy trên dữ liệu đơn hàng như nhau
  const phien = taoPhien(tuyChon);
  let kq = await phien.nhan(TIN_NHAN[0]);
  for (const tin of TIN_NHAN.slice(1)) kq = await phien.nhan(tin);
  const dau = kq.cacLanGoi[0];
  console.log(`--- ${ten} ---`);
  console.log(`Khách (tin thứ 5): ${TIN_NHAN[4]}`);
  console.log(`  gửi đi ${dau.soTinNhan} tin nhắn, ${dau.kyTu} ký tự`);
  for (const dong of kq.nhatKy) console.log(`  ${dong}`);
  console.log(`Mộc: ${kq.traLoi}\n`);
}
