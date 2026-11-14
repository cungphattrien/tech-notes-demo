// Tìm khung giờ mà cả nhóm cùng đang làm việc, khi mỗi người ở một múi giờ.
// Chạy: node gio-trung.ts doi-nhom.json 2026-12-14
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type Nguoi = { ten: string; muiGio: string; tu: string; den: string };
export type Khung = { batDau: number; ketThuc: number }; // mili giây UTC

// Chênh lệch (phút) giữa giờ treo tường ở múi giờ đó và UTC, tại một thời điểm. Đã tính cả giờ mùa hè.
export function chenhLechPhut(thoiDiem: number, muiGio: string): number {
  const phan = new Intl.DateTimeFormat("en-US", {
    timeZone: muiGio, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(new Date(thoiDiem));
  const lay = (loai: string) => Number(phan.find((p) => p.type === loai)?.value);
  const treoTuong = Date.UTC(lay("year"), lay("month") - 1, lay("day"), lay("hour"), lay("minute"), lay("second"));
  return Math.round((treoTuong - Math.floor(thoiDiem / 1000) * 1000) / 60000);
}

// "09:00 ngày 2026-12-14 ở Europe/Berlin" là thời điểm UTC nào?
export function thoiDiemDiaPhuong(ngay: string, gio: string, muiGio: string): number {
  const [nam, thang, ngayTrongThang] = ngay.split("-").map(Number);
  const [h, p] = gio.split(":").map(Number);
  const doan = Date.UTC(nam, thang - 1, ngayTrongThang, h, p);
  // Đoán rằng chênh lệch bằng chênh lệch tại thời điểm đoán, rồi tinh chỉnh một lần (đủ ngay cả ngày đổi giờ).
  const lan1 = doan - chenhLechPhut(doan, muiGio) * 60000;
  return doan - chenhLechPhut(lan1, muiGio) * 60000;
}

export function khungLamViec(nguoi: Nguoi, ngay: string): Khung {
  return { batDau: thoiDiemDiaPhuong(ngay, nguoi.tu, nguoi.muiGio), ketThuc: thoiDiemDiaPhuong(ngay, nguoi.den, nguoi.muiGio) };
}

export function giaoNhau(cacKhung: Khung[]): Khung | null {
  const batDau = Math.max(...cacKhung.map((k) => k.batDau));
  const ketThuc = Math.min(...cacKhung.map((k) => k.ketThuc));
  return ketThuc > batDau ? { batDau, ketThuc } : null;
}

export function gio(thoiDiem: number, muiGio: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: muiGio, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(thoiDiem));
}

function chayDong(lenh: string[]): void {
  const [file, ngay] = lenh;
  if (!file || !ngay) throw new Error("Cần file và ngày, ví dụ: node gio-trung.ts doi-nhom.json 2026-12-14");
  const nhom = JSON.parse(readFileSync(file, "utf8")) as Nguoi[];
  console.log(`Ngày ${ngay}, mỗi người làm từ ${nhom[0].tu} đến ${nhom[0].den} theo giờ của mình:`);
  for (const nguoi of nhom) {
    const k = khungLamViec(nguoi, ngay);
    const lech = chenhLechPhut(k.batDau, nguoi.muiGio) / 60;
    console.log(`  ${nguoi.ten.padEnd(9)} UTC${lech >= 0 ? "+" : ""}${lech}  = ${gio(k.batDau, "Asia/Ho_Chi_Minh")}–${gio(k.ketThuc, "Asia/Ho_Chi_Minh")} giờ Việt Nam`);
  }
  const chung = giaoNhau(nhom.map((n) => khungLamViec(n, ngay)));
  if (!chung) return void console.log("Không có giờ nào cả nhóm cùng làm việc.");
  console.log(`Giờ cả nhóm cùng làm việc: ${gio(chung.batDau, "Asia/Ho_Chi_Minh")}–${gio(chung.ketThuc, "Asia/Ho_Chi_Minh")} giờ Việt Nam (${(chung.ketThuc - chung.batDau) / 60000} phút)`);
  for (const nguoi of nhom) console.log(`  với ${nguoi.ten}: ${gio(chung.batDau, nguoi.muiGio)}–${gio(chung.ketThuc, nguoi.muiGio)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) chayDong(process.argv.slice(2));
