import assert from "node:assert/strict";
import { test } from "node:test";

import { chayCacPhepKiem, type PhepKiem } from "./kiem-may.ts";
import { demNgayLamViec, inBanDo, laNgayLamViec, ngayThuN } from "./moc-thoi-gian.ts";

test("ngày thứ N: ngày 1 là ngày bắt đầu, ngày 60 là ngày kết thúc thử việc", () => {
  assert.equal(ngayThuN("2026-12-01", 1), "2026-12-01");
  assert.equal(ngayThuN("2026-12-01", 31), "2026-12-31");
  assert.equal(ngayThuN("2026-12-01", 60), "2027-01-29");
});

test("thứ Bảy, Chủ nhật và 01/01 không phải ngày làm việc", () => {
  assert.equal(laNgayLamViec("2026-12-05"), false); // thứ Bảy
  assert.equal(laNgayLamViec("2026-12-06"), false); // Chủ nhật
  assert.equal(laNgayLamViec("2027-01-01"), false); // Tết Dương lịch, rơi vào thứ Sáu
  assert.equal(laNgayLamViec("2026-12-07"), true); // thứ Hai
});

test("60 ngày lịch từ 01/12/2026 chỉ có 43 ngày làm việc", () => {
  assert.equal(demNgayLamViec("2026-12-01", "2027-01-29"), 43);
});

test("một tuần đầy đủ (thứ Hai đến Chủ nhật) có 5 ngày làm việc", () => {
  assert.equal(demNgayLamViec("2026-12-07", "2026-12-13"), 5);
});

test("mốc rơi vào cuối tuần được đánh dấu để dời", () => {
  const dong = inBanDo("2026-12-01", "2027-01-29", [{ ngayThu: 5, viec: "thử" }]);
  assert.match(dong[0], /thứ Bảy/);
  assert.match(dong[0], /không phải ngày làm việc/);
});

test("chayCacPhepKiem gắn gợi ý cho mục chưa đạt và không ném lỗi khi một phép kiểm lỗi", () => {
  const cac: PhepKiem[] = [
    { ten: "đạt", kiem: () => true, goiY: "không dùng" },
    { ten: "không đạt", kiem: () => false, goiY: "làm cái này" },
  ];
  assert.deepEqual(chayCacPhepKiem(cac), [{ dau: "✓", ten: "đạt" }, { dau: "✗", ten: "không đạt", goiY: "làm cái này" }]);
});
