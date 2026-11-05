export type Customer = { name: string; phone: string };
export type OrderItem = { name: string; price: number; quantity: number };
export type Order = {
  id: number;
  createdAt: string;
  source: "web" | "may-cu";
  // Đơn từ máy bán hàng cũ (source "may-cu") bán tại quầy có thể không có khách hàng.
  customer?: Customer;
  items: OrderItem[];
};

// Dữ liệu đọc từ file, chưa kiểm tra. Máy bán hàng cũ ghi giá dạng chuỗi có dấu chấm ngăn hàng nghìn ("35.000").
export type RawOrder = Omit<Order, "items"> & {
  items: { name: string; price: number | string; quantity: number }[];
};

// "35.000" → 35000. Định dạng lạ thì báo lỗi ngay, không đoán.
export function parsePrice(raw: number | string): number {
  if (typeof raw === "number") return raw;
  const text = raw.trim();
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replaceAll(".", ""));
  if (/^\d+$/.test(text)) return Number(text);
  throw new Error(`Giá không hợp lệ: "${raw}"`);
}

export function normalizeOrder(raw: RawOrder): Order {
  return {
    ...raw,
    items: raw.items.map((item) => ({ ...item, price: parsePrice(item.price) })),
  };
}

export function customerLabel(order: Order): string {
  if (!order.customer) return "KHÁCH TẠI QUẦY";
  return order.customer.name.toUpperCase();
}

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function listOrders(orders: Order[]) {
  return orders.map((order) => ({
    id: order.id,
    khach: customerLabel(order),
    tong: orderTotal(order),
  }));
}
