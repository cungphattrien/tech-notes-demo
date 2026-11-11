// Gửi các đơn hỏng vào máy chủ đã có Zod và in lỗi trả về. Chạy: node thu-zod.ts
import type { AddressInfo } from "node:net";

import { loadOrders } from "./src/order-file.ts";
import { createOrderServer } from "./src/order-server.ts";

const server = createOrderServer(loadOrders(new URL("./data/orders.json", import.meta.url)));
await new Promise<void>((resolve) => server.listen(0, resolve));
const goc = `http://localhost:${(server.address() as AddressInfo).port}/don-hang`;

const khach = { name: "Phạm Dung", phone: "0901000010" };
const CAC_DON: [string, string][] = [
  ["đơn đúng", JSON.stringify({ customer: khach, items: [{ name: "Cà phê sữa", price: "29.000", quantity: 2 }] })],
  ["số lượng là chữ", JSON.stringify({ customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: "hai" }] })],
  ["khách thiếu tên, giá 35", JSON.stringify({ customer: { phone: "0901000011" }, items: [{ name: "Bạc xỉu", price: 35, quantity: 1 }] })],
  ["thiếu items, thừa trường id", JSON.stringify({ id: 1, customer: khach })],
  ["không phải JSON", "{customer:"],
];

for (const [ten, noiDung] of CAC_DON) {
  const phanHoi = await fetch(goc, { method: "POST", body: noiDung });
  console.log(`${ten}: ${phanHoi.status} ${await phanHoi.text()}`);
}
console.log(`danh sách sau đó: ${(await fetch(goc)).status}`);
server.close();
