import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { chayKiem } from "./kiem.ts";

// Dự án giả chỉ có ba script với mã thoát tùy ý, để thử cách kiem.ts xử lý xanh/đỏ mà không chạy tsc hay test thật.
const duAn = (ma: { kieu: number; test: number; claude: number }) => {
  const d = mkdtempSync(join(tmpdir(), "kiem-"));
  const lenh = (m: number, noi: string) => `node -e "console.error('${noi}'); process.exit(${m})"`;
  writeFileSync(
    join(d, "package.json"),
    JSON.stringify({ scripts: { "kiem-kieu": lenh(ma.kieu, "error kieu"), test: lenh(ma.test, "not ok 1"), "kiem-claude-md": lenh(ma.claude, "error claude") } }),
  );
  return d;
};

test("cả ba xanh thì dat = true và có ba dòng ✓", () => {
  const { dat, dong } = chayKiem(false, duAn({ kieu: 0, test: 0, claude: 0 }));
  assert.equal(dat, true);
  assert.equal(dong.filter((d) => d.startsWith("✓")).length, 3);
});

test("mặc định dừng ở bước đầu tiên hỏng, không chạy các bước sau", () => {
  const { dat, dong } = chayKiem(false, duAn({ kieu: 1, test: 1, claude: 1 }));
  assert.equal(dat, false);
  assert.equal(dong.length, 1);
  assert.match(dong[0]!, /^✗ Kiểm kiểu/);
});

test("--het chạy đủ ba bước và báo từng bước hỏng", () => {
  const { dat, dong } = chayKiem(true, duAn({ kieu: 1, test: 0, claude: 1 }));
  assert.equal(dat, false);
  assert.deepEqual(dong.map((d) => d[0]), ["✗", "✓", "✗"]);
});

test("bước hỏng hiện dòng nói lỗi là gì, không chỉ phần cuối của output", () => {
  const { dong } = chayKiem(false, duAn({ kieu: 0, test: 1, claude: 0 }));
  assert.match(dong[1]!, /not ok 1/);
});
