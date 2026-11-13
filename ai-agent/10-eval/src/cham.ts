// Chấm một vết chạy: trả về danh sách điều SAI (rỗng nghĩa là đạt). Toàn bằng code, không gọi mô hình nào.
import type { Vet } from "./agent.ts";
import type { Kiem } from "./ca-thu.ts";

export function cham(vet: Vet, cacKiem: Kiem[]): string[] {
  const sai: string[] = [];
  for (const kiem of cacKiem) {
    if (kiem.loai === "tra-don" && !vet.maDonDaTra.includes(kiem.maDon)) sai.push(`không tra đơn ${kiem.maDon} (đoán bừa)`);
    if (kiem.loai === "khong-tra-don" && vet.maDonDaTra.length > 0) sai.push("tra đơn khi không cần");
    if (kiem.loai === "chuyen-cho-nguoi" && !vet.chuyenChoNguoi) sai.push("không chuyển cho người");
    if (kiem.loai === "co" && !kiem.mau.test(vet.traLoi)) sai.push(`câu trả lời thiếu ${kiem.mau}`);
    if (kiem.loai === "khong-co" && kiem.mau.test(vet.traLoi)) sai.push(kiem.lyDo);
  }
  return sai;
}
