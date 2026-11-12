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

// Menu của Mộc không có món nào dưới 1.000đ. Giá nhỏ hơn gần như chắc chắn là dữ liệu hỏng,
// ví dụ "35.000" bị mất dấu ngoặc kép trong JSON nên thành số 35.
export const MIN_PRICE = 1000;

// "35.000" → 35000. Định dạng lạ, hoặc giá không phải số nguyên từ MIN_PRICE trở lên, thì báo lỗi, không đoán.
export function parsePrice(raw: number | string): number {
  const price = typeof raw === "number" ? raw : parsePriceText(raw);
  if (!Number.isInteger(price) || price < MIN_PRICE) throw new Error(`Giá không hợp lệ: ${quoteIfText(raw)}`);
  return price;
}

function parsePriceText(raw: string): number {
  const text = raw.trim();
  // Nhóm nghìn bằng dấu chấm. Khớp: "35.000", "1.250.000". Không khớp: "35,000", "35.00", "3500.000".
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replaceAll(".", ""));
  if (/^\d+$/.test(text)) return Number(text);
  throw new Error(`Giá không hợp lệ: ${quoteIfText(raw)}`);
}

// Chuỗi trong ngoặc kép, số thì giữ nguyên, để thông báo lỗi phân biệt được "35" với 35.
const quoteIfText = (raw: number | string) => (typeof raw === "string" ? `"${raw}"` : String(raw));

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
  return orders.map((order) => {
    try {
      return { id: order.id, khach: customerLabel(order), tong: orderTotal(order) };
    } catch (error) {
      // Thêm ngữ cảnh (đơn nào) và giữ lỗi gốc trong cause, để log chỉ ra được đơn hỏng.
      throw new Error(`Không liệt kê được đơn ${order.id}`, { cause: error });
    }
  });
}
