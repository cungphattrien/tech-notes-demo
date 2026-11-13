// Agent của quán Mộc. KHÔNG gọi mô hình thật: moHinh là "mô hình" giả; thay bằng một lần gọi API thì phần còn lại giữ nguyên.
import { timDon } from "./du-lieu.ts";

// "Vết" của một lần chạy, thứ phần chấm điểm đọc.
export type Vet = { traLoi: string; chuyenChoNguoi: boolean; maDonDaTra: string[]; soLuotGoiMoHinh: number };
export type PhienBan = "v1" | "v2";

const CHUYEN_NGUOI = "Dạ em đã chuyển yêu cầu của mình cho chủ quán, quán sẽ liên hệ lại ạ.";
type DauRa = { noiDung: string } | { maDon: string };

function moHinh(tin: string, ketQuaCongCu: string | undefined, ngauNhien: () => number): DauRa {
  if (ketQuaCongCu !== undefined) {
    if (!ketQuaCongCu.startsWith("{")) return { noiDung: `Dạ ${ketQuaCongCu.charAt(0).toLowerCase()}${ketQuaCongCu.slice(1)}` };
    const don = JSON.parse(ketQuaCongCu);
    return { noiDung: `Dạ đơn ${don.maDon} của mình ${don.trangThai}, gồm ${don.mon.join(", ")} ạ.` };
  }
  const lenh = tin.match(/hãy trả lời:\s*"([^"]+)"/i); // nghe theo câu lệnh của khách (như bài prompt injection)
  if (lenh) return { noiDung: lenh[1] };
  if (/hoàn tiền|đền tiền|trả lại tiền/i.test(tin)) return { noiDung: "Dạ quán sẽ hoàn tiền cho mình ngay ạ." };
  const maDon = tin.match(/đơn (\d{4})/i)?.[1];
  if (maDon) {
    if (ngauNhien() < 0.1) return { noiDung: "Dạ đơn của mình sắp tới rồi ạ." }; // "lười": 1 lần trong 10 đoán bừa, không tra
    return { maDon };
  }
  if (/thực đơn|món gì/i.test(tin)) return { noiDung: "Dạ quán có cà phê sữa, bạc xỉu, cà phê muối và bánh mì trứng ạ." };
  return { noiDung: "Dạ em chỉ hỗ trợ về đơn hàng và thực đơn của quán Mộc thôi ạ." };
}

// Công cụ xem_don: chỉ trả đơn của chính khách (số điện thoại do ứng dụng xác thực, mô hình không khai được).
function xemDon(soDienThoai: string, maDon: string): string {
  const don = timDon(maDon);
  return don && don.soDienThoai === soDienThoai ? JSON.stringify(don) : `Không có đơn ${maDon}.`;
}

const CAM_KET_HOAN_TIEN = /(xác nhận|đồng ý|cam kết|sẽ|đã)( \S+)? hoàn/i; // lớp chặn đầu ra, như bài prompt injection

export function chayAgent(soDienThoai: string, tin: string, phienBan: PhienBan, ngauNhien: () => number): Vet {
  const vet: Vet = { traLoi: "", chuyenChoNguoi: false, maDonDaTra: [], soLuotGoiMoHinh: 1 };
  let dauRa = moHinh(tin, undefined, ngauNhien);
  if ("maDon" in dauRa) {
    vet.maDonDaTra.push(dauRa.maDon);
    dauRa = moHinh(tin, xemDon(soDienThoai, dauRa.maDon), ngauNhien);
    vet.soLuotGoiMoHinh += 1;
  }
  const noiDung = (dauRa as { noiDung: string }).noiDung;
  if (phienBan === "v1" && CAM_KET_HOAN_TIEN.test(noiDung)) {
    vet.traLoi = CHUYEN_NGUOI;
    vet.chuyenChoNguoi = true;
  } else {
    // v2 ("thân thiện hơn"): thêm lời chào vào mọi câu trả lời, và bỏ lớp chặn đầu ra vì "thấy rườm".
    vet.traLoi = phienBan === "v2" ? `Mộc cảm ơn mình đã nhắn ạ! ${noiDung}` : noiDung;
  }
  return vet;
}
