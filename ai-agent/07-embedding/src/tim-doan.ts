import type { Doan } from "./tach-doan.ts";

// Từ quá phổ biến, không giúp phân biệt đoạn này với đoạn khác.
const TU_BO_QUA = new Set(["và", "là", "của", "có", "cho", "được", "không", "thì", "mà", "em", "mình", "bạn", "ạ", "nhé", "này", "một", "khi", "nếu", "bị", "để", "với", "các", "những", "thế", "nào", "sao", "gì", "quán", "mộc"]);

export function tachTu(chu: string): string[] {
  return (chu.toLowerCase().match(/\p{L}+|\d+/gu) ?? []).filter((tu) => !TU_BO_QUA.has(tu));
}

export type KetQuaTim = { doan: Doan; diem: number; tuKhop: string[] };

// Chấm điểm bằng từ khóa: mỗi từ của câu hỏi có trong đoạn được cộng điểm,
// từ càng hiếm (ít đoạn chứa) càng nhiều điểm. Tiêu đề đoạn được tính cùng nội dung.
export function timDoan(cauHoi: string, cacDoan: Doan[], soDoan = 2): KetQuaTim[] {
  const tuCuaDoan = cacDoan.map((d) => new Set(tachTu(`${d.tieuDe} ${d.noiDung}`)));
  const tuCauHoi = [...new Set(tachTu(cauHoi))];
  const idf = (tu: string) => Math.log(1 + cacDoan.length / (1 + tuCuaDoan.filter((s) => s.has(tu)).length));

  return cacDoan
    .map((doan, i) => {
      const tuKhop = tuCauHoi.filter((tu) => tuCuaDoan[i].has(tu));
      return { doan, tuKhop, diem: Number(tuKhop.reduce((tong, tu) => tong + idf(tu), 0).toFixed(2)) };
    })
    .filter((kq) => kq.diem > 0)
    .sort((a, b) => b.diem - a.diem)
    .slice(0, soDoan);
}
