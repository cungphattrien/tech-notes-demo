// Test viết sai cách (để so sánh): kết quả mong đợi được tính lại bằng đúng logic đang cần kiểm tra.
// Test này xanh ngay cả khi lỗi "35.000" quay lại. Không dùng cách viết này.
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

import { orderTotal, type Order } from "../src/orders.ts";

const orders: Order[] = JSON.parse(readFileSync(new URL("../data/orders.json", import.meta.url), "utf8"));

test("tổng tiền đơn 1044", () => {
  const order = orders.find((o) => o.id === 1044)!;
  const expected = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  expect(orderTotal(order)).toBe(expected);
});
