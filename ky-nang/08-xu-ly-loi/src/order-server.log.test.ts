import type { AddressInfo } from "node:net";
import { expect, test } from "vitest";

import { createLogger } from "./logger.ts";
import { createOrderServer } from "./order-server.ts";
import type { Order } from "./orders.ts";

// Chạy máy chủ với logger ghi vào mảng, gửi một request, trả về câu trả lời và các dòng log đã parse.
async function call(orders: Order[], path: string, init?: RequestInit) {
  const lines: Record<string, unknown>[] = [];
  const server = createOrderServer(orders, createLogger((line) => lines.push(JSON.parse(line))));
  await new Promise<void>((resolve) => server.listen(0, resolve));
  try {
    const response = await fetch(`http://localhost:${(server.address() as AddressInfo).port}${path}`, init);
    const body = await response.text();
    await new Promise((resolve) => setTimeout(resolve, 20)); // chờ dòng "request" ghi xong
    return { status: response.status, body, lines };
  } finally {
    server.close();
  }
}

const brokenOrder = { id: 7, createdAt: "2026-11-04T09:00:00+07:00", source: "may-cu", customer: { phone: "0901000050" }, items: [] } as unknown as Order;

test("đơn bị từ chối: log warn ghi tên trường, không ghi số điện thoại khách", async () => {
  const body = JSON.stringify({ customer: { name: "An", phone: "0901234567" }, items: [{ name: "Cà phê", price: 29000, quantity: "hai" }] });
  const { lines } = await call([], "/don-hang", { method: "POST", body });
  const rejected = lines.find((line) => line.msg === "từ chối đơn");
  expect(rejected).toMatchObject({ level: "warn", chiTiet: [{ truong: "items.0.quantity" }] });
  expect(JSON.stringify(lines)).not.toContain("0901234567");
});

test("lỗi 500: câu trả lời và log dùng chung một requestId, log có lỗi gốc", async () => {
  const { status, body, lines } = await call([brokenOrder], "/don-hang");
  const { maLoi } = JSON.parse(body);
  const logged = lines.find((line) => line.msg === "lỗi không lường trước") as { requestId: string; error: { message: string; cause: { name: string } } };
  expect(status).toBe(500);
  expect(logged.requestId).toBe(maLoi);
  expect(logged.error.message).toBe("Không liệt kê được đơn 7");
  expect(logged.error.cause.name).toBe("TypeError");
  expect(body).not.toContain("toUpperCase"); // người gọi không thấy chi tiết nội bộ
});

test("mọi request có đúng một dòng tóm tắt với status và ms", async () => {
  const { lines } = await call([], "/don-hang");
  const summary = lines.filter((line) => line.msg === "request");
  expect(summary).toHaveLength(1);
  expect(summary[0]).toMatchObject({ level: "info", status: 200, method: "GET", path: "/don-hang" });
  expect(typeof summary[0].ms).toBe("number");
});
