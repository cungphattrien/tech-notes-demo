import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "vitest";

import { loadOrders } from "./order-file.ts";

// Ghi một file đơn hàng tạm, để thử loadOrders với dữ liệu bất kỳ mà không đụng data/orders.json.
function tempOrdersFile(orders: unknown): URL {
  const file = join(mkdtempSync(join(tmpdir(), "don-hang-")), "orders.json");
  writeFileSync(file, JSON.stringify(orders));
  return pathToFileURL(file);
}

test("đọc file và đổi giá dạng chuỗi thành số", () => {
  const file = tempOrdersFile([
    { id: 2001, createdAt: "2026-11-13T08:00:00+07:00", source: "may-cu", items: [{ name: "Bạc xỉu", price: "32.000", quantity: 1 }] },
  ]);
  expect(loadOrders(file)[0].items[0].price).toBe(32000);
});

test("một giá sai làm cả file bị từ chối, máy chủ không khởi động với dữ liệu hỏng", () => {
  const file = tempOrdersFile([
    { id: 2002, createdAt: "2026-11-13T08:05:00+07:00", source: "may-cu", items: [{ name: "Cà phê muối", price: 35, quantity: 2 }] },
  ]);
  expect(() => loadOrders(file)).toThrow("Giá không hợp lệ: 35");
});
