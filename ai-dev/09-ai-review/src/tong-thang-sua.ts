// Bản đã sửa theo các nhận xét được xác nhận: tháng luôn tính theo giờ Việt Nam, không đổi mảng của người gọi (và bỏ sort thừa),
// và tháng sai định dạng thì báo lỗi rõ ràng thay vì lặng lẽ trả 0.
import type { Khoan } from "./tong-thang.ts";

const DINH_DANG_THANG = /^\d{4}-(0[1-9]|1[0-2])$/;
// Ngôn ngữ "sv-SE" chỉ để có sẵn dạng "2026-12"; múi giờ mới là thứ quyết định kết quả.
const thangVietNam = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit" });

export function tongTheoThang(cacKhoan: readonly Khoan[], thang: string): number {
  if (!DINH_DANG_THANG.test(thang)) throw new RangeError(`Tháng phải có dạng YYYY-MM, nhận được "${thang}"`);
  let tong = 0;
  for (const khoan of cacKhoan) {
    if (thangVietNam.format(new Date(khoan.luc)) === thang) tong += khoan.soTien;
  }
  return tong;
}
