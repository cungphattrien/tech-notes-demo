import type { Order } from "./orders.ts";

// Hai đơn có sẵn để thử máy chủ: một đơn từ website, một đơn tại quầy không có thông tin khách.
export const DON_MAU: Order[] = [
  {
    id: 1041,
    createdAt: "2026-11-03T08:12:00+07:00",
    source: "web",
    customer: { name: "Nguyễn An", phone: "0901000001" },
    items: [
      { name: "Cà phê sữa", price: 29000, quantity: 2 },
      { name: "Bánh mì trứng", price: 25000, quantity: 1 },
    ],
  },
  {
    id: 1043,
    createdAt: "2026-11-03T10:05:00+07:00",
    source: "may-cu",
    items: [{ name: "Cà phê đen", price: 25000, quantity: 1 }],
  },
];
