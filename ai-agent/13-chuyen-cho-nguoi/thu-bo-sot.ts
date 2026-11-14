// So bản ngây thơ (chỉ chuyển khi khách nói thẳng "gặp nhân viên") với quy tắc đầy đủ trên 14 tin có đáp án.
import { CA_THU } from "./src/ca-thu.ts";
import { moHinhGia } from "./src/mo-hinh-gia.ts";
import { quyetDinh, quyetDinhNgayTho } from "./src/quyet-dinh.ts";

let botNgayTho = 0, botDayDu = 0, thuaDayDu = 0, thuaNgayTho = 0;
for (const { tin, nenChuyen } of CA_THU) {
  const a = quyetDinhNgayTho(tin);
  const qd = quyetDinh(tin, [], moHinhGia(tin).doTinCay);
  if (nenChuyen && !a) botNgayTho++;
  if (nenChuyen && !qd.chuyen) botDayDu++;
  if (!nenChuyen && a) thuaNgayTho++;
  if (!nenChuyen && qd.chuyen) thuaDayDu++;
  const dau = (chuyen: boolean) => (chuyen === nenChuyen ? "ok " : "SAI");
  console.log(`${dau(a)} ${dau(qd.chuyen)}  ${nenChuyen ? "CHUYỂN " : "agent  "} ${tin}${qd.chuyen ? `  → ${qd.lyDo}` : ""}`);
}
const can = CA_THU.filter((c) => c.nenChuyen).length;
console.log(`\nCần chuyển: ${can} tin. Bản ngây thơ bỏ sót ${botNgayTho}, quy tắc đầy đủ bỏ sót ${botDayDu}.`);
console.log(`Không cần chuyển: ${CA_THU.length - can} tin. Bản ngây thơ chuyển thừa ${thuaNgayTho}, quy tắc đầy đủ chuyển thừa ${thuaDayDu}.`);
