// Vẽ thẻ chia sẻ cho ba tiêu đề, và một lần ép cỡ chữ 72 cho tiêu đề dài để thấy lỗi. Chạy: npx tsx ve-anh.tsx
import { mkdir, writeFile } from "node:fs/promises";

import { docKichThuocPng } from "./src/png.ts";
import { TIEU_DE } from "./src/tieu-de.ts";
import { coChuTieuDe, veTheChiaSe } from "./src/the-chia-se.tsx";

await mkdir("ra", { recursive: true });
const thongTin = (tieuDe: string) => ({ tieuDe, nhan: "WEB THỰC CHIẾN · Trung cấp", chanTrang: "9 phút đọc" });

const mucTieu = [
  { tep: "2-ngan", tieuDe: TIEU_DE.ngan, coChu: coChuTieuDe(TIEU_DE.ngan) },
  { tep: "3-vua", tieuDe: TIEU_DE.vua, coChu: coChuTieuDe(TIEU_DE.vua) },
  { tep: "4-dai-ep-co-72", tieuDe: TIEU_DE.dai, coChu: 72 }, // cố ý sai: cỡ chữ không đổi theo độ dài
  { tep: "5-dai", tieuDe: TIEU_DE.dai, coChu: coChuTieuDe(TIEU_DE.dai) },
];

for (const { tep, tieuDe, coChu } of mucTieu) {
  const batDau = performance.now();
  const anh = Buffer.from(await veTheChiaSe(thongTin(tieuDe), coChu).arrayBuffer());
  const ms = Math.round(performance.now() - batDau);
  await writeFile(`ra/${tep}.png`, anh);
  const { rong, cao } = docKichThuocPng(anh);
  console.log(`ra/${tep}.png`.padEnd(26), `${String(tieuDe.length).padStart(3)} ký tự, chữ ${coChu}px, ${rong}x${cao}, ${(anh.length / 1024).toFixed(1)} KB, ${ms} ms`);
}
