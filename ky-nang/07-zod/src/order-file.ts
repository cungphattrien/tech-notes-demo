import { readFileSync } from "node:fs";

import { normalizeOrder, type Order, type RawOrder } from "./orders.ts";

// Đọc file đơn hàng và chuẩn hóa ngay: từ đây trở đi, giá luôn là số.
// Một giá sai làm cả hàm ném lỗi, nên máy chủ dừng thay vì bỏ qua đơn.
export function loadOrders(file: URL): Order[] {
  const ordersInFile: RawOrder[] = JSON.parse(readFileSync(file, "utf8"));
  return ordersInFile.map(normalizeOrder);
}
