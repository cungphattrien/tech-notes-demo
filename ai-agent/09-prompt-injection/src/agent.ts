// Hai bản của cùng một agent: "ngay-tho" (như các tập trước, tin vào mô hình) và "co-phong-thu" (kiểm tra trong code).
import { timDon } from "./du-lieu.ts";
import { moHinhDeDut, type TinNhan } from "./mo-hinh-gia.ts";

export type CheDo = "ngay-tho" | "co-phong-thu";
// Phiên chat: số điện thoại do ứng dụng xác thực lúc đăng nhập. Mô hình không tự khai và không đổi được.
export type Phien = { soDienThoaiDaXacThuc: string };
export type KetQua = { traLoi: string; chuyenChoNguoi: boolean };

export const CAU_CHUYEN_NGUOI = "Dạ em đã chuyển yêu cầu của mình cho chủ quán để xác nhận, quán sẽ liên hệ lại ạ.";

// Câu trả lời của agent đi qua đây trước khi tới khách. Chỉ chặn những câu CAM KẾT hoàn tiền ("xác nhận hoàn", "sẽ hoàn", ...),
// không chặn mọi câu có chữ "hoàn tiền": agent vẫn phải nói được "em đã chuyển yêu cầu hoàn tiền cho chủ quán".
const CAM_KET_HOAN_TIEN = /(xác nhận|đồng ý|cam kết|sẽ|đã)( \S+)? hoàn/i;
export function kiemTraDauRa(noiDung: string): { chan: boolean } {
  return { chan: CAM_KET_HOAN_TIEN.test(noiDung) };
}

// Công cụ xem đơn. Bản phòng thủ: (1) chỉ trả đơn của chính khách trong phiên, (2) chỉ trả những trường agent cần,
// không trả ghi chú giao hàng do bên thứ ba nhập.
function chayXemDon(phien: Phien, maDon: string, cheDo: CheDo): string {
  const don = timDon(maDon);
  if (cheDo === "ngay-tho") {
    return don ? JSON.stringify({ ma_don: don.maDon, mon: don.mon, trang_thai: don.trangThai, ghi_chu_giao_hang: don.ghiChuGiaoHang }) : `Không có đơn ${maDon}.`;
  }
  // Không nói "đơn này của người khác": trả đúng câu như đơn không tồn tại để không lộ việc nó có thật.
  if (!don || don.soDienThoai !== phien.soDienThoaiDaXacThuc) return `Không có đơn ${maDon}.`;
  return JSON.stringify({ ma_don: don.maDon, mon: don.mon, trang_thai: don.trangThai });
}

export function traLoi(phien: Phien, tinNhan: string, cheDo: CheDo): KetQua {
  const cacTin: TinNhan[] = [{ vaiTro: "khach", noiDung: tinNhan }];
  for (let luot = 0; luot < 4; luot++) {
    const dauRa = moHinhDeDut(cacTin);
    if (dauRa.loai === "goi-cong-cu") {
      cacTin.push({ vaiTro: "cong-cu", noiDung: chayXemDon(phien, dauRa.dauVao.ma_don, cheDo) });
      continue;
    }
    if (cheDo === "co-phong-thu" && kiemTraDauRa(dauRa.noiDung).chan) return { traLoi: CAU_CHUYEN_NGUOI, chuyenChoNguoi: true };
    return { traLoi: dauRa.noiDung, chuyenChoNguoi: false };
  }
  return { traLoi: CAU_CHUYEN_NGUOI, chuyenChoNguoi: true };
}
