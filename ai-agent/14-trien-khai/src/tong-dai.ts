// Tổng đài của Mộc: agent trả lời, và chuyển cho người thật khi quy tắc trong quyet-dinh.ts nói phải chuyển.
// Mọi bước đi qua nhật ký, nên sau này tìm được "vì sao tin này bị chuyển" hay "vì sao không".
import { timDon } from "./du-lieu.ts";
import { moHinhGia } from "./mo-hinh-gia.ts";
import { NhatKy } from "./nhat-ky.ts";
import { quyetDinh, type LyDo } from "./quyet-dinh.ts";

export type TrangThai = "agent" | "cho-nguoi" | "nhan-vien-dang-xu-ly" | "da-dong";
export type Dong = { ai: "khach" | "agent" | "nhan-vien"; noiDung: string };
export type HoiThoai = { ma: string; trangThai: TrangThai; lichSu: Dong[]; maPhieu?: string };
export type Phieu = { ma: string; maHoiThoai: string; lyDo: LyDo; tomTat: string; tao: Date; tiepNhan?: { ten: string; luc: Date } };

const GIO_VN = 7; // Việt Nam là UTC+7 quanh năm, không có giờ mùa hè
/** Quán mở 7:00–21:00 giờ Việt Nam. */
export function trongGioLam(luc: Date): boolean {
  const gio = (luc.getUTCHours() + GIO_VN) % 24;
  return gio >= 7 && gio < 21;
}

const LOI_CHUYEN: Record<LyDo, string> = {
  "di-ung": "Với chuyện dị ứng, Mộc nhờ nhân viên xác nhận thành phần để chắc chắn cho bạn.",
  "khach-yeu-cau": "Mộc chuyển bạn cho nhân viên nhé.",
  "hoan-tien": "Chuyện hoàn tiền Mộc nhờ nhân viên xem đơn rồi trả lời bạn.",
  "khieu-nai": "Mộc xin lỗi vì chuyện này. Mộc nhờ nhân viên xem ngay và trả lời bạn.",
  "lap-lai": "Có vẻ Mộc chưa trả lời đúng ý bạn. Mộc nhờ nhân viên hỗ trợ trực tiếp.",
  "agent-khong-chac": "Mộc chưa chắc về câu này nên nhờ nhân viên trả lời giúp bạn.",
  "agent-tat": "Hôm nay Mộc nhờ nhân viên trả lời trực tiếp.",
};

export class TongDai {
  readonly hoiThoai = new Map<string, HoiThoai>();
  readonly phieu: Phieu[] = [];
  readonly nhatKy: NhatKy;
  private readonly gio: () => Date;
  constructor(nhatKy: NhatKy, gio: () => Date = () => new Date()) {
    this.nhatKy = nhatKy;
    this.gio = gio;
  }

  private lay(ma: string): HoiThoai {
    let h = this.hoiThoai.get(ma);
    if (!h) this.hoiThoai.set(ma, (h = { ma, trangThai: "agent", lichSu: [] }));
    return h;
  }

  /** Khách nhắn một tin; trả về câu mà khách thấy. */
  khach(maHoiThoai: string, tin: string): string {
    const h = this.lay(maHoiThoai);
    this.nhatKy.ghi({ loai: "khach-nhan", maHoiThoai, noiDung: tin, trangThai: h.trangThai });
    const tinTruoc = h.lichSu.filter((d) => d.ai === "khach").map((d) => d.noiDung);
    h.lichSu.push({ ai: "khach", noiDung: tin });

    // Đã chuyển cho người: agent im lặng, tin mới của khách chỉ được gom vào phiếu.
    if (h.trangThai !== "agent") {
      const loi = "Mộc đã chuyển cho nhân viên rồi, bạn nhắn thêm gì cứ gửi ở đây nhé, nhân viên sẽ đọc.";
      this.nhatKy.ghi({ loai: "agent-im-lang", maHoiThoai, maPhieu: h.maPhieu });
      h.lichSu.push({ ai: "agent", noiDung: loi });
      return loi;
    }

    const traLoi = moHinhGia(tin);
    if (traLoi.congCu) this.nhatKy.ghi({ loai: "goi-cong-cu", maHoiThoai, ...traLoi.congCu });
    const qd = quyetDinh(tin, tinTruoc, traLoi.doTinCay);
    this.nhatKy.ghi({ loai: "quyet-dinh", maHoiThoai, chuyen: qd.chuyen, lyDo: qd.chuyen ? qd.lyDo : null, doTinCay: traLoi.doTinCay });

    if (!qd.chuyen) {
      h.lichSu.push({ ai: "agent", noiDung: traLoi.noiDung });
      this.nhatKy.ghi({ loai: "agent-tra-loi", maHoiThoai, noiDung: traLoi.noiDung });
      return traLoi.noiDung;
    }

    const luc = this.gio();
    const phieu: Phieu = {
      ma: `P${this.phieu.length + 1}`,
      maHoiThoai,
      lyDo: qd.lyDo,
      tomTat: this.tomTat(h, qd.lyDo),
      tao: luc,
    };
    this.phieu.push(phieu);
    h.trangThai = "cho-nguoi";
    h.maPhieu = phieu.ma;
    const hen = trongGioLam(luc) ? "Nhân viên sẽ trả lời bạn trong giờ mở cửa." : "Quán đang đóng cửa (mở 7:00–21:00), nhân viên sẽ trả lời bạn sau 7:00 sáng.";
    const loi = `${LOI_CHUYEN[qd.lyDo]} ${hen}`;
    h.lichSu.push({ ai: "agent", noiDung: loi });
    this.nhatKy.ghi({ loai: "tao-phieu", maHoiThoai, maPhieu: phieu.ma, lyDo: qd.lyDo, tomTat: phieu.tomTat });
    return loi;
  }

  /** Công tắc tắt agent: không qua mô hình, chuyển thẳng cho người. Dùng khi mô hình lỗi hoặc đang tốn tiền bất thường. */
  chuyenThang(maHoiThoai: string, tin: string): string {
    const h = this.lay(maHoiThoai);
    this.nhatKy.ghi({ loai: "khach-nhan", maHoiThoai, noiDung: tin, trangThai: h.trangThai });
    h.lichSu.push({ ai: "khach", noiDung: tin });
    if (h.trangThai !== "agent") return "Mộc đã chuyển cho nhân viên rồi, nhân viên sẽ đọc tin của bạn.";
    const luc = this.gio();
    const phieu: Phieu = { ma: `P${this.phieu.length + 1}`, maHoiThoai, lyDo: "agent-tat", tomTat: this.tomTat(h, "agent-tat"), tao: luc };
    this.phieu.push(phieu);
    h.trangThai = "cho-nguoi";
    h.maPhieu = phieu.ma;
    this.nhatKy.ghi({ loai: "tao-phieu", maHoiThoai, maPhieu: phieu.ma, lyDo: "agent-tat", tomTat: phieu.tomTat });
    const hen = trongGioLam(luc) ? "Nhân viên sẽ trả lời bạn trong giờ mở cửa." : "Quán đang đóng cửa (mở 7:00–21:00), nhân viên sẽ trả lời bạn sau 7:00 sáng.";
    const loi = `${LOI_CHUYEN["agent-tat"]} ${hen}`;
    h.lichSu.push({ ai: "agent", noiDung: loi });
    return loi;
  }

  // Tóm tắt do code ghép từ lịch sử (không nhờ mô hình), để người nhận khỏi phải đọc lại cả cuộc trò chuyện.
  private tomTat(h: HoiThoai, lyDo: LyDo): string {
    const khach = h.lichSu.filter((d) => d.ai === "khach").map((d) => d.noiDung);
    const ma = khach.join(" ").match(/(?<!\d)(\d{4})(?!\d)/u)?.[1];
    const don = ma ? timDon(ma) : undefined;
    const donChu = don ? `đơn ${ma} (${don.trangThai})` : ma ? `đơn ${ma} (không tìm thấy)` : "chưa có mã đơn";
    const cuoi = khach[khach.length - 1]!;
    return `Lý do: ${lyDo}. ${donChu}. ${khach.length} tin của khách. Tin cuối: "${cuoi.length > 100 ? cuoi.slice(0, 100) + "…" : cuoi}"`;
  }

  nhanVienTiepNhan(maPhieu: string, ten: string): void {
    const p = this.phieuCo(maPhieu);
    p.tiepNhan = { ten, luc: this.gio() };
    const h = this.lay(p.maHoiThoai);
    h.trangThai = "nhan-vien-dang-xu-ly";
    this.nhatKy.ghi({ loai: "nhan-vien-tiep-nhan", maHoiThoai: p.maHoiThoai, maPhieu, ten, choGiay: Math.round((p.tiepNhan.luc.getTime() - p.tao.getTime()) / 1000) });
  }

  nhanVienTraLoi(maPhieu: string, noiDung: string): void {
    const p = this.phieuCo(maPhieu);
    this.lay(p.maHoiThoai).lichSu.push({ ai: "nhan-vien", noiDung });
    this.nhatKy.ghi({ loai: "nhan-vien-tra-loi", maHoiThoai: p.maHoiThoai, maPhieu, noiDung });
  }

  /** Đóng phiếu: cuộc trò chuyện quay về cho agent. */
  dongPhieu(maPhieu: string): void {
    const p = this.phieuCo(maPhieu);
    const h = this.lay(p.maHoiThoai);
    h.trangThai = "agent";
    h.maPhieu = undefined;
    this.nhatKy.ghi({ loai: "dong-phieu", maHoiThoai: p.maHoiThoai, maPhieu });
  }

  private phieuCo(ma: string): Phieu {
    const p = this.phieu.find((x) => x.ma === ma);
    if (!p) throw new Error(`Không có phiếu ${ma}`);
    return p;
  }
}
