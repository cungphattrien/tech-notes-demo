// Test cho mục "Lệnh /tong" và tính năng 3 của SPEC.md (v1.2).
import assert from "node:assert/strict";
import { test } from "node:test";

import { handleMessage, type Entry } from "./so-chi-tieu.ts";

// Thời điểm viết theo giờ Việt Nam (+07:00) cho dễ đọc.
const vn = (iso: string) => new Date(`${iso}+07:00`);

test("ghi ba khoản rồi /tong ra đúng tổng tháng", () => {
  const entries: Entry[] = [];
  handleMessage("cà phê 35k", vn("2026-11-03T08:00"), entries);
  handleMessage("cơm trưa 45.000", vn("2026-11-03T12:00"), entries);
  handleMessage("điện thoại 1tr2", vn("2026-11-04T20:00"), entries);
  assert.equal(handleMessage("/tong", vn("2026-11-05T09:00"), entries), "Tháng 11/2026: 3 khoản, tổng 1.280.000đ");
});

test("tháng chưa có khoản nào", () => {
  assert.equal(handleMessage("/tong", vn("2026-11-05T09:00"), []), "Tháng 11/2026 chưa có khoản chi nào.");
});

test("23:59 ngày 30/11 giờ VN vẫn thuộc tháng 11", () => {
  const entries: Entry[] = [];
  handleMessage("trà sữa 32k", vn("2026-11-30T23:59"), entries);
  assert.equal(handleMessage("/tong", vn("2026-11-30T23:59"), entries), "Tháng 11/2026: 1 khoản, tổng 32.000đ");
});

test("6:30 sáng 1/12 giờ VN (còn là 30/11 theo UTC) thuộc tháng 12", () => {
  const entries: Entry[] = [];
  handleMessage("trà sữa 32k", vn("2026-11-30T20:00"), entries);
  handleMessage("bánh mì 20 ngàn", vn("2026-12-01T06:30"), entries);
  assert.equal(handleMessage("/tong", vn("2026-12-01T07:00"), entries), "Tháng 12/2026: 1 khoản, tổng 20.000đ");
});

test("tin nhắn không hiểu thì không lưu gì", () => {
  const entries: Entry[] = [];
  const reply = handleMessage("cà phê", vn("2026-11-05T09:00"), entries);
  assert.match(reply, /chưa hiểu/);
  assert.equal(entries.length, 0);
});

test("lệnh kèm chữ phía sau không bị ghi thành khoản chi", () => {
  const entries: Entry[] = [];
  const reply = handleMessage("/tong tháng 10", vn("2026-11-05T09:00"), entries);
  assert.equal(reply, "Mình chưa có lệnh /tong. Nhắn /tong để xem tổng tháng này.");
  assert.equal(entries.length, 0);
});

test("/tổng (gõ có dấu) cũng là lệnh tổng", () => {
  const entries: Entry[] = [];
  handleMessage("cà phê 35k", vn("2026-11-03T08:00"), entries);
  assert.equal(handleMessage("/Tổng", vn("2026-11-05T09:00"), entries), "Tháng 11/2026: 1 khoản, tổng 35.000đ");
});
