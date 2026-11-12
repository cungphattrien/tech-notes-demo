// Đọc một thư mời nhận việc (JSON) và kiểm tra hai điều luật cùng vài mục nên hỏi lại.
// Chạy: node kiem-offer.ts thu-moi.json
// Hai quy tắc đầu theo Bộ luật Lao động 2019: Điều 25 (thử việc tối đa 60 ngày với công việc cần trình độ cao đẳng trở lên)
// và Điều 26 (lương thử việc ít nhất 85% lương của công việc đó). Các mục "nên hỏi" là checklist mình đặt, không phải luật.
import { readFileSync } from "node:fs";

export type ThuMoi = {
  congTy: string;
  viTri: string;
  trinhDoYeuCau: "cao-dang-tro-len" | "khac";
  luongChinhThucGross: number | null;
  thuViec: { tu: string; den: string; phanTramLuong: number };
  luongDongBaoHiem: number | null;
  thang13: number | null;
  ngayXemXetLuong: string | null;
};

export const TOI_DA_THU_VIEC_NGAY = 60;
export const TOI_THIEU_LUONG_THU_VIEC = 85;

// Đếm cả ngày bắt đầu lẫn ngày kết thúc: từ 01/12 đến 31/01 là 62 ngày.
export function demNgay(tu: string, den: string): number {
  return Math.round((Date.parse(den) - Date.parse(tu)) / 86_400_000) + 1;
}

export type KetQuaKiem = { loai: "luat" | "hoi-lai" | "ok"; noiDung: string };

export function kiemThuMoi(thu: ThuMoi): KetQuaKiem[] {
  const kq: KetQuaKiem[] = [];
  const soNgay = demNgay(thu.thuViec.tu, thu.thuViec.den);

  if (thu.trinhDoYeuCau === "cao-dang-tro-len") {
    kq.push(soNgay > TOI_DA_THU_VIEC_NGAY
      ? { loai: "luat", noiDung: `Thử việc ${soNgay} ngày (${thu.thuViec.tu} đến ${thu.thuViec.den}), vượt ${TOI_DA_THU_VIEC_NGAY} ngày của Điều 25. Hỏi lại ngày kết thúc.` }
      : { loai: "ok", noiDung: `Thử việc ${soNgay} ngày, trong giới hạn ${TOI_DA_THU_VIEC_NGAY} ngày.` });
  }
  kq.push(thu.thuViec.phanTramLuong < TOI_THIEU_LUONG_THU_VIEC
    ? { loai: "luat", noiDung: `Lương thử việc ${thu.thuViec.phanTramLuong}%, thấp hơn mức tối thiểu ${TOI_THIEU_LUONG_THU_VIEC}% của Điều 26.` }
    : { loai: "ok", noiDung: `Lương thử việc ${thu.thuViec.phanTramLuong}%, không thấp hơn ${TOI_THIEU_LUONG_THU_VIEC}%.` });

  if (thu.luongChinhThucGross === null) kq.push({ loai: "hoi-lai", noiDung: "Thư chưa ghi lương chính thức." });
  if (thu.luongDongBaoHiem === null) kq.push({ loai: "hoi-lai", noiDung: "Thư chưa nói mức lương dùng để đóng bảo hiểm: hỏi có bằng lương ghi trong hợp đồng không." });
  if (thu.thang13 === null) kq.push({ loai: "hoi-lai", noiDung: "Thư chưa nói có lương tháng 13 hay thưởng cuối năm không." });
  if (thu.ngayXemXetLuong === null) kq.push({ loai: "hoi-lai", noiDung: "Thư chưa nói khi nào xem xét lại lương." });
  return kq;
}

if (import.meta.main) {
  const file = process.argv[2];
  if (!file) throw new Error("Cách dùng: node kiem-offer.ts <file-thư-mời.json>");
  const thu: ThuMoi = JSON.parse(readFileSync(file, "utf8"));
  console.log(`${thu.congTy} — ${thu.viTri}`);
  const dau = { luat: "✗ LUẬT ", "hoi-lai": "? HỎI   ", ok: "✓ ĐẠT   " };
  for (const muc of kiemThuMoi(thu)) console.log(`${dau[muc.loai]} ${muc.noiDung}`);
}
