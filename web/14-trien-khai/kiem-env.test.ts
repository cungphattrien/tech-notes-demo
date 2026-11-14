import assert from "node:assert/strict";
import { test } from "node:test";
import { phanTich } from "./kiem-env.ts";

const mau = "# ghi chú\nNEXT_PUBLIC_SITE_URL=\nSUPABASE_KEY=\n#CHUA_DUNG=abc\nDA_KHAI_BAO_THUA=\n";
const nguon = (noiDung: string) => [{ file: "src/a.ts", noiDung }];

test("biến code dùng mà .env.example không khai báo bị báo", () => {
  const kq = phanTich(nguon("const k = process.env.SUPABASE_KEY; const x = process.env.BIEN_QUEN_KHAI_BAO;"), mau);
  assert.deepEqual(kq.thieuTrongMau, ["BIEN_QUEN_KHAI_BAO"]);
});

test("cách viết env.TEN (tham số tên env) cũng được tính", () => {
  const kq = phanTich(nguon("const bank = env.DONATE_BANK;"), mau);
  assert.deepEqual(kq.thieuTrongMau, ["DONATE_BANK"]);
});

test("biến do nền tảng đặt sẵn (VERCEL_ENV, NODE_ENV, CI) không cần khai báo", () => {
  const kq = phanTich(nguon("process.env.VERCEL_ENV; process.env.NODE_ENV; process.env.CI; process.env.VERCEL_PROJECT_PRODUCTION_URL"), mau);
  assert.deepEqual(kq.thieuTrongMau, []);
});

test("dòng bị comment trong .env.example không được coi là khai báo", () => {
  const kq = phanTich(nguon("process.env.CHUA_DUNG"), mau);
  assert.deepEqual(kq.thieuTrongMau, ["CHUA_DUNG"]);
});

test("biến khai báo mà code không dùng được liệt kê riêng", () => {
  const kq = phanTich(nguon("process.env.SUPABASE_KEY; process.env.NEXT_PUBLIC_SITE_URL"), mau);
  assert.deepEqual(kq.khongThayTrongCode, ["DA_KHAI_BAO_THUA"]);
});

test("biến NEXT_PUBLIC_ được liệt kê là ghi cứng lúc build", () => {
  const kq = phanTich(nguon("process.env.NEXT_PUBLIC_SITE_URL; process.env.SUPABASE_KEY"), mau);
  assert.deepEqual(kq.congKhai, ["NEXT_PUBLIC_SITE_URL"]);
});

test("đọc biến bằng tên động bị chỉ rõ file và dòng", () => {
  const kq = phanTich([{ file: "src/b.ts", noiDung: "const a = 1;\nconst v = process.env[ten];" }], mau);
  assert.deepEqual(kq.docDong, [{ file: "src/b.ts", dong: 2 }]);
});

test("tên chữ thường hoặc quá ngắn không bị coi là biến môi trường", () => {
  const kq = phanTich(nguon("process.env.lowercase; process.env.AB; obj.env.SOMETHING_ELSE_X"), mau);
  assert.deepEqual(kq.thieuTrongMau, []);
});

test("giới hạn đã biết: biến nhắc trong chú thích vẫn bị tính là code dùng", () => {
  const kq = phanTich(nguon("// trước đây dùng process.env.BIEN_CU_TRONG_COMMENT"), mau);
  assert.deepEqual(kq.thieuTrongMau, ["BIEN_CU_TRONG_COMMENT"]);
});
