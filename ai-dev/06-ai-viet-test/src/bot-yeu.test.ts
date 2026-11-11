// Bản test "trông đủ": mỗi tính năng một test, và tất cả đều xanh. Kiểu test hay gặp khi nhờ AI viết test
// mà không nói rõ cần bảo vệ điều gì.
import assert from "node:assert/strict";
import { test } from "node:test";

import { taoBotThu } from "./thu-bot.ts";

test("bot trả lời khi nhận tin nhắn ghi chi tiêu", async () => {
  const bot = taoBotThu();
  const traLoi = await bot.nhan(42, "cà phê 35k");
  assert.ok(traLoi);
  assert.ok(traLoi.includes("Đã ghi"));
});

test("/tong có trả lời", async () => {
  const bot = taoBotThu();
  await bot.nhan(42, "cà phê 35k");
  const traLoi = await bot.nhan(42, "/tong");
  assert.ok(traLoi);
  assert.ok(traLoi.includes("tổng"));
});

test("tin nhắn không hiểu được thì bot hướng dẫn", async () => {
  const bot = taoBotThu();
  const traLoi = await bot.nhan(42, "xin chào");
  assert.ok(traLoi?.includes("Mình chưa hiểu"));
});
