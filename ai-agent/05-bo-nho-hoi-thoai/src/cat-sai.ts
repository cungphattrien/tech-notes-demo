// Cắt lịch sử theo số tin nhắn rồi kiểm tra xem phần còn lại có gửi được cho API không.
import type { TinNhan } from "./agent.ts";
import { catTheoLuot, catTheoSoTinNhan, kiemTraLichSu } from "./cat-lich-su.ts";
import { taoPhien } from "./phien.ts";

const phien = taoPhien();
for (const tin of ["Em đặt sáng nay, sđt 0901000001", "Quán mở cửa tới mấy giờ ạ?", "Phí ship thế nào ạ?"]) await phien.nhan(tin);

const moTa = (tin: TinNhan) => (typeof tin.content === "string" ? `"${tin.content}"` : tin.content.map((b) => b.type).join(" + "));

console.log(`Lịch sử đầy đủ (${phien.lichSu.length} tin nhắn):`);
phien.lichSu.forEach((tin, i) => console.log(`  ${i}  ${tin.role.padEnd(9)} ${moTa(tin)}`));

for (const giu of [8, 7, 6]) {
  const cat = catTheoSoTinNhan(phien.lichSu, giu);
  console.log(`\nGiữ ${giu} tin nhắn cuối → ${kiemTraLichSu(cat) ?? "hợp lệ"}`);
}
const theoLuot = catTheoLuot(phien.lichSu, 2);
console.log(`\nGiữ 2 lượt cuối (${theoLuot.length} tin nhắn) → ${kiemTraLichSu(theoLuot) ?? "hợp lệ"}`);
