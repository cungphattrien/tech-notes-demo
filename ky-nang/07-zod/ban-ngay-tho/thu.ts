// Gửi lần lượt các đơn "website" vào máy chủ bản đầu tiên, sau mỗi đơn đọc lại danh sách.
import type { AddressInfo } from "node:net";

import { loadOrders } from "../src/order-file.ts";
import { createOrderServer } from "./order-server.ts";

const server = createOrderServer(loadOrders(new URL("../data/orders.json", import.meta.url)));
await new Promise<void>((resolve) => server.listen(0, resolve));
const goc = `http://localhost:${(server.address() as AddressInfo).port}/don-hang`;

const khach = { name: "Phạm Dung", phone: "0901000010" };
const CAC_DON: [string, unknown][] = [
  ["đơn đúng", { customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: 2 }] }],
  ["số lượng là chữ", { customer: khach, items: [{ name: "Cà phê sữa", price: 29000, quantity: "hai" }] }],
  ["khách thiếu tên", { customer: { phone: "0901000011" }, items: [{ name: "Bạc xỉu", price: 32000, quantity: 1 }] }],
];

console.error = () => {}; // tắt dòng lỗi của máy chủ để kết quả gọn
for (const [ten, don] of CAC_DON) {
  const gui = await fetch(goc, { method: "POST", body: JSON.stringify(don) });
  const danhSach = await fetch(goc);
  const cuoi = (await danhSach.text()).split("\n").slice(-6).join(" ").replace(/\s+/g, " ");
  console.log(`${ten}: POST trả ${gui.status}; sau đó GET trả ${danhSach.status}${danhSach.ok ? ` ...${cuoi}` : ""}`);
}
server.close();
