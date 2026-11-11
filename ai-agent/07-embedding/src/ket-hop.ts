import type { Doan } from "./tach-doan.ts";
import { timDoan } from "./tim-doan.ts";
import { timTheoNghia } from "./tim-nghia.ts";

// Kết hợp hai bảng xếp hạng bằng reciprocal rank fusion: đoạn đứng càng cao ở bảng nào càng được nhiều điểm,
// đoạn có mặt ở cả hai bảng thì cộng dồn. Chỉ dùng thứ hạng, không dùng điểm, vì điểm của hai bộ tìm không cùng thang.
const HANG_SO = 60;

export async function timKetHop(cauHoi: string, cacDoan: Doan[], chiMuc: number[][], soDoan = 2): Promise<Doan[]> {
  const theoTuKhoa = timDoan(cauHoi, cacDoan, cacDoan.length).map((kq) => kq.doan);
  const theoNghia = (await timTheoNghia(cauHoi, cacDoan, chiMuc, cacDoan.length)).map((kq) => kq.doan);
  const diem = new Map<Doan, number>();
  for (const bang of [theoTuKhoa, theoNghia]) {
    bang.forEach((doan, hang) => diem.set(doan, (diem.get(doan) ?? 0) + 1 / (HANG_SO + hang + 1)));
  }
  return [...diem.entries()].sort((a, b) => b[1] - a[1]).slice(0, soDoan).map(([doan]) => doan);
}
