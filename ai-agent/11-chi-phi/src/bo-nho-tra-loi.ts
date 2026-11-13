// Nhớ câu trả lời để khỏi gọi mô hình lần nữa. Có hai cách làm: cách đầu (sai) nhớ theo nội dung tin nhắn cho MỌI tin,
// cách đúng chỉ nhớ câu hỏi chung, tức câu trả lời giống nhau với mọi khách.
import { timDon } from "./du-lieu.ts";
import { laCauHoiChung } from "./dinh-tuyen.ts";

// Một "agent" rất nhỏ để thử: trả lời câu hỏi chung, hoặc đọc đơn gần nhất của chính khách đang nhắn.
export function traLoiThat(soDienThoai: string, tin: string, ghiSoLan: () => void): string {
  ghiSoLan(); // mỗi lần vào đây là một lượt gọi mô hình thật
  if (/đơn.*(gần nhất|của em)/iu.test(tin)) {
    const don = ["1041", "1042", "1043"].map((ma) => timDon(ma)).find((d) => d?.soDienThoai === soDienThoai);
    return don ? `Dạ đơn ${don.maDon} của mình ${don.trangThai}, gồm ${don.mon.join(", ")} ạ.` : "Dạ em chưa thấy đơn nào của mình ạ.";
  }
  if (/giờ/iu.test(tin)) return "Dạ quán mở cửa từ 7 giờ đến 21 giờ mỗi ngày ạ.";
  return "Dạ em chỉ hỗ trợ về đơn hàng và thực đơn của quán Mộc thôi ạ.";
}

const chuanHoa = (tin: string) => tin.trim().toLowerCase().replace(/\s+/g, " ");

/** Cách SAI: nhớ theo nội dung tin nhắn, bất kể câu trả lời có phụ thuộc vào khách hay không. */
export class NhoTheoTin {
  private nho = new Map<string, string>();
  hoi(soDienThoai: string, tin: string, goiMoHinh: () => void): string {
    const khoa = chuanHoa(tin);
    const co = this.nho.get(khoa);
    if (co !== undefined) return co;
    const traLoi = traLoiThat(soDienThoai, tin, goiMoHinh);
    this.nho.set(khoa, traLoi);
    return traLoi;
  }
}

/** Cách ĐÚNG: chỉ nhớ câu hỏi chung, và câu trả lời hết hạn sau `ttlGiay` để khi đổi thực đơn không bị cũ mãi. */
export class NhoCauHoiChung {
  private nho = new Map<string, { traLoi: string; hetHan: number }>();
  private ttlGiay: number;
  constructor(ttlGiay = 3600) {
    this.ttlGiay = ttlGiay;
  }
  hoi(soDienThoai: string, tin: string, giay: number, goiMoHinh: () => void): string {
    if (!laCauHoiChung(tin)) return traLoiThat(soDienThoai, tin, goiMoHinh); // câu riêng của khách: không bao giờ nhớ
    const khoa = chuanHoa(tin);
    const co = this.nho.get(khoa);
    if (co && co.hetHan > giay) return co.traLoi;
    const traLoi = traLoiThat(soDienThoai, tin, goiMoHinh);
    this.nho.set(khoa, { traLoi, hetHan: giay + this.ttlGiay });
    return traLoi;
  }
}
