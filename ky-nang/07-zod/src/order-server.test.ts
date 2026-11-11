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

// Gửi một request POST kèm nội dung bất kỳ, rồi đọc lại danh sách đơn để xem danh sách có bị ảnh hưởng không.
async function post(orders: Order[], body: string) {
  const server = createOrderServer(orders);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const root = `http://localhost:${(server.address() as AddressInfo).port}/don-hang`;
  try {
    const response = await fetch(root, { method: "POST", body });
    return { status: response.status, body: await response.json(), list: await (await fetch(root)).json() };
  } finally {
    server.close();
  }
}

const webBody = { customer: { name: "Phạm Dung", phone: "0901000010" }, items: [{ name: "Cà phê sữa", price: 29000, quantity: 2 }] };

test("POST đơn đúng: trả 201 và đơn xuất hiện trong danh sách với id kế tiếp", async () => {
  const result = await post([counterOrder], JSON.stringify(webBody));
  expect(result.status).toBe(201);
  expect(result.body).toEqual({ id: 2004 });
  expect(result.list).toEqual([
    { id: 2003, khach: "KHÁCH TẠI QUẦY", tong: 50000 },
    { id: 2004, khach: "PHẠM DUNG", tong: 58000 },
  ]);
});

test("POST đơn sai: trả 400 kèm lỗi theo từng trường, danh sách không đổi", async () => {
  const bad = { ...webBody, items: [{ name: "Cà phê sữa", price: 29000, quantity: "hai" }] };
  const result = await post([counterOrder], JSON.stringify(bad));
  expect(result.status).toBe(400);
  expect(result.body.chiTiet).toEqual([{ truong: "items.0.quantity", loi: "Số lượng phải là số" }]);
  expect(result.list).toEqual([{ id: 2003, khach: "KHÁCH TẠI QUẦY", tong: 50000 }]);
});

test("POST không phải JSON: trả 400", async () => {
  const result = await post([], "{customer:");
  expect(result.status).toBe(400);
  expect(result.body.loi).toBe("Nội dung gửi lên không phải JSON hợp lệ");
});

test("POST nội dung quá lớn: trả 413", async () => {
  const result = await post([], JSON.stringify({ ...webBody, ghiChu: "x".repeat(200_000) }));
  expect(result.status).toBe(413);
});
