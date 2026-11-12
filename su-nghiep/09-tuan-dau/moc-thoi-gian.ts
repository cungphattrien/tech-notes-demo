// Bản đồ của thời gian thử việc: ngày nào là ngày thứ mấy, thứ mấy trong tuần, và có bao nhiêu ngày làm việc thật sự.
// Chạy: node moc-thoi-gian.ts
// Ngày bắt đầu và ngày kết thúc lấy từ thư mời đã chỉnh ở tập 8 (minh họa): 01/12/2026 đến 29/01/2027 (60 ngày).
// Ngày lễ: chỉ liệt kê những ngày nghỉ lễ rơi vào khoảng thử việc này (Tết Dương lịch 01/01).

export const NGAY_LE = new Set(["2027-01-01"]);
const THU = ["Chủ nhật", "thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy"];
const MOT_NGAY = 86_400_000;

// Dùng giờ UTC cho mọi phép tính ngày, để kết quả không đổi theo múi giờ của máy chạy.
const cong = (ngay: string, soNgay: number) => new Date(Date.parse(`${ngay}T00:00:00Z`) + soNgay * MOT_NGAY).toISOString().slice(0, 10);
const thuTrongTuan = (ngay: string) => new Date(`${ngay}T00:00:00Z`).getUTCDay();
const dinhDang = (ngay: string) => `${ngay.slice(8)}/${ngay.slice(5, 7)}/${ngay.slice(0, 4)}`;

// Ngày thứ N của thời gian thử việc (N = 1 là ngày bắt đầu).
export function ngayThuN(batDau: string, n: number): string {
  return cong(batDau, n - 1);
}

export function laNgayLamViec(ngay: string): boolean {
  const thu = thuTrongTuan(ngay);
  return thu !== 0 && thu !== 6 && !NGAY_LE.has(ngay);
}

// Số ngày làm việc (không tính thứ Bảy, Chủ nhật, ngày lễ) từ ngày bắt đầu đến ngày kết thúc, tính cả hai đầu.
export function demNgayLamViec(batDau: string, ketThuc: string): number {
  const tong = Math.round((Date.parse(ketThuc) - Date.parse(batDau)) / MOT_NGAY) + 1;
  return Array.from({ length: tong }, (_, i) => cong(batDau, i)).filter(laNgayLamViec).length;
}

export type Moc = { ngayThu: number; viec: string };

export function inBanDo(batDau: string, ketThuc: string, cacMoc: Moc[]): string[] {
  const dong = cacMoc.map((moc) => {
    const ngay = ngayThuN(batDau, moc.ngayThu);
    const ghiChu = laNgayLamViec(ngay) ? "" : "  <- không phải ngày làm việc, dời sang ngày làm việc kế tiếp";
    return `Ngày ${String(moc.ngayThu).padStart(2)}: ${dinhDang(ngay)} (${THU[thuTrongTuan(ngay)]}) — ${moc.viec}${ghiChu}`;
  });
  const tongNgay = Math.round((Date.parse(ketThuc) - Date.parse(batDau)) / MOT_NGAY) + 1;
  dong.push(`Tổng: ${tongNgay} ngày lịch, trong đó ${demNgayLamViec(batDau, ketThuc)} ngày làm việc (bỏ thứ Bảy, Chủ nhật và ngày lễ 01/01).`);
  return dong;
}

if (import.meta.main) {
  const cacMoc: Moc[] = [
    { ngayThu: 1, viec: "ngày đầu: nhận máy, tài khoản, gặp người hướng dẫn" },
    { ngayThu: 3, viec: "mục tiêu: môi trường chạy được dự án" },
    { ngayThu: 8, viec: "mục tiêu: pull request nhỏ đầu tiên" },
    { ngayThu: 30, viec: "hẹn người hướng dẫn góp ý giữa kỳ" },
    { ngayThu: 60, viec: "hết thử việc" },
  ];
  for (const dong of inBanDo("2026-12-01", "2027-01-29", cacMoc)) console.log(dong);
}
