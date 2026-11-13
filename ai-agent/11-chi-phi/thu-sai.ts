// Ba chỗ làm chi phí tối ưu nhưng sai. Chạy: node thu-sai.ts
import { NhoCauHoiChung, NhoTheoTin } from "./src/bo-nho-tra-loi.ts";
import { chayNgay, sinhLuuLuong } from "./src/mo-phong.ts";

const luuLuong = sinhLuuLuong(200);

console.log("--- 1. Đặt giờ hiện tại ở đầu hướng dẫn");
for (const [ten, gioODau] of [["giờ để sau phần cố định (đúng)", false], ["giờ ở đầu hướng dẫn (sai)", true]] as const) {
  const kq = chayNgay(luuLuong, { cache: "5p", dinhTuyen: false, gioODau });
  console.log(`${ten.padEnd(30)} cache đọc ${String(kq.doc).padStart(3)}, ghi ${String(kq.ghi).padStart(3)}, tiền ${kq.tien.toFixed(4)} $`);
}

console.log("\n--- 2. Nhớ câu trả lời theo nội dung tin nhắn");
const hoi = "Đơn của em đâu rồi?";
let luot = 0;
const dem = () => luot++;
const sai = new NhoTheoTin();
console.log(`Khách 0901000002 hỏi: ${hoi}\n  -> ${sai.hoi("0901000002", hoi, dem)}`);
console.log(`Khách 0901000003 hỏi: ${hoi}\n  -> ${sai.hoi("0901000003", hoi, dem)}   (${luot} lượt gọi mô hình)`);

luot = 0;
const dung = new NhoCauHoiChung();
console.log("\nCách đúng (chỉ nhớ câu hỏi chung):");
console.log(`Khách 0901000002 hỏi: ${hoi}\n  -> ${dung.hoi("0901000002", hoi, 0, dem)}`);
console.log(`Khách 0901000003 hỏi: ${hoi}\n  -> ${dung.hoi("0901000003", hoi, 1, dem)}`);
const gio = "Quán mấy giờ đóng cửa vậy?";
for (let i = 0; i < 3; i++) dung.hoi(`09010000${10 + i}`, gio, 10 + i, dem);
console.log(`3 khách hỏi giờ đóng cửa: tổng cộng ${luot} lượt gọi mô hình (2 cho hai tin về đơn, 1 cho câu hỏi chung)`);

console.log("\n--- 3. Không giới hạn số lượt gọi mô hình mỗi tin nhắn");
for (const [ten, toiDaLuot] of [["không giới hạn", undefined], ["tối đa 4 lượt", 4]] as const) {
  const kq = chayNgay(luuLuong, { cache: "1h", dinhTuyen: true, toiDaLuot });
  console.log(`${ten.padEnd(16)} ${String(kq.soLuotGoi).padStart(3)} lượt gọi, ${kq.tien.toFixed(4)} $, ${kq.chuyenNguoi} tin chuyển cho người`);
}
