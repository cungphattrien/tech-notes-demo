// Bảng giá GIẢ ĐỊNH (đô la cho một triệu token) để so sánh. Không phải giá của hãng nào: giá thật xem ở trang giá của nhà cung cấp.
export type MoHinh = "lon" | "nho";
export const BANG_GIA: Record<MoHinh, { vao: number; ra: number }> = {
  lon: { vao: 3, ra: 15 },
  nho: { vao: 0.8, ra: 4 },
};

// Hệ số cache prompt, theo tài liệu của Anthropic (tra ngày 13/11/2026): ghi cache 5 phút = 1,25 lần giá vào,
// ghi cache 1 giờ = 2 lần, đọc cache = 0,1 lần (một số mô hình mới có hệ số đọc còn thấp hơn).
export const HE_SO = { ghi5Phut: 1.25, ghi1Gio: 2, doc: 0.1 };

export type LuotGoi = {
  moHinh: MoHinh;
  tokenVao: number; // tổng token đầu vào của lượt gọi
  tokenRa: number;
  cache: "doc" | "ghi5p" | "ghi1h" | "khong"; // phần "tiền tố" ổn định (tokenTienTo) được tính theo cách nào
  tokenTienTo: number;
};

export function tinhTien(luot: LuotGoi): number {
  const gia = BANG_GIA[luot.moHinh];
  const phanDoi = luot.tokenVao - luot.tokenTienTo; // phần thay đổi theo từng tin nhắn, luôn tính giá thường
  const heSoTienTo = luot.cache === "doc" ? HE_SO.doc : luot.cache === "ghi5p" ? HE_SO.ghi5Phut : luot.cache === "ghi1h" ? HE_SO.ghi1Gio : 1;
  const vao = (phanDoi + luot.tokenTienTo * heSoTienTo) * gia.vao;
  return (vao + luot.tokenRa * gia.ra) / 1_000_000;
}
