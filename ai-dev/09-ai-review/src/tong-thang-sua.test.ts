import assert from "node:assert/strict";
import { test } from "node:test";

import type { Khoan } from "./tong-thang.ts";
import { tongTheoThang } from "./tong-thang-sua.ts";

const khoan = (luc: string, soTien: number): Khoan => ({ luc, soTien, ghiChu: "x" });

test("ranh giới tháng theo giờ Việt Nam, bất kể máy chạy múi giờ nào", () => {
  // Chạy file này hai lần: TZ=UTC và TZ=Asia/Ho_Chi_Minh. Cả hai phải ra cùng kết quả.
  const cacKhoan = [
    khoan("2026-12-01T06:30:00+07:00", 29_000), // tháng 12 (23:30 ngày 30/11 theo UTC)
    khoan("2026-11-30T23:59:59+07:00", 10_000), // vẫn là tháng 11
    khoan("2026-12-31T23:59:59+07:00", 5_000), // vẫn là tháng 12
    khoan("2027-01-01T00:00:00+07:00", 7_000), // tháng 1 năm sau
  ];
  assert.equal(tongTheoThang(cacKhoan, "2026-12"), 34_000);
  assert.equal(tongTheoThang(cacKhoan, "2026-11"), 10_000);
  assert.equal(tongTheoThang(cacKhoan, "2027-01"), 7_000);
});

test("không đổi thứ tự mảng của người gọi", () => {
  const cacKhoan = [khoan("2026-12-02T10:00:00+07:00", 1), khoan("2026-12-01T10:00:00+07:00", 1)];
  const truoc = cacKhoan.map((k) => k.luc);
  tongTheoThang(cacKhoan, "2026-12");
  assert.deepEqual(cacKhoan.map((k) => k.luc), truoc);
});

test("tháng sai định dạng thì ném lỗi, tháng không có khoản nào thì trả 0", () => {
  for (const sai of ["2026-13", "2026-00", "2026-1", "12/2026", ""]) assert.throws(() => tongTheoThang([], sai), RangeError, sai);
  assert.equal(tongTheoThang([], "2026-12"), 0);
});
