// Chấm ba bộ tìm kiếm trên cùng bộ câu hỏi mẫu: từ khóa (tập 6), theo nghĩa (embedding), và kết hợp cả hai.
// Một câu "đủ" khi mọi mục trong `can` đều nằm trong số đoạn được chọn. Đối số đầu: số đoạn được chọn (mặc định 2).
import { CAU_HOI_MAU } from "./cau-hoi-mau.ts";
import { timKetHop } from "./ket-hop.ts";
import { docChinhSach } from "./tach-doan.ts";
import { timDoan } from "./tim-doan.ts";
import { lapChiMuc, timTheoNghia } from "./tim-nghia.ts";

const SO_DOAN = Number(process.argv[2] ?? 2);
const CAC_DOAN = docChinhSach();
const chiMuc = await lapChiMuc(CAC_DOAN);

const dau = (du: boolean) => (du ? "đủ   " : "THIẾU");
const dem = { tuKhoa: 0, nghia: 0, ketHop: 0 };
const thieuNghia: string[] = [];

console.log(`Chọn ${SO_DOAN} đoạn cho mỗi câu hỏi.   từ khóa | theo nghĩa | kết hợp`);
for (const { cau, can } of CAU_HOI_MAU) {
  const tuKhoa = timDoan(cau, CAC_DOAN, SO_DOAN).map((kq) => kq.doan.tieuDe);
  const nghia = (await timTheoNghia(cau, CAC_DOAN, chiMuc, SO_DOAN)).map((kq) => kq.doan.tieuDe);
  const ketHop = (await timKetHop(cau, CAC_DOAN, chiMuc, SO_DOAN)).map((d) => d.tieuDe);
  const du = (chon: string[]) => can.every((muc) => chon.includes(muc));
  dem.tuKhoa += Number(du(tuKhoa));
  dem.nghia += Number(du(nghia));
  dem.ketHop += Number(du(ketHop));
  console.log(`${dau(du(tuKhoa))} | ${dau(du(nghia))} | ${dau(du(ketHop))}   ${cau}`);
  if (!du(nghia)) thieuNghia.push(`${cau}\n    cần: ${can.join(" + ")}\n    được chọn: ${nghia.join(" + ")}`);
}
const tong = CAU_HOI_MAU.length;
console.log(`\nĐủ thông tin: từ khóa ${dem.tuKhoa}/${tong}, theo nghĩa ${dem.nghia}/${tong}, kết hợp ${dem.ketHop}/${tong}`);
if (thieuNghia.length) console.log(`\nCác câu tìm theo nghĩa còn thiếu:\n  ${thieuNghia.join("\n  ")}`);
