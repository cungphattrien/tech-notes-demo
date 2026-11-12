// So sánh các phương án trong năm đầu: tổng lương gộp (gross) và lương thực nhận ước tính mỗi tháng sau thử việc.
// Chạy: node so-sanh-offer.ts
export type PhuongAn = { ten: string; luongChinhThuc: number; phanTramThuViec: number; thangThuViec: number };

export const TY_LE_BAO_HIEM_NGUOI_LAO_DONG = 0.105; // 8% BHXH + 1,5% BHYT + 1% BHTN
export const GIAM_TRU_BAN_THAN = 15_500_000; // mỗi tháng, từ kỳ tính thuế 2026

// Lương gộp 12 tháng đầu: các tháng thử việc nhận phần trăm lương, các tháng còn lại nhận đủ.
export function tongNamDau(pa: PhuongAn): number {
  const luongThuViec = Math.round((pa.luongChinhThuc * pa.phanTramThuViec) / 100);
  return luongThuViec * pa.thangThuViec + pa.luongChinhThuc * (12 - pa.thangThuViec);
}

// Lương thực nhận ước tính của một tháng chính thức. Chỉ tính được khi thu nhập tính thuế không dương (không phải nộp thuế TNCN);
// nếu lương cao hơn, hàm từ chối thay vì đoán biểu thuế.
export function thucNhanUocTinh(luongGross: number): number {
  const baoHiem = Math.round(luongGross * TY_LE_BAO_HIEM_NGUOI_LAO_DONG);
  if (luongGross - baoHiem - GIAM_TRU_BAN_THAN > 0) throw new Error(`Lương ${luongGross} đồng có thể phải nộp thuế TNCN: ngoài phạm vi của hàm này`);
  return luongGross - baoHiem;
}

const trieu = (dong: number) => `${(dong / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu`;

if (import.meta.main) {
  const goc: PhuongAn = { ten: "Thư mời gốc", luongChinhThuc: 10_000_000, phanTramThuViec: 85, thangThuViec: 2 };
  const cacPhuongAn: PhuongAn[] = [
    goc,
    { ...goc, ten: "Chỉ nâng lương thử việc lên 100%", phanTramThuViec: 100 },
    { ...goc, ten: "Đề nghị của Minh", luongChinhThuc: 12_000_000, phanTramThuViec: 100 },
    { ...goc, ten: "Hai bên gặp nhau ở giữa", luongChinhThuc: 11_000_000, phanTramThuViec: 90 },
  ];
  const tongGoc = tongNamDau(goc);
  for (const pa of cacPhuongAn) {
    const tong = tongNamDau(pa);
    const chenh = tong === tongGoc ? "" : `, hơn thư gốc ${trieu(tong - tongGoc)}`;
    console.log(`${pa.ten}: ${trieu(pa.luongChinhThuc)}/tháng, thử việc ${pa.phanTramThuViec}% → tổng 12 tháng ${trieu(tong)}${chenh}; thực nhận ~${trieu(thucNhanUocTinh(pa.luongChinhThuc))}/tháng sau thử việc`);
  }
}
