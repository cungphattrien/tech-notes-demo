import { doGiong, nhungCacDoan, nhungCauHoi } from "./nhung.ts";
import type { Doan } from "./tach-doan.ts";

export type KetQuaNghia = { doan: Doan; diem: number };

// Chỉ mục: vector của từng đoạn, tính một lần khi khởi động (14 đoạn mất vài giây).
export async function lapChiMuc(cacDoan: Doan[]): Promise<number[][]> {
  return nhungCacDoan(cacDoan);
}

// Tìm theo nghĩa: đoạn nào có vector gần vector câu hỏi nhất thì đứng đầu.
export async function timTheoNghia(cauHoi: string, cacDoan: Doan[], chiMuc: number[][], soDoan = 2): Promise<KetQuaNghia[]> {
  const vectorHoi = await nhungCauHoi(cauHoi);
  return cacDoan
    .map((doan, i) => ({ doan, diem: doGiong(vectorHoi, chiMuc[i]) }))
    .sort((a, b) => b.diem - a.diem) // xếp theo điểm chưa làm tròn: các đoạn sát nhau, làm tròn trước sẽ gây hòa điểm
    .slice(0, soDoan);
}
