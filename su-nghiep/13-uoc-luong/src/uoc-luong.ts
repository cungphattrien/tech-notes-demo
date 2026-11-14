// Ước lượng một việc bằng khoảng (không phải một con số), hiệu chỉnh bằng lịch sử chính mình, và đổi giờ làm ra ngày lịch.
// Mọi con số trong lich-su.json là minh họa (nhân vật Minh), không phải số đo từ nhóm thật.

export type Viec = { viec: string; uocGio: number; thucGio: number };
export type ViecCanLam = { ten: string; gio: number };

/** Số giờ tập trung viết code, test, đọc code trong một ngày làm việc. Do mình giả định; mỗi người, mỗi nhóm một khác. */
export const GIO_TAP_TRUNG_MOI_NGAY = 5;

/** Thực tế chia ước lượng: 1,5 nghĩa là việc tốn gấp rưỡi so với dự đoán. */
export const heSoLech = (lichSu: Viec[]): number[] => lichSu.map((v) => v.thucGio / v.uocGio);

/** Phân vị kiểu nearest-rank: p = 0.8 là giá trị nhỏ nhất mà ít nhất 80% giá trị khác nhỏ hơn hoặc bằng nó. */
export function phanVi(giaTri: number[], p: number): number {
  if (giaTri.length === 0) throw new Error("Cần ít nhất một giá trị");
  const sapXep = [...giaTri].sort((a, b) => a - b);
  const chiSo = Math.min(sapXep.length - 1, Math.max(0, Math.ceil(p * sapXep.length) - 1));
  return sapXep[chiSo]!;
}

/** Bao nhiêu phần trăm việc trong lịch sử xong đúng hạn hoặc sớm hơn ước lượng ban đầu. */
export const tiLeDungHan = (lichSu: Viec[]): number => lichSu.filter((v) => v.thucGio <= v.uocGio).length / lichSu.length;

export type KhoangUocLuong = { gioCongLai: number; gioThuong: number; gioChac: number };

/**
 * Cộng giờ các việc nhỏ, rồi nhân với hệ số lệch trong lịch sử:
 * gioThuong dùng phân vị 50 (một nửa số lần xong trong mức này), gioChac dùng phân vị 80.
 */
export function uocLuong(cacViec: ViecCanLam[], lichSu: Viec[]): KhoangUocLuong {
  const gioCongLai = cacViec.reduce((tong, v) => tong + v.gio, 0);
  const he = heSoLech(lichSu);
  return { gioCongLai, gioThuong: gioCongLai * phanVi(he, 0.5), gioChac: gioCongLai * phanVi(he, 0.8) };
}

const THU = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

/** Tên thứ của một ngày "YYYY-MM-DD". Tính theo UTC nên không phụ thuộc múi giờ máy. */
export const thuCua = (ngay: string): string => THU[new Date(`${ngay}T00:00:00Z`).getUTCDay()]!;

/**
 * Ngày xong nếu bắt đầu làm từ đầu ngày `batDau` và mỗi ngày làm `gioMoiNgay` giờ tập trung, chỉ tính thứ hai đến thứ sáu.
 * Bắt đầu vào cuối tuần thì tính từ thứ hai kế tiếp.
 */
export function ngayXong(batDau: string, gio: number, gioMoiNgay = GIO_TAP_TRUNG_MOI_NGAY): string {
  const d = new Date(`${batDau}T00:00:00Z`);
  const laCuoiTuan = () => d.getUTCDay() === 0 || d.getUTCDay() === 6;
  while (laCuoiTuan()) d.setUTCDate(d.getUTCDate() + 1);
  let conLaiNgay = Math.max(1, Math.ceil(gio / gioMoiNgay)) - 1; // ngày đầu đã tính
  while (conLaiNgay > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (!laCuoiTuan()) conLaiNgay--;
  }
  return d.toISOString().slice(0, 10);
}
