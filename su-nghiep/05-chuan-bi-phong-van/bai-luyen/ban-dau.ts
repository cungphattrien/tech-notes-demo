// Bản Minh viết lần đầu, trong 20 phút bấm giờ. Chạy: node bai-luyen/ban-dau.ts
type KhoanChi = { ngay: string; soTien: number };

function tongTheoThang(khoanChi: KhoanChi[]) {
  const tong: Record<number, number> = {};
  for (const { ngay, soTien } of khoanChi) {
    const thang = new Date(ngay).getMonth() + 1; // chỉ lấy số tháng
    tong[thang] = (tong[thang] ?? 0) + soTien;
  }
  return tong;
}

// Hai khoản ở tháng 12 của hai năm khác nhau, và một khoản tháng 1.
console.log(tongTheoThang([
  { ngay: "2025-12-31", soTien: 10000 },
  { ngay: "2026-01-01", soTien: 20000 },
  { ngay: "2026-12-05", soTien: 30000 },
]));
