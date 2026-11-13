// Mô phỏng cache prompt theo mô tả trong tài liệu của Anthropic: cache chỉ khớp khi TIỀN TỐ giống hệt từng ký tự,
// sống 5 phút (hoặc 1 giờ nếu chọn) và được làm mới mỗi lần dùng, và không áp dụng khi tiền tố ngắn hơn mức tối thiểu.
export type KetQuaCache = "doc" | "ghi" | "khong";

export class BoNhoDem {
  private hetHan = new Map<string, number>(); // khóa = mô hình + tiền tố; giá trị = giây hết hạn
  private ttlGiay: number;
  private toiThieuToken: number;
  constructor(ttlGiay: number, toiThieuToken = 512) {
    this.ttlGiay = ttlGiay;
    this.toiThieuToken = toiThieuToken;
  }

  dung(khoa: string, soTokenTienTo: number, giay: number): KetQuaCache {
    if (soTokenTienTo < this.toiThieuToken) return "khong"; // quá ngắn: không cache, cũng không báo lỗi
    const han = this.hetHan.get(khoa);
    this.hetHan.set(khoa, giay + this.ttlGiay); // đọc hay ghi đều làm mới thời hạn
    return han !== undefined && han >= giay ? "doc" : "ghi";
  }
}
