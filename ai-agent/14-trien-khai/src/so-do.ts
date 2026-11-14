// Bộ đếm và đo độ trễ trong bộ nhớ, đủ để trả lời "agent có khỏe không" mà không cần dịch vụ ngoài.
// Mất khi dịch vụ khởi động lại; dịch vụ thật nên đẩy các số này sang một hệ thống giám sát.

export type TongHop = {
  tinNhan: number;
  daTraLoi: number;
  daImLang: number;
  daChuyen: number;
  chuyenTheoLyDo: Record<string, number>;
  tuChoiGioiHan: number;
  tuChoiDoDai: number;
  loiNoiBo: number;
  doTreMs: { p50: number; p95: number; toiDa: number } | null;
};

/** Phân vị nearest-rank trên một mảng đã có sẵn số đo. */
export function phanVi(giaTri: number[], p: number): number {
  const sapXep = [...giaTri].sort((a, b) => a - b);
  return sapXep[Math.min(sapXep.length - 1, Math.max(0, Math.ceil(p * sapXep.length) - 1))]!;
}

export class SoDo {
  tinNhan = 0;
  daTraLoi = 0;
  daImLang = 0;
  daChuyen = 0;
  tuChoiGioiHan = 0;
  tuChoiDoDai = 0;
  loiNoiBo = 0;
  private readonly chuyenTheoLyDo: Record<string, number> = {};
  private readonly doTre: number[] = [];

  ghiChuyen(lyDo: string): void {
    this.daChuyen++;
    this.chuyenTheoLyDo[lyDo] = (this.chuyenTheoLyDo[lyDo] ?? 0) + 1;
  }
  ghiDoTre(ms: number): void {
    this.doTre.push(ms);
  }
  tongHop(): TongHop {
    return {
      tinNhan: this.tinNhan,
      daTraLoi: this.daTraLoi,
      daImLang: this.daImLang,
      daChuyen: this.daChuyen,
      chuyenTheoLyDo: { ...this.chuyenTheoLyDo },
      tuChoiGioiHan: this.tuChoiGioiHan,
      tuChoiDoDai: this.tuChoiDoDai,
      loiNoiBo: this.loiNoiBo,
      doTreMs: this.doTre.length === 0 ? null : { p50: phanVi(this.doTre, 0.5), p95: phanVi(this.doTre, 0.95), toiDa: Math.max(...this.doTre) },
    };
  }
}
