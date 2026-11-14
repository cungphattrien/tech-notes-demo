// Minh nhận task "Thêm bộ lọc đơn theo ngày vào trang quản lý" vào thứ hai 14/12/2026 và đoán "hai ngày".
// Chạy: node thu-uoc-luong.ts   (số liệu lịch sử là minh họa)
import { readFileSync } from "node:fs";
import { GIO_TAP_TRUNG_MOI_NGAY, heSoLech, ngayXong, phanVi, thuCua, tiLeDungHan, uocLuong, type Viec } from "./src/uoc-luong.ts";

const lichSu = JSON.parse(readFileSync("lich-su.json", "utf8")) as Viec[];
const he = heSoLech(lichSu);
const dinhDang = (ngay: string) => `${thuCua(ngay)} ${ngay.slice(8)}/${ngay.slice(5, 7)}`;
const BAT_DAU = "2026-12-14";

console.log(`Lịch sử của Minh: ${lichSu.length} việc`);
console.log(`Thực tế / ước lượng: ${he.map((h) => h.toFixed(2)).join(", ")}`);
console.log(`Xong đúng hạn hoặc sớm hơn: ${Math.round(tiLeDungHan(lichSu) * lichSu.length)}/${lichSu.length} việc`);
console.log(`Hệ số lệch trung vị (p50): ${phanVi(he, 0.5).toFixed(2)}; p80: ${phanVi(he, 0.8).toFixed(2)}`);

const doan = 2 * GIO_TAP_TRUNG_MOI_NGAY;
console.log(`\nMinh đoán "hai ngày" = ${doan} giờ tập trung → xong ${dinhDang(ngayXong(BAT_DAU, doan))}`);

const cacViec = [
  { ten: "Đọc code trang quản lý và API đơn hiện có", gio: 1.5 },
  { ten: "API lọc đơn theo khoảng ngày", gio: 3 },
  { ten: "Nối bộ lọc vào giao diện", gio: 3 },
  { ten: "Viết test", gio: 2 },
  { ten: "Sửa theo góp ý khi review", gio: 1.5 },
];
const kq = uocLuong(cacViec, lichSu);
console.log("\nChia nhỏ:");
for (const v of cacViec) console.log(`  ${String(v.gio).padStart(3)} giờ  ${v.ten}`);
console.log(`Cộng lại: ${kq.gioCongLai} giờ`);
console.log(`Thường (p50): ${kq.gioThuong.toFixed(1)} giờ → xong ${dinhDang(ngayXong(BAT_DAU, kq.gioThuong))}`);
console.log(`Chắc (p80):   ${kq.gioChac.toFixed(1)} giờ → xong ${dinhDang(ngayXong(BAT_DAU, kq.gioChac))}`);
