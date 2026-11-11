// Chạy: node bai-luyen/top-ghi-chu.test.ts   (Node.js 22.18+, không cần cài gì)
import assert from "node:assert/strict";
import { test } from "node:test";

import { topGhiChu } from "./top-ghi-chu.ts";

test("ví dụ của người phỏng vấn", () => {
  const ketQua = topGhiChu(["cà phê", "Cà phê ", "cơm trưa", "cà phê", "bún bò", "cơm trưa", "  "]);
  assert.deepEqual(ketQua, [
    { ghiChu: "cà phê", soLan: 3 },
    { ghiChu: "cơm trưa", soLan: 2 },
    { ghiChu: "bún bò", soLan: 1 },
  ]);
});

test("danh sách rỗng thì kết quả rỗng", () => {
  assert.deepEqual(topGhiChu([]), []);
});

test("ghi chú trống hoặc chỉ có dấu cách bị bỏ qua", () => {
  assert.deepEqual(topGhiChu(["", "   "]), []);
});

test("số lần bằng nhau thì ghi chú xuất hiện trước đứng trước", () => {
  assert.deepEqual(topGhiChu(["trà sữa", "cà phê", "cà phê", "trà sữa"]).map((d) => d.ghiChu), ["trà sữa", "cà phê"]);
});

test("ít hơn 3 ghi chú khác nhau thì trả đúng số đó", () => {
  assert.equal(topGhiChu(["cà phê", "cà phê"]).length, 1);
});

test("dấu tiếng Việt gõ dạng tổ hợp (NFD) vẫn là cùng một ghi chú", () => {
  const nfd = "cà phê".normalize("NFD");
  assert.deepEqual(topGhiChu([nfd, "cà phê"]), [{ ghiChu: "cà phê", soLan: 2 }]);
});

test("có hơn 3 ghi chú khác nhau thì chỉ lấy 3", () => {
  assert.equal(topGhiChu(["a", "b", "c", "d"]).length, 3);
});
