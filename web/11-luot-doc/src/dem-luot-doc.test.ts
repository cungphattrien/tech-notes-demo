import assert from "node:assert/strict";
import { test } from "node:test";

import { demLuotDoc } from "./dem-luot-doc.ts";
import type { MoTrang } from "./su-kien.ts";
import { sinhNgayTruyCap } from "./su-kien.ts";
import { isPostSlug, shouldCountView, totalsSince, vnToday } from "./views.ts";

const DA_DANG = ["git-co-ban", "zod"];
const trang = (thayDoi: Partial<MoTrang> = {}): MoTrang => ({
  loai: "mo-trang", nguoi: 1, tab: "t1", ip: "203.0.113.1", trinhDuyet: "Chrome/Windows", slug: "git-co-ban", giayOLai: 30, webdriver: false, trangThat: true, ...thayDoi,
});
const tong = (kq: ReturnType<typeof demLuotDoc>) => kq.bang.reduce((t, d) => t + d.views, 0);

test("slug: nhận chữ thường, số, gạch nối; từ chối chuỗi lạ", () => {
  for (const ok of ["git-co-ban", "a1"]) assert.equal(isPostSlug(ok), true);
  for (const sai of ["", "A", "../x", "a--b", 1, "x".repeat(121)]) assert.equal(isPostSlug(sai), false);
});

test("shouldCountView: bản xem thử, trình duyệt tự động và tab đã tính đều không được đếm", () => {
  assert.equal(shouldCountView({ enabled: true, webdriver: false, alreadyCounted: false }), true);
  assert.equal(shouldCountView({ enabled: false, webdriver: false, alreadyCounted: false }), false);
  assert.equal(shouldCountView({ enabled: true, webdriver: true, alreadyCounted: false }), false);
  assert.equal(shouldCountView({ enabled: true, webdriver: false, alreadyCounted: true }), false);
});

test("vnToday dùng ngày giờ Việt Nam, totalsSince cộng 30 ngày gần nhất và xếp nhiều nhất trước", () => {
  assert.equal(vnToday(new Date("2026-11-04T18:30:00Z")), "2026-11-05");
  const rows = [
    { slug: "a", day: "2026-11-04", views: 3 },
    { slug: "b", day: "2026-11-04", views: 5 },
    { slug: "a", day: "2026-10-06", views: 4 },
    { slug: "a", day: "2026-10-05", views: 100 },
  ];
  assert.deepEqual([...totalsSince(rows, "2026-11-04")], [["a", 7], ["b", 5]]);
});

test("tải lại trang trong cùng một tab chỉ tính một lần", () => {
  const kq = demLuotDoc([trang(), trang(), trang()], DA_DANG, "2026-11-18");
  assert.equal(tong(kq), 1);
});

test("rời trước 5 giây, trình duyệt tự động và bản xem thử không được tính", () => {
  const kq = demLuotDoc([trang({ giayOLai: 4 }), trang({ tab: "t2", webdriver: true }), trang({ tab: "t3", trangThat: false })], DA_DANG, "2026-11-18");
  assert.equal(tong(kq), 0);
  assert.equal(kq.soLenhGoi, 0); // bị chặn từ trình duyệt, máy chủ không nhận lệnh nào
});

test("lệnh gọi thẳng với slug bịa hoặc bài chưa đăng bị máy chủ chặn và không để lại dòng nào", () => {
  const kq = demLuotDoc([{ loai: "goi-truc", slug: "bai-khong-co" }, { loai: "goi-truc", slug: "../x" }, { loai: "goi-truc", slug: "bai-nhap" }], DA_DANG, "2026-11-18");
  assert.equal(kq.bang.length, 0);
  assert.equal(kq.soLenhGoi, 3);
});

test("bảng chỉ có slug, ngày và số lượt: không IP, không trình duyệt, không mã người đọc", () => {
  const kq = demLuotDoc(sinhNgayTruyCap(), ["git-co-ban", "debug-breakpoint", "viet-test-dau-tien", "zod-validation", "rag-la-gi", "seo-nextjs"], "2026-11-18");
  for (const dong of kq.bang) assert.deepEqual(Object.keys(dong).sort(), ["day", "slug", "views"]);
});

test("giới hạn đã biết: một người mở cùng bài ở hai tab thì bị đếm hai lần", () => {
  const kq = demLuotDoc([trang({ tab: "t1" }), trang({ tab: "t2" })], DA_DANG, "2026-11-18");
  assert.equal(tong(kq), 2);
});
