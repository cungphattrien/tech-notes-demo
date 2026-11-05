import assert from "node:assert/strict";
import { test } from "node:test";

import { CAU_AN_TOAN, chanTrangThaiBia } from "./kiem-tra-bia.ts";

test("chặn câu khẳng định đơn đã giao", () => {
  assert.equal(chanTrangThaiBia("Dạ đơn 1041 đã được giao rồi ạ").text, CAU_AN_TOAN);
});

test("chặn câu nói đơn đang giao", () => {
  assert.equal(chanTrangThaiBia("Đơn của bạn đang giao, 10 phút nữa tới ạ").daChan, true);
});

test("giữ nguyên câu trả lời về giờ mở cửa", () => {
  const traLoi = "Mộc mở cửa từ 6:30 đến 22:00 mỗi ngày.";
  assert.deepEqual(chanTrangThaiBia(traLoi), { text: traLoi, daChan: false });
});

test("giữ nguyên câu trả lời về phí giao hàng", () => {
  assert.equal(chanTrangThaiBia("Mộc giao trong bán kính 5 km, phí 15.000đ.").daChan, false);
});
