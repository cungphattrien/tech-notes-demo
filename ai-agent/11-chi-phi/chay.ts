// So sánh chi phí một ngày của quán Mộc qua từng cách vận hành. Chạy: node chay.ts
import { TIEN_TO } from "./src/chinh-sach.ts";
import { chayNgay, sinhLuuLuong, type CachVanHanh } from "./src/mo-phong.ts";
import { uocTinhToken } from "./src/token.ts";

const luuLuong = sinhLuuLuong(200);
console.log(`Phần hướng dẫn cố định: ${TIEN_TO.length} ký tự, khoảng ${uocTinhToken(TIEN_TO)} token. ${luuLuong.length} tin nhắn trong ngày.\n`);

const CAC_CACH: [string, CachVanHanh][] = [
  ["0. Chưa tối ưu", { cache: "khong", dinhTuyen: false }],
  ["1. Bật cache 5 phút", { cache: "5p", dinhTuyen: false }],
  ["2. Đổi sang cache 1 giờ", { cache: "1h", dinhTuyen: false }],
  ["3. Cache 1 giờ + mô hình nhỏ cho tin đơn giản", { cache: "1h", dinhTuyen: true }],
  ["4. Thêm giới hạn 4 lượt gọi mỗi tin nhắn", { cache: "1h", dinhTuyen: true, toiDaLuot: 4 }],
];
const goc = chayNgay(luuLuong, CAC_CACH[0][1]).tien;
for (const [ten, cach] of CAC_CACH) {
  const kq = chayNgay(luuLuong, cach);
  const cacheTxt = cach.cache === "khong" ? "" : `, cache đọc ${kq.doc}/ghi ${kq.ghi}`;
  const nguoiTxt = cach.toiDaLuot ? `, ${kq.chuyenNguoi} tin chuyển cho người` : "";
  console.log(`${ten}\n   ${kq.tien.toFixed(4)} $ (${Math.round((kq.tien / goc) * 100)}% so với gốc), ${kq.soLuotGoi} lượt gọi${cacheTxt}${nguoiTxt}`);
}
