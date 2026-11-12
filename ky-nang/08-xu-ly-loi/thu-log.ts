// Chạy máy chủ có log với một đơn dữ liệu hỏng, gửi ba request và in log lẫn câu trả lời. Chạy: node thu-log.ts
import type { AddressInfo } from "node:net";

import { DON_MAU } from "./src/don-mau.ts";
import { createOrderServer } from "./src/order-server.ts";
import type { Order } from "./src/orders.ts";

// Đơn 1050 có số điện thoại nhưng thiếu tên khách: dữ liệu hỏng đã nằm sẵn trong danh sách.
const donHong = { id: 1050, createdAt: "2026-11-04T09:00:00+07:00", source: "may-cu", customer: { phone: "0901000050" }, items: [{ name: "Trà đào", price: 35000, quantity: 1 }] } as unknown as Order;

const server = createOrderServer([...DON_MAU, donHong]);
await new Promise<void>((resolve) => server.listen(0, resolve));
const goc = `http://localhost:${(server.address() as AddressInfo).port}/don-hang`;
const khach = { name: "Phạm Dung", phone: "0901000010" };

const gui = async (ten: string, init?: RequestInit) => {
  const phanHoi = await fetch(goc, init);
  console.error(`→ ${ten}: ${phanHoi.status} ${(await phanHoi.text()).replace(/\s+/g, " ").slice(0, 110)}`);
};

await gui("POST đơn đúng", { method: "POST", body: JSON.stringify({ customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: 2 }] }) });
await gui("POST số lượng là chữ", { method: "POST", body: JSON.stringify({ customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: "hai" }] }) });
await gui("GET danh sách");
server.close();
