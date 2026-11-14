// Chạy: node --test kiem-claude-md.test.ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { TOI_DA_DONG, kiemTra, type NguCanh } from "./kiem-claude-md.ts";

const ngu: NguCanh = {
  scripts: ["test", "kiem-kieu"],
  tonTai: (duong) => ["src/phan-loai.ts", "docs/a.md"].includes(duong),
};

const loi = (noiDung: string) => kiemTra(noiDung, ngu).filter((v) => v.muc === "loi").map((v) => v.noiDung);
const canhBao = (noiDung: string) => kiemTra(noiDung, ngu).filter((v) => v.muc === "canh-bao");

test("lệnh npm run có trong package.json thì không lỗi", () => {
  assert.deepEqual(loi("- Kiểm tra kiểu: `npm run kiem-kieu`"), []);
});

test("npm run một script không tồn tại thì báo lỗi kèm tên script", () => {
  assert.deepEqual(loi("- Chạy bot: `npm run bot`"), ['Lệnh "npm run bot" không có trong package.json.']);
});

test("npm test và npm start được kiểm như script", () => {
  assert.deepEqual(loi("`npm test`"), []);
  assert.deepEqual(loi("`npm start`"), ['Lệnh "npm start" không có trong package.json.']);
});

test("đường dẫn có tồn tại thì không lỗi, không tồn tại thì báo lỗi", () => {
  assert.deepEqual(loi("Logic ở `src/phan-loai.ts`."), []);
  assert.deepEqual(loi("Logic ở `src/cu.ts`."), ['Đường dẫn "src/cu.ts" không tồn tại.']);
});

test("đường dẫn có ./ ở đầu được tính từ thư mục gốc", () => {
  assert.deepEqual(loi("Xem `./docs/a.md`."), []);
});

test("ví dụ import không bị coi là đường dẫn từ thư mục gốc", () => {
  assert.deepEqual(loi('Ví dụ: `import { x } from "./khong-co.ts"`.'), []);
});

test("thứ trong khối code không bị kiểm (đó là ví dụ, không phải chỉ dẫn)", () => {
  assert.deepEqual(loi("```bash\nnpm run khong-co\n```"), []);
});

test("câu mơ hồ bị cảnh báo, kèm số dòng", () => {
  const kq = canhBao("Dòng một\nViết code sạch nhé");
  assert.equal(kq.length, 1);
  assert.equal(kq[0].dong, 2);
});

test("file quá dài bị cảnh báo", () => {
  const dai = Array.from({ length: TOI_DA_DONG + 1 }, () => "- một dòng").join("\n");
  assert.equal(canhBao(dai).filter((v) => v.noiDung.startsWith("File dài")).length, 1);
});

test("CLAUDE.md của dự án này hợp lệ, còn CLAUDE-cu.md có đúng 4 lỗi", () => {
  const goi = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  const that: NguCanh = { scripts: Object.keys(goi.scripts), tonTai: existsSync };
  assert.deepEqual(kiemTra(readFileSync("CLAUDE.md", "utf8"), that), []);
  const cu = kiemTra(readFileSync("CLAUDE-cu.md", "utf8"), that);
  assert.equal(cu.filter((v) => v.muc === "loi").length, 4);
});
