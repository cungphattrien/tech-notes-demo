// Bài luyện 20 phút: cho danh sách khoản chi, trả về tổng tiền từng tháng, tháng mới nhất trước.
// Minh tự đặt bài này vì nó gần với sản phẩm của công ty A (ứng dụng quản lý chi tiêu).
export type KhoanChi = { ngay: string; soTien: number }; // ngay dạng "2026-11-03"

export function tongTheoThang(khoanChi: KhoanChi[]): { thang: string; tong: number }[] {
  const tong = new Map<string, number>();
  for (const { ngay, soTien } of khoanChi) {
    const thang = ngay.slice(0, 7); // "2026-11-03" → "2026-11"
    tong.set(thang, (tong.get(thang) ?? 0) + soTien);
  }
  // Chuỗi "YYYY-MM" so sánh theo thứ tự chữ cũng đúng thứ tự thời gian, nên sắp xếp chuỗi là đủ.
  return [...tong].map(([thang, tong]) => ({ thang, tong })).sort((a, b) => b.thang.localeCompare(a.thang));
}
