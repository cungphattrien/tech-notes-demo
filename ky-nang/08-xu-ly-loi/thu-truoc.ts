// Máy chủ của tập 7 (chưa có log) với cùng đơn hỏng 1050: xem nó để lại gì khi GET bị lỗi. Chạy: node thu-truoc.ts
import type { AddressInfo } from "node:net";

import { DON_MAU } from "./src/don-mau.ts";
import type { Order } from "./src/orders.ts";
import { createOrderServer } from "./ban-07/order-server.ts";

const donHong = { id: 1050, createdAt: "2026-11-04T09:00:00+07:00", source: "may-cu", customer: { phone: "0901000050" }, items: [{ name: "Trà đào", price: 35000, quantity: 1 }] } as unknown as Order;
const server = createOrderServer([...DON_MAU, donHong]);
await new Promise<void>((resolve) => server.listen(0, resolve));
const goc = `http://localhost:${(server.address() as AddressInfo).port}/don-hang`;
const khach = { name: "Phạm Dung", phone: "0901000010" };

const sai = await fetch(goc, { method: "POST", body: JSON.stringify({ customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: "hai" }] }) });
console.log(`POST đơn sai: ${sai.status}`);
const ds = await fetch(goc);
console.log(`GET danh sách: ${ds.status} ${await ds.text()}`);
server.close();
