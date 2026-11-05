// Dữ liệu minh họa của quán Mộc và các "công cụ" mà chatbot / workflow / agent dùng chung.

export type OrderStatus = "dang-pha" | "dang-giao" | "da-giao";
export type Order = {
  id: number;
  phone: string;
  items: string[];
  status: OrderStatus;
  createdAt: string;
};

export const MENU: Record<string, number> = {
  "cà phê đen": 25000,
  "cà phê sữa": 29000,
  "bạc xỉu": 32000,
  "cà phê muối": 35000,
  "bánh mì trứng": 25000,
};

export const FAQ = {
  gioMoCua: "Mộc mở cửa từ 6:30 đến 22:00 mỗi ngày.",
  phiShip: "Mộc giao trong bán kính 5 km, phí 15.000đ; đơn từ 150.000đ được miễn phí.",
};

const orders: Order[] = [
  { id: 1041, phone: "0901000001", items: ["cà phê sữa", "bánh mì trứng"], status: "dang-pha", createdAt: "hôm nay 8:12" },
  { id: 1042, phone: "0901000002", items: ["bạc xỉu"], status: "dang-giao", createdAt: "hôm nay 9:40" },
];

const STATUS_TEXT: Record<OrderStatus, string> = {
  "dang-pha": "đang pha chế",
  "dang-giao": "đang giao",
  "da-giao": "đã giao",
};

// --- Công cụ ---------------------------------------------------------------

export function timDonTheoSdt(phone: string): Order | undefined {
  return orders.find((order) => order.phone === phone);
}

export function xemDon(id: number): string {
  const order = orders.find((item) => item.id === id);
  if (!order) return `Không có đơn ${id}.`;
  return `Đơn ${order.id} (${order.items.join(", ")}) đặt lúc ${order.createdAt}: ${STATUS_TEXT[order.status]}.`;
}

export function themMon(id: number, item: string): string {
  const order = orders.find((entry) => entry.id === id);
  if (!order) return `Không có đơn ${id}.`;
  if (order.status !== "dang-pha") return `Đơn ${id} đã ${STATUS_TEXT[order.status]}, không thêm món được.`;
  if (!(item in MENU)) return `Menu không có "${item}".`;
  order.items.push(item);
  return `Đã thêm ${item} vào đơn ${id}.`;
}

export function giaMon(item: string): string {
  const price = MENU[item];
  return price ? `${item}: ${price.toLocaleString("vi-VN")}đ` : `Menu không có "${item}".`;
}
