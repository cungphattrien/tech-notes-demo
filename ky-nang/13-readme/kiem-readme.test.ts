import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { kiemReadme } from "./kiem-readme.ts";
import { layLenh } from "./thu-readme.ts";

const scripts = { setup: "x", start: "x", test: "x" };
const goc = process.cwd();
const doc = (f: string) => readFileSync(f, "utf8");
const tatCaTonTai = () => true;
const MUC = "## Cần có\n## Chạy lần đầu\n## Chạy test\n## Cấu hình\n## Gặp lỗi?\n";

test("README.md của tập này không có vấn đề", () => {
  assert.deepEqual(kiemReadme(doc("README.md"), { goc, scripts }), []);
});

test("README cũ thiếu cả năm mục", () => {
  assert.equal(kiemReadme(doc("README-cu.md"), { goc, scripts }).filter((l) => l.startsWith("Thiếu mục")).length, 5);
});

test("README hết hạn: đường dẫn đã đổi tên và script không còn", () => {
  const loi = kiemReadme(doc("README-het-han.md"), { goc, scripts });
  assert.deepEqual(loi, ['Đường dẫn "src/cau-hinh.ts" không còn tồn tại.', 'Lệnh "npm run dev" nhưng package.json không có script "dev".']);
});

test("'process.env', '.ts' và '.env.example' không bị coi là đường dẫn", () => {
  assert.deepEqual(kiemReadme(MUC + "Dùng `process.env`, đuôi `.ts`, file `.env.example`.", { goc, scripts }, () => false), []);
});

test("npm install và npm ci không cần có trong scripts", () => {
  assert.deepEqual(kiemReadme(MUC + "```bash\nnpm install\nnpm ci\n```", { goc, scripts }), []);
});

test("đường dẫn trong khối code hoặc URL không bị kiểm", () => {
  assert.deepEqual(kiemReadme(MUC + "```bash\ncat src/khong-co.ts\n```\nXem `https://example.com/a/b`.", { goc, scripts }, () => false), []);
});

test("cùng một lỗi nhắc nhiều lần chỉ báo một lần", () => {
  const loi = kiemReadme(MUC + "`src/a.ts` và `src/a.ts`", { goc, scripts }, () => false);
  assert.equal(loi.length, 1);
});

test("layLenh lấy các lệnh npm trong khối bash, bỏ chú thích cuối dòng", () => {
  const md = "```bash\nnpm install\nnpm run setup    # tạo .env\ncurl localhost\n```\n```js\nnpm bo-qua\n```";
  assert.deepEqual(layLenh(md), ["npm install", "npm run setup"]);
});
