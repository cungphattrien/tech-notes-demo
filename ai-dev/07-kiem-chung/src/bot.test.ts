// Test cho bot.ts: mỗi test bảo vệ MỘT điều đã từng hỏng hoặc đã nằm trong SPEC.md, và nói rõ điều đó.
import assert from "node:assert/strict";
import { test } from "node:test";

import { taoBotThu } from "./thu-bot.ts";

test("mỗi người một cuốn sổ: /tong của người này không cộng khoản của người kia (lỗi bài 5)", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "cà phê 35k");
  await bot.nhan(77, "trà sữa 32k");
  assert.equal(await bot.nhan(42, "/tong"), "Tháng 12/2026: 1 khoản, tổng 35.000đ");
  assert.equal(await bot.nhan(77, "/tong"), "Tháng 12/2026: 1 khoản, tổng 32.000đ");
});

test("thời điểm Telegram gửi tính bằng giây: 6:30 sáng 1/12 giờ VN thuộc tháng 12 (lỗi bài 4)", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "trà sữa 32k", "2026-12-01T06:30");
  assert.equal(await bot.nhan(42, "/tong", "2026-12-01T06:31"), "Tháng 12/2026: 1 khoản, tổng 32.000đ");
});

test("tin nhắn ảnh, không có chữ, thì bot im lặng", async () => {
  const bot = taoBotThu();
  assert.equal(await bot.guiAnh(42), null);
});

test("sửa tin nhắn thì cập nhật đúng khoản chi đó, không ghi thêm", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "cà phê 35k"); // tin nhắn số 1
  assert.equal(await bot.sua(42, "cà phê 45k", 1), "Đã sửa: cà phê, 45.000đ");
  assert.equal(await bot.nhan(42, "/tong"), "Tháng 12/2026: 1 khoản, tổng 45.000đ");
});

test("sửa thành chữ không đọc được thì giữ nguyên khoản cũ", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "cà phê 35k");
  assert.equal(await bot.sua(42, "cà phê", 1), "Mình không đọc được khoản chi sau khi sửa, nên giữ nguyên khoản cũ.");
  assert.equal(await bot.nhan(42, "/tong"), "Tháng 12/2026: 1 khoản, tổng 35.000đ");
});

test("sửa một tin nhắn không phải khoản chi thì bot im lặng", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "/tong"); // tin nhắn số 1 là một lệnh, không tạo khoản chi
  assert.equal(await bot.sua(42, "/tong tháng này", 1), null);
});

test("sửa tin nhắn của mình không đụng tới sổ của người khác", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "cà phê 35k"); // tin nhắn số 1, của người 42
  assert.equal(await bot.sua(77, "cà phê 99k", 1), null); // người 77 "sửa" tin nhắn số 1: không có trong sổ của họ
  assert.equal(await bot.nhan(42, "/tong"), "Tháng 12/2026: 1 khoản, tổng 35.000đ");
});
