// Đoạn code đang được review: tổng chi tiêu trong một tháng của app sổ chi tiêu.
// Đây là bản "pull request" cần review. Nó chạy được và trông hợp lý, nhưng có lỗi thật (xem kiem-nhan-xet.ts).
export type Khoan = { luc: string; soTien: number; ghiChu: string };

// thang có dạng "2026-12". Trả tổng số tiền các khoản chi rơi vào tháng đó.
export function tongTheoThang(cacKhoan: Khoan[], thang: string): number {
  cacKhoan.sort((a, b) => a.luc.localeCompare(b.luc));
  let tong = 0;
  for (const khoan of cacKhoan) {
    const ngay = new Date(khoan.luc);
    const khoa = `${ngay.getFullYear()}-${String(ngay.getMonth() + 1).padStart(2, "0")}`;
    if (khoa === thang) tong += khoan.soTien;
  }
  return tong;
}
