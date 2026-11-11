import type { AddressInfo } from "node:net";
import { expect, test } from "vitest";

import { createOrderServer } from "./order-server.ts";
import type { Order } from "./orders.ts";

// Dựng máy chủ với đúng những đơn cần cho từng test, mở ở một cổng trống, gửi một request rồi đóng.
async function get(orders: Order[], path: string): Promise<Response> {
  const server = createOrderServer(orders);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  try {
    return await fetch(`http://localhost:${(server.address() as AddressInfo).port}${path}`);
  } finally {
    server.close();
  }
}

const counterOrder: Order = {
  id: 2003,
  createdAt: "2026-11-13T08:10:00+07:00",
  source: "may-cu",
  items: [{ name: "Cà phê đen", price: 25000, quantity: 2 }],
};

test("không có đơn nào thì trả danh sách rỗng", async () => {
  const response = await get([], "/don-hang");
  expect(await response.json()).toEqual([]);
});

test("đơn tại quầy không có khách hàng vẫn hiện được", async () => {
  const response = await get([counterOrder], "/don-hang");
  expect(await response.json()).toEqual([{ id: 2003, khach: "KHÁCH TẠI QUẦY", tong: 50000 }]);
});

test("dữ liệu khách hàng hỏng thì trả 500, không làm sập máy chủ", async () => {
  // Khách hàng có số điện thoại nhưng thiếu tên: customerLabel gọi toUpperCase trên undefined.
  const brokenOrder = { ...counterOrder, customer: { phone: "0901000009" } } as unknown as Order;
  const response = await get([brokenOrder], "/don-hang");
  expect(response.status).toBe(500);
  expect(await response.text()).toBe("Lỗi máy chủ");
});
