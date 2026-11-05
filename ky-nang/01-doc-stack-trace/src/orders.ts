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
