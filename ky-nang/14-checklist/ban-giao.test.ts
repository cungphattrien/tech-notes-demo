import assert from "node:assert/strict";
import { test } from "node:test";
import { taoBanGiao } from "./ban-giao.ts";

const kiem = [
  { cau: "Có CI?", muc: "thieu" as const, ghiChu: "Không thấy workflow." },
  { cau: "Có khóa trong code?", muc: "canh-bao" as const, ghiChu: "Có thể có khóa trong a.ts." },
  { cau: "Có test?", muc: "dat" as const, ghiChu: "Có." },
];

test("bản bàn giao có đủ năm mục theo thứ tự", () => {
  const md = taoBanGiao({ ten: "demo", scripts: { start: "node a.ts" }, commits: [], kiem });
  const tieuDe = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(tieuDe, ["Chạy dự án", "Việc gần đây", "Còn thiếu", "Cần để ý", "Phần máy không biết"]);
});

test("chỉ start và test có dạng ngắn, script khác phải có 'run'", () => {
  const md = taoBanGiao({ ten: "demo", scripts: { start: "a", test: "b", setup: "c" }, commits: [], kiem: [] });
  assert.match(md, /- `npm start`: a/);
  assert.match(md, /- `npm test`: b/);
  assert.match(md, /- `npm run setup`: c/);
  assert.doesNotMatch(md, /`npm setup`/);
});

test("câu thiếu vào mục 'Còn thiếu', cảnh báo vào 'Cần để ý', câu đạt không xuất hiện ở đâu cả", () => {
  const md = taoBanGiao({ ten: "demo", scripts: {}, commits: [], kiem });
  const [conThieu, canYY] = md.split(/^## /m).slice(3);
  assert.match(conThieu!, /Có CI\?/);
  assert.match(canYY!, /Có khóa trong code\?/);
  assert.doesNotMatch(md, /Có test\?/);
});

test("commit được liệt kê kèm ngày và mã; không có commit thì nói rõ là không đọc được", () => {
  const co = taoBanGiao({ ten: "d", scripts: {}, commits: [{ ma: "abc123", ngay: "2026-11-14", tieuDe: "tap 13: README" }], kiem: [] });
  assert.match(co, /- 2026-11-14 \(abc123\): tap 13: README/);
  assert.match(taoBanGiao({ ten: "d", scripts: {}, commits: [], kiem: [] }), /Không đọc được lịch sử Git/);
});

test("không có chỗ thiếu hay cảnh báo thì nói rõ thay vì để mục trống", () => {
  const md = taoBanGiao({ ten: "d", scripts: {}, commits: [], kiem: [] });
  assert.match(md, /Không thấy chỗ nào thiếu/);
  assert.match(md, /Không có cảnh báo/);
});

test("luôn nhắc rằng phần lý do quyết định và người liên hệ phải viết tay, và không bịa tên người", () => {
  const md = taoBanGiao({ ten: "d", scripts: {}, commits: [], kiem: [] });
  assert.match(md, /phải viết tay/);
  assert.doesNotMatch(md, /liên hệ:/i);
});
