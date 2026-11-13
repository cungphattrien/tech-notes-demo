// Nhập file CSV đơn cũ: mỗi dòng hoặc thành một đơn hợp lệ, hoặc bị loại KÈM lý do và dòng gốc. Không dòng nào biến mất âm thầm.
import { chuanHoaNgay, chuanHoaSdt, chuanHoaTien, tachMon, type Mon } from "./chuan-hoa.ts";
import { tachDongCsv } from "./csv.ts";

export type DonNhap = { maDon: string; ngay: string; khach?: string; sdt?: string; mon: Mon[]; tong: number };
export type DongBiLoai = { dong: number; lyDo: string; goc: string };
export type KetQuaNhap = { hopLe: DonNhap[]; biLoai: DongBiLoai[] };

const CAC_COT = ["ma_don", "ngay", "khach", "sdt", "mon", "tong"];

export function nhapCsv(noiDung: string): KetQuaNhap {
  // Excel hay thêm dấu BOM (﻿) ở đầu file, và máy Windows kết thúc dòng bằng \r\n.
  const [dongDau, ...cacDong] = noiDung.replace(/^﻿/, "").split(/\r?\n/);
  if (tachDongCsv(dongDau).join(",") !== CAC_COT.join(",")) throw new Error(`Dòng tiêu đề phải là: ${CAC_COT.join(",")}`);

  const ketQua: KetQuaNhap = { hopLe: [], biLoai: [] };
  cacDong.forEach((goc, i) => {
    if (goc.trim() === "") return; // dòng trống cuối file
    try {
      const o = tachDongCsv(goc);
      if (o.length !== CAC_COT.length) throw new Error(`có ${o.length} ô, cần ${CAC_COT.length}`);
      const [maDon, ngay, khach, sdt, mon, tong] = o;
      ketQua.hopLe.push({
        maDon: maDon.trim(),
        ngay: chuanHoaNgay(ngay),
        khach: khach.trim().replace(/\s+/g, " ") || undefined,
        sdt: chuanHoaSdt(sdt),
        mon: tachMon(mon),
        tong: chuanHoaTien(tong),
      });
    } catch (loi) {
      ketQua.biLoai.push({ dong: i + 2, lyDo: (loi as Error).message, goc }); // dòng 1 là tiêu đề nên dòng dữ liệu đầu tiên là dòng 2
    }
  });
  return ketQua;
}
