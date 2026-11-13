// Đếm lượt đọc bằng các quy tắc, rồi nói rõ mỗi quy tắc loại bao nhiêu. Chạy: node chay.ts
import { demLuotDoc } from "./src/dem-luot-doc.ts";
import { BAI_DA_DANG, sinhNgayTruyCap } from "./src/su-kien.ts";
import { totalsSince, vnToday } from "./src/views.ts";

const suKien = sinhNgayTruyCap();
const ngay = vnToday(new Date("2026-11-18T03:00:00Z"));
const kq = demLuotDoc(suKien, BAI_DA_DANG, ngay);

const moTrang = suKien.filter((s) => s.loai === "mo-trang").length;
console.log(`Trong ngày ${ngay}: ${moTrang} lượt mở trang và ${suKien.length - moTrang} lệnh gọi thẳng vào máy chủ.\n`);
console.log("Số lượt bị loại, theo từng quy tắc:");
for (const [lyDo, soLuong] of kq.loai) console.log(`  ${String(soLuong).padStart(3)}  ${lyDo}`);

const tong = kq.bang.reduce((t, d) => t + d.views, 0);
console.log(`\nSố lượt đọc được ghi: ${tong}`);

// Số "người đọc thật" tính theo (người, bài) khác nhau, ở lại từ 5 giây trở lên.
const nguoiBai = new Set(suKien.flatMap((s) => (s.loai === "mo-trang" && s.nguoi >= 1 && s.nguoi <= 90 && s.trangThat && s.giayOLai >= 5 ? [`${s.nguoi}|${s.slug}`] : [])));
console.log(`Số cặp (người, bài) thật sự có đọc: ${nguoiBai.size}  -> đếm dư ${tong - nguoiBai.size} vì một người mở cùng bài ở hai tab`);

console.log("\nĐọc nhiều nhất:");
for (const [slug, views] of totalsSince(kq.bang, ngay)) console.log(`  ${String(views).padStart(3)}  ${slug}`);
console.log(`\nBảng lưu ${kq.bang.length} dòng, mỗi dòng chỉ có: ${Object.keys(kq.bang[0]).join(", ")}`);
