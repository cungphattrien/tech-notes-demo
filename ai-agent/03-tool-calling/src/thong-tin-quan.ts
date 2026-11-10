// Thông tin cố định của quán Mộc (minh họa), giống dữ liệu ở tập 1.
export const MENU: Record<string, number> = {
  "cà phê đen": 25000,
  "cà phê sữa": 29000,
  "bạc xỉu": 32000,
  "cà phê muối": 35000,
  "bánh mì trứng": 25000,
};

export const GIO_MO_CUA = "Mộc mở cửa từ 6:30 đến 22:00 mỗi ngày.";
export const PHI_SHIP = "Mộc giao trong bán kính 5 km, phí 15.000đ; đơn từ 150.000đ được miễn phí.";

export function bangGia(): string {
  return Object.entries(MENU)
    .map(([mon, gia]) => `- ${mon}: ${gia.toLocaleString("vi-VN")}đ`)
    .join("\n");
}
