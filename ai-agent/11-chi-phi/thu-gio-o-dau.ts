// Lỗi hay gặp: đặt giờ hiện tại ở ĐẦU hướng dẫn. Chạy: node thu-gio-o-dau.ts
import { chayNgay, sinhLuuLuong } from "./src/mo-phong.ts";

const luuLuong = sinhLuuLuong(200);
for (const [ten, gioODau] of [["giờ để sau phần cố định (đúng)", false], ["giờ ở đầu hướng dẫn (sai)", true]] as const) {
  const kq = chayNgay(luuLuong, { cache: "5p", dinhTuyen: false, gioODau });
  console.log(`${ten.padEnd(32)} cache đọc ${String(kq.doc).padStart(3)}, ghi ${String(kq.ghi).padStart(3)}, tiền ${kq.tien.toFixed(4)} $`);
}
