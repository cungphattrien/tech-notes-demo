// Mô hình giả, quyết định bằng quy tắc, để chạy offline. Nó trả về cả độ tự tin (0–1), điều mà mô hình thật
// không đưa sẵn cho bạn (bài viết nói rõ chuyện này). Không có cuộc gọi mô hình thật nào trong thư mục này.
import { timDon } from "./du-lieu.ts";

export type TraLoi = { noiDung: string; doTinCay: number; congCu?: { ten: string; maDon: string; thay: boolean } };

export function moHinhGia(tin: string): TraLoi {
  const ma = tin.match(/(?<!\d)(\d{4})(?!\d)/u)?.[1];
  if (ma) {
    const don = timDon(ma);
    if (!don) return { noiDung: `Mộc chưa thấy đơn ${ma}, bạn kiểm tra lại mã giúp mình nhé.`, doTinCay: 0.4, congCu: { ten: "tra_don", maDon: ma, thay: false } };
    return { noiDung: `Đơn ${ma} (${don.mon.join(", ")}) đang ở trạng thái: ${don.trangThai}.`, doTinCay: 0.95, congCu: { ten: "tra_don", maDon: ma, thay: true } };
  }
  if (/(?<!\p{L})(cảm ơn|cám ơn)(?!\p{L})/iu.test(tin)) return { noiDung: "Mộc cảm ơn bạn nhé!", doTinCay: 0.95 };
  if (/thực đơn|món gì|có món/iu.test(tin)) return { noiDung: "Mộc có cà phê sữa, bạc xỉu, cà phê muối và bánh mì trứng.", doTinCay: 0.95 };
  if (/giờ mở cửa|mấy giờ/iu.test(tin)) return { noiDung: "Mộc mở cửa từ 7:00 đến 21:00 mỗi ngày.", doTinCay: 0.95 };
  if (/đơn|giao/iu.test(tin)) return { noiDung: "Bạn cho Mộc xin mã đơn (4 chữ số) để tra giúp nhé.", doTinCay: 0.9 };
  return { noiDung: "Mộc chưa rõ ý bạn lắm.", doTinCay: 0.3 };
}
