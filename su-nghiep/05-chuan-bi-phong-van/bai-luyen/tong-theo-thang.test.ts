// Chạy: node bai-luyen/tong-theo-thang.test.ts   (Node.js 22.18+, không cần cài gì)
import assert from "node:assert/strict";
import { test } from "node:test";

import { tongTheoThang } from "./tong-theo-thang.ts";

test("danh sách rỗng thì không có tháng nào", () => {
  assert.deepEqual(tongTheoThang([]), []);
});

test("cộng các khoản cùng tháng, tháng mới nhất đứng trước", () => {
  const ketQua = tongTheoThang([
    { ngay: "2026-10-30", soTien: 50000 },
    { ngay: "2026-11-03", soTien: 35000 },
    { ngay: "2026-11-15", soTien: 32000 },
  ]);
  assert.deepEqual(ketQua, [
    { thang: "2026-11", tong: 67000 },
    { thang: "2026-10", tong: 50000 },
  ]);
});

test("tháng 12 năm trước đứng sau tháng 1 năm sau", () => {
  const ketQua = tongTheoThang([
    { ngay: "2025-12-31", soTien: 10000 },
    { ngay: "2026-01-01", soTien: 20000 },
  ]);
  assert.deepEqual(ketQua.map((dong) => dong.thang), ["2026-01", "2025-12"]);
});
