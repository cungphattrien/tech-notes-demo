// Chấm hai bộ tìm kiếm trên cùng bộ câu hỏi mẫu: từ khóa (tập 6) và theo nghĩa (embedding).
// Một câu "đủ" khi mọi mục trong `can` đều nằm trong số đoạn được chọn. Đối số đầu: số đoạn được chọn (mặc định 2).
import { CAU_HOI_MAU } from "./cau-hoi-mau.ts";
import { docChinhSach } from "./tach-doan.ts";
import { timDoan } from "./tim-doan.ts";
import { lapChiMuc, timTheoNghia } from "./tim-nghia.ts";

const SO_DOAN = Number(process.argv[2] ?? 2);
const CAC_DOAN = docChinhSach();
const chiMuc = await lapChiMuc(CAC_DOAN);

const dau = (du: boolean) => (du ? "đủ   " : "THIẾU");
let duTuKhoa = 0;
let duNghia = 0;

console.log(`Chọn ${SO_DOAN} đoạn cho mỗi câu hỏi.   từ khóa | theo nghĩa`);
for (const { cau, can } of CAU_HOI_MAU) {
  const tuKhoa = timDoan(cau, CAC_DOAN, SO_DOAN).map((kq) => kq.doan.tieuDe);
  const nghia = (await timTheoNghia(cau, CAC_DOAN, chiMuc, SO_DOAN)).map((kq) => kq.doan.tieuDe);
  const du = (chon: string[]) => can.every((muc) => chon.includes(muc));
  duTuKhoa += Number(du(tuKhoa));
  duNghia += Number(du(nghia));
  console.log(`${dau(du(tuKhoa))} | ${dau(du(nghia))}   ${cau}`);
}
console.log(`\nĐủ thông tin: từ khóa ${duTuKhoa}/${CAU_HOI_MAU.length}, theo nghĩa ${duNghia}/${CAU_HOI_MAU.length}`);
