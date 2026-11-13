// Mỗi hàm chuẩn hóa MỘT ô của file CSV cũ. Đầu vào sai thì ném lỗi có lý do bằng tiếng Việt, không đoán.
export const MIN_TIEN = 1000; // quán Mộc không có đơn nào dưới 1.000đ; nhỏ hơn gần như chắc chắn là mất dấu chấm ("35.000" thành 35)

// "0901 000 001", "+84 902 000 002", "(090)1000003" → "0901000001". Ô trống: khách mua tại quầy, không có số.
export function chuanHoaSdt(goc: string): string | undefined {
  const sach = goc.replace(/[\s.()-]/g, "").replace(/^\+84/, "0");
  if (sach === "") return undefined;
  if (!/^0\d{9}$/.test(sach)) throw new Error(`số điện thoại "${goc.trim()}" không hợp lệ`);
  return sach;
}

// "03/11/2026", "3-11-26", "2026.11.03" → "2026-11-03". Giả định ngày đứng trước tháng (máy bán hàng ở Việt Nam).
export function chuanHoaNgay(goc: string): string {
  const khop = goc.trim().match(/^(?<a>\d{1,4})[/.-](?<b>\d{1,2})[/.-](?<c>\d{1,4})$/);
  if (!khop?.groups) throw new Error(`ngày "${goc.trim()}" không đúng dạng`);
  const { a, b, c } = khop.groups;
  // Số đầu có 4 chữ số thì là năm (yyyy.mm.dd); ngược lại là ngày (dd/mm/yyyy hoặc dd-mm-yy).
  const [nam, thang, ngay] = a.length === 4 ? [a, b, c] : [c.length === 2 ? `20${c}` : c, b, a];
  const ngayThat = new Date(Date.UTC(Number(nam), Number(thang) - 1, Number(ngay)));
  if (nam.length !== 4 || ngayThat.getUTCFullYear() !== Number(nam) || ngayThat.getUTCMonth() !== Number(thang) - 1 || ngayThat.getUTCDate() !== Number(ngay)) {
    throw new Error(`ngày ${goc.trim()} không tồn tại`);
  }
  return `${nam}-${thang.padStart(2, "0")}-${ngay.padStart(2, "0")}`;
}

// "79.000đ", "32,000", "85k", "75000" → số đồng. "abc" hoặc số nhỏ hơn MIN_TIEN thì báo lỗi.
export function chuanHoaTien(goc: string): number {
  const khop = goc.trim().match(/^(?<so>\d{1,3}(?:[.,]\d{3})+|\d+)\s*(?<hau>đ|k)?$/iu);
  if (!khop?.groups) throw new Error(`tổng tiền "${goc.trim()}" không đọc được`);
  const tien = Number(khop.groups.so.replace(/[.,]/g, "")) * (khop.groups.hau?.toLowerCase() === "k" ? 1000 : 1);
  if (tien < MIN_TIEN) throw new Error(`tổng tiền ${tien}đ nhỏ hơn ${MIN_TIEN}đ, nghi mất dấu chấm`);
  return tien;
}

export type Mon = { ten: string; soLuong: number };

// "2 x cà phê sữa; 1x bánh mì trứng" → hai món. Món không ghi số lượng thì tính là 1.
export function tachMon(goc: string): Mon[] {
  const cacMon = goc
    .split(";")
    .map((phan) => phan.trim())
    .filter(Boolean)
    .map((phan) => {
      const khop = phan.match(/^(?:(?<soLuong>\d+)\s*[x×]\s*)?(?<ten>.+)$/iu)!;
      return { ten: khop.groups!.ten.trim(), soLuong: Number(khop.groups!.soLuong ?? 1) };
    });
  if (cacMon.length === 0) throw new Error("đơn không có món nào");
  return cacMon;
}
