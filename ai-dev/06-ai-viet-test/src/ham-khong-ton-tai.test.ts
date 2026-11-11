// Một dòng nghe rất hợp lý, nhưng grammY 1.46.0 không có hàm processUpdate.
import assert from "node:assert/strict";
import { test } from "node:test";

import { taoBotThu } from "./thu-bot.ts";

test("bot nhận một update và trả lời", async () => {
  const thu = taoBotThu();
  const update = { update_id: 1, message: { message_id: 1, date: 1796000000, chat: { id: 42, type: "private" }, from: { id: 42, is_bot: false, first_name: "A" }, text: "cà phê 35k" } };
  await thu.bot.processUpdate(update);
  assert.ok(thu.daGui.length > 0);
});
