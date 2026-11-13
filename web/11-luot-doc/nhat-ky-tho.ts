// Cách làm đầu tiên: ghi MỖI lượt mở trang vào một bảng nhật ký. Chạy: node nhat-ky-tho.ts
import { sinhNgayTruyCap } from "./src/su-kien.ts";

const nhatKy = sinhNgayTruyCap().flatMap((sk) => (sk.loai === "mo-trang" ? [{ ip: sk.ip, trinhDuyet: sk.trinhDuyet, slug: sk.slug }] : []));
console.log(`Bảng nhật ký có ${nhatKy.length} dòng. Ba dòng đầu:`);
for (const dong of nhatKy.slice(0, 3)) console.log(`  ${JSON.stringify(dong)}`);

// Chỉ cần nhóm theo IP là dựng lại được lịch sử đọc của một người.
const theoIp = new Map<string, Set<string>>();
for (const { ip, slug } of nhatKy) theoIp.set(ip, (theoIp.get(ip) ?? new Set()).add(slug));
const [ipDau, baiDoc] = [...theoIp].find(([, bai]) => bai.size >= 3) ?? [...theoIp][0];
console.log(`\nIP ${ipDau} đã đọc: ${[...baiDoc].join(", ")}`);
console.log(`Số dòng đếm được: ${nhatKy.length}. Số người thật trong ngày: 90 (cộng ~40 robot và 20 lượt xem thử).`);
