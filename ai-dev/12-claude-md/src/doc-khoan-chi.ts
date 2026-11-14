// Bản đọc khoản chi RÚT GỌN cho bài này: "cà phê 35k", "tiền nhà 3tr", "ăn phở 45.000" -> { note, amount }.
// Bản đầy đủ của app (tập 1) xử lý thêm nhiều trường hợp; ở đây chỉ cần đủ để có ghi chú và số tiền cho bước phân loại.
export type KhoanChi = { note: string; amount: number };

const SO_TIEN = /(?<![\p{L}\d])(\d{1,3}(?:[.,]\d{3})+|\d+)(k|tr)?(?![\p{L}\d])/giu;

export function docKhoanChi(tin: string): KhoanChi | null {
  const cacSo = [...tin.normalize("NFC").matchAll(SO_TIEN)];
  if (cacSo.length !== 1) return null; // thiếu số tiền, hoặc có nhiều hơn một
  const [token, chuSo, donVi] = cacSo[0];
  const goc = Number(chuSo.replace(/[.,]/g, ""));
  const amount = donVi?.toLowerCase() === "k" ? goc * 1_000 : donVi?.toLowerCase() === "tr" ? goc * 1_000_000 : goc;
  const note = tin.normalize("NFC").replace(token, " ").replace(/\s+/g, " ").trim();
  return note && amount > 0 ? { note, amount } : null;
}

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
