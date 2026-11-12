import assert from "node:assert/strict";
import { test } from "node:test";

import { demNgay, kiemThuMoi, type ThuMoi } from "./kiem-offer.ts";
import { thucNhanUocTinh, tongNamDau } from "./so-sanh-offer.ts";

const thuMau: ThuMoi = {
  congTy: "A", viTri: "Junior", trinhDoYeuCau: "cao-dang-tro-len", luongChinhThucGross: 10_000_000,
  thuViec: { tu: "2026-12-01", den: "2027-01-29", phanTramLuong: 85 },
  luongDongBaoHiem: 10_000_000, thang13: 0, ngayXemXetLuong: "2027-06-01",
};

test("đếm cả ngày đầu lẫn ngày cuối", () => {
  assert.equal(demNgay("2026-12-01", "2026-12-01"), 1);
  assert.equal(demNgay("2026-12-01", "2027-01-31"), 62);
  assert.equal(demNgay("2026-12-01", "2027-01-29"), 60);
});

test("thử việc đúng 60 ngày và 85% thì không vi phạm luật", () => {
  assert.deepEqual(kiemThuMoi(thuMau).filter((muc) => muc.loai === "luat"), []);
});

test("thử việc 61 ngày hoặc lương thử việc 84% bị báo", () => {
  assert.equal(kiemThuMoi({ ...thuMau, thuViec: { ...thuMau.thuViec, den: "2027-01-30" } }).filter((m) => m.loai === "luat").length, 1);
  assert.equal(kiemThuMoi({ ...thuMau, thuViec: { ...thuMau.thuViec, phanTramLuong: 84 } }).filter((m) => m.loai === "luat").length, 1);
});

test("mục chưa ghi trong thư được liệt kê để hỏi lại", () => {
  const hoi = kiemThuMoi({ ...thuMau, luongDongBaoHiem: null, thang13: null }).filter((m) => m.loai === "hoi-lai");
  assert.equal(hoi.length, 2);
});

test("tổng năm đầu: 2 tháng thử việc 85% và 10 tháng đủ lương", () => {
  assert.equal(tongNamDau({ ten: "x", luongChinhThuc: 10_000_000, phanTramThuViec: 85, thangThuViec: 2 }), 117_000_000);
});

test("thực nhận trừ 10,5% bảo hiểm; lương quá cao thì từ chối tính", () => {
  assert.equal(thucNhanUocTinh(10_000_000), 8_950_000);
  assert.throws(() => thucNhanUocTinh(30_000_000), /ngoài phạm vi/);
});
