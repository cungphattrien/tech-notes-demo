// "Làm hỏng code có chủ đích" (mutation testing làm tay): sửa src/ban-tin.ts một chỗ nhỏ, chạy bộ test, xem có test nào đỏ không.
// Chạy: node lam-hong.ts src/ban-tin.so-khai.test.ts   hoặc   node lam-hong.ts src/ban-tin.test.ts
// Test đỏ = lỗi bị bắt (tốt). Test vẫn xanh = lỗi lọt qua bộ test đó.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/ban-tin.ts";
const GOC = readFileSync(FILE, "utf8");

const LOI: { mota: string; tim: string; thay: string }[] = [
  { mota: "bỏ .toLowerCase() khi chuẩn hóa email", tim: "value.trim().toLowerCase()", thay: "value.trim()" },
  { mota: "bỏ .trim() khi chuẩn hóa email", tim: "value.trim().toLowerCase()", thay: "value.toLowerCase()" },
  { mota: "email dài đúng 254 ký tự bị coi là sai (> thành >=)", tim: "email.length > MAX_EMAIL_LENGTH", thay: "email.length >= MAX_EMAIL_LENGTH" },
  { mota: "cho phép hai dấu @ trong email", tim: "/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/", thay: "/^[^\\s]+@[^@\\s]+\\.[^@\\s]+$/" },
  { mota: "ô bẫy chỉ có khoảng trắng bị coi là robot", tim: "if (honeypot.trim()) return true;", thay: "if (honeypot) return true;" },
  { mota: "đúng 1,5 giây bị coi là robot (< thành <=)", tim: "elapsed < MIN_FILL_MS", thay: "elapsed <= MIN_FILL_MS" },
  { mota: "đồng hồ lệch (mốc giờ ở tương lai) bị coi là robot", tim: "elapsed >= 0 && elapsed", thay: "elapsed" },
  { mota: "mốc giờ 0 hoặc âm không còn được bỏ qua", tim: "!Number.isFinite(started) || started <= 0", thay: "!Number.isFinite(started)" },
  { mota: "nguồn đăng ký không còn bị cắt ở 120 ký tự", tim: "value.slice(0, 120)", thay: "value" },
  { mota: "nguồn đăng ký nhận cả địa chỉ ngoài site (bỏ ^)", tim: "/^\\/[\\w\\-/]*$/", thay: "/\\/[\\w\\-/]*$/" },
];

const chay = (fileTest: string) =>
  spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", fileTest], { encoding: "utf8" });

const fileTest = process.argv[2];
if (!fileTest) throw new Error("Cần tên file test, ví dụ: node lam-hong.ts src/ban-tin.test.ts");

const goc = chay(fileTest);
if (goc.status !== 0) throw new Error("Bộ test phải xanh trên code gốc trước đã:\n" + goc.stdout);

let lot = 0;
try {
  for (const { mota, tim, thay } of LOI) {
    if (!GOC.includes(tim)) throw new Error(`Không thấy đoạn cần sửa: ${tim}`);
    writeFileSync(FILE, GOC.replace(tim, () => thay));
    const kq = chay(fileTest);
    const bat = kq.status !== 0;
    if (!bat) lot++;
    console.log(`${bat ? "bắt được " : "LỌT QUA  "} ${mota}`);
  }
} finally {
  writeFileSync(FILE, GOC); // luôn trả code về nguyên trạng
}
console.log(`\n${fileTest}: ${LOI.length - lot}/${LOI.length} lỗi bị bắt, ${lot} lọt qua.`);
