// Sổ "đoán trước": viết ra điều bạn nghĩ AI sẽ làm TRƯỚC khi nó làm, rồi chốt kết quả sau. Mục đích là giữ cho mình còn hiểu
// vấn đề: nếu bạn đoán đúng hầu hết, bạn đang hiểu; nếu sai nhiều, đó là chỗ cần dừng lại và đọc.
// Lưu trong một file JSON Lines. Chạy: node du-doan.ts ghi "việc" "dự đoán"  |  chot <số> dung|sai|mot-phan "ghi chú"  |  tong-ket
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export type KetQua = "dung" | "sai" | "mot-phan";
export type Muc = { so: number; viec: string; duDoan: string; ketQua?: KetQua; ghiChu?: string };

export const docSo = (noiDung: string): Muc[] => noiDung.split(/\r?\n/).filter(Boolean).map((d) => JSON.parse(d) as Muc);
export const ghiSo = (cacMuc: Muc[]): string => cacMuc.map((m) => JSON.stringify(m)).join("\n") + "\n";

export function ghi(cacMuc: Muc[], viec: string, duDoan: string): Muc[] {
  if (duDoan.trim().length < 10) throw new Error("Dự đoán quá ngắn: viết ít nhất một câu nói bạn nghĩ AI sẽ làm gì và kết quả trông ra sao.");
  return [...cacMuc, { so: (cacMuc.at(-1)?.so ?? 0) + 1, viec, duDoan }];
}

export function chot(cacMuc: Muc[], so: number, ketQua: KetQua, ghiChu = ""): Muc[] {
  const muc = cacMuc.find((m) => m.so === so);
  if (!muc) throw new Error(`Không có mục số ${so}.`);
  if (muc.ketQua) throw new Error(`Mục ${so} đã chốt là "${muc.ketQua}", không đổi lại sau khi biết kết quả.`);
  if (ketQua !== "dung" && ghiChu.trim() === "") throw new Error("Đoán sai hoặc đúng một phần thì phải ghi chú vì sao, đó là phần có giá trị nhất.");
  return cacMuc.map((m) => (m.so === so ? { ...m, ketQua, ghiChu } : m));
}

export function tongKet(cacMuc: Muc[]): string[] {
  const xong = cacMuc.filter((m) => m.ketQua);
  const dem = (k: KetQua) => xong.filter((m) => m.ketQua === k).length;
  const dong = [`${cacMuc.length} mục, ${xong.length} đã chốt, ${cacMuc.length - xong.length} chưa chốt.`];
  if (xong.length > 0) dong.push(`Đoán đúng ${dem("dung")}, đúng một phần ${dem("mot-phan")}, sai ${dem("sai")} (${Math.round((dem("dung") / xong.length) * 100)}% đúng hoàn toàn).`);
  for (const m of xong.filter((x) => x.ketQua !== "dung")) dong.push(`  #${m.so} ${m.viec}: ${m.ketQua}. ${m.ghiChu}`);
  return dong;
}

if (process.argv[1]?.endsWith("du-doan.ts")) {
  const file = process.env.SO_DU_DOAN ?? "du-doan.jsonl";
  const [lenh, ...tham] = process.argv.slice(2);
  const cacMuc = existsSync(file) ? docSo(readFileSync(file, "utf8")) : [];
  if (lenh === "ghi") writeFileSync(file, ghiSo(ghi(cacMuc, tham[0] ?? "", tham[1] ?? "")));
  else if (lenh === "chot") writeFileSync(file, ghiSo(chot(cacMuc, Number(tham[0]), tham[1] as KetQua, tham[2])));
  else if (lenh === "tong-ket") for (const d of tongKet(cacMuc)) console.log(d);
  else throw new Error('Cách dùng: ghi "<việc>" "<dự đoán>" | chot <số> dung|sai|mot-phan "<ghi chú>" | tong-ket');
}
