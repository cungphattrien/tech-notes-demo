import assert from "node:assert/strict";
import { test } from "node:test";
import { kiemDuAn, type DuAn, type Muc } from "./kiem-du-an.ts";

const tep = (duong: string, noiDung = "") => ({ duong, noiDung, byte: noiDung.length });
const duAn = (...files: ReturnType<typeof tep>[]): DuAn => ({ files });
const muc = (kq: ReturnType<typeof kiemDuAn>, cau: string): Muc => kq.find((k) => k.cau.startsWith(cau))!.muc;

const PKG_DAY_DU = JSON.stringify({ scripts: { start: "node a.ts", test: "node --test" }, engines: { node: ">=22" }, dependencies: { zod: "1" } });
const README_TOT = "# A\n\n```bash\nnpm install\nnpm start\n```\n";

test("dự án đầy đủ: mọi câu áp dụng đều đạt", () => {
  const kq = kiemDuAn(
    duAn(
      tep("README.md", README_TOT),
      tep("package.json", PKG_DAY_DU),
      tep("package-lock.json", "{}"),
      tep("a.test.ts", "// test"),
      tep("a.ts", "const k = process.env.PORT;"),
      tep(".env.example", "PORT=3000"),
      tep(".gitignore", ".env\nnode_modules/\n"),
      tep(".github/workflows/ci.yml", "name: CI"),
    ),
  );
  assert.deepEqual(kq.filter((k) => k.muc !== "dat"), []);
  assert.equal(kq.length, 11);
});

test("thư mục gần như trống: thiếu README, lệnh chạy, test, Node, CI", () => {
  const kq = kiemDuAn(duAn(tep("a.ts", "console.log(1)")));
  assert.equal(muc(kq, "README"), "thieu");
  assert.equal(muc(kq, "Có một lệnh chạy"), "thieu");
  assert.equal(muc(kq, "Có test"), "thieu");
  assert.equal(muc(kq, "Ghi rõ phiên bản Node"), "thieu");
  assert.equal(muc(kq, "Có CI"), "thieu");
  assert.equal(muc(kq, "Có lockfile"), "khong-ap-dung");
});

test("README có mà không có khối lệnh thì vẫn bị coi là thiếu cách chạy", () => {
  assert.equal(muc(kiemDuAn(duAn(tep("README.md", "# Tên\nDự án của quán Mộc."))), "README"), "thieu");
});

test("script test có nhưng không có file test (hoặc ngược lại) thì thiếu", () => {
  assert.equal(muc(kiemDuAn(duAn(tep("package.json", PKG_DAY_DU))), "Có test"), "thieu");
  assert.equal(muc(kiemDuAn(duAn(tep("a.test.ts"))), "Có test"), "thieu");
});

test("phiên bản Node lấy được từ .node-version hoặc .nvmrc", () => {
  assert.equal(muc(kiemDuAn(duAn(tep(".node-version", "22.20.0\n"))), "Ghi rõ phiên bản Node"), "dat");
  assert.equal(muc(kiemDuAn(duAn(tep(".nvmrc", "v22"))), "Ghi rõ phiên bản Node"), "dat");
});

test("có thư viện ngoài mà không có lockfile thì thiếu", () => {
  assert.equal(muc(kiemDuAn(duAn(tep("package.json", PKG_DAY_DU))), "Có lockfile"), "thieu");
});

test("code đọc process.env (kể cả đọc nguyên đối tượng) mà không có .env.example thì thiếu", () => {
  assert.equal(muc(kiemDuAn(duAn(tep("a.ts", "export function f(env = process.env) {}"))), "Biến môi trường"), "thieu");
  assert.equal(muc(kiemDuAn(duAn(tep("a.ts", "const x = process.env.A;"), tep(".env.example"))), "Biến môi trường"), "dat");
});

test("file test chỉ nhắc process.env thì không tính là dự án dùng biến môi trường", () => {
  assert.equal(muc(kiemDuAn(duAn(tep("a.test.ts", "process.env.X = '1'"))), "Biến môi trường"), "khong-ap-dung");
});

test(".gitignore thiếu .env hoặc node_modules thì thiếu và nói rõ thiếu gì", () => {
  const kq = kiemDuAn(duAn(tep("package.json", PKG_DAY_DU), tep("a.ts", "process.env.A"), tep(".gitignore", "dist/\n")));
  const k = kq.find((x) => x.cau.startsWith(".gitignore"))!;
  assert.equal(k.muc, "thieu");
  assert.match(k.ghiChu, /\.env, node_modules/);
});

test("khóa nằm trong code bị cảnh báo kèm tên file; file .env.example và file test thì bỏ qua", () => {
  const khoa = 'const k = "sk-abcdefghijklmnopqrstuvwxyz123456";';
  const kq = kiemDuAn(duAn(tep("src/a.ts", khoa), tep(".env.example", khoa), tep("a.test.ts", khoa)));
  const k = kq.find((x) => x.cau.startsWith("Có khóa"))!;
  assert.equal(k.muc, "canh-bao");
  assert.match(k.ghiChu, /src\/a\.ts/);
  assert.doesNotMatch(k.ghiChu, /example|test/);
});

test("đếm TODO và FIXME trong code, kèm file và dòng; chữ 'todo' trong chuỗi không tính", () => {
  const kq = kiemDuAn(duAn(tep("a.ts", "const a = 1;\n// TODO: sửa\nconst todo = 'TODO';\n/* FIXME x */")));
  const k = kq.find((x) => x.cau.startsWith("Có bao nhiêu TODO"))!;
  assert.equal(k.muc, "canh-bao");
  assert.match(k.ghiChu, /2 chỗ.*a\.ts:2, a\.ts:4/);
});

test("file trên 1 MB bị cảnh báo", () => {
  const kq = kiemDuAn(duAn({ duong: "du-lieu/lon.json", noiDung: "", byte: 2_000_000 }));
  assert.equal(muc(kq, "Có file nào lớn"), "canh-bao");
});

test("giới hạn đã biết: mẫu khóa chỉ là vài dạng quen thuộc, một khóa dạng lạ vẫn lọt", () => {
  const kq = kiemDuAn(duAn(tep("a.ts", 'const token = "ghp_ThisIsAGithubTokenLookingString1234";')));
  assert.equal(muc(kq, "Có khóa"), "dat");
});
