import { orderTotal, type Order } from "./orders.ts";

export type DongBaoCao = { khach: string; soDon: number; tong: number };

// Báo cáo cho chủ quán: mỗi khách đã đặt mấy đơn và tổng bao nhiêu tiền, khách chi nhiều nhất đứng đầu.
// Dùng Map để tìm dòng của khách trong thời gian gần như không đổi, thay cho find phải duyệt từ đầu danh sách.
export function baoCaoTheoKhach(orders: Order[]): DongBaoCao[] {
  const theoKhach = new Map<string, DongBaoCao>();
  for (const order of orders) {
    const khach = order.customer?.phone ?? "tại quầy";
    const dong = theoKhach.get(khach);
    if (dong) {
      dong.soDon += 1;
      dong.tong += orderTotal(order);
    } else {
      theoKhach.set(khach, { khach, soDon: 1, tong: orderTotal(order) });
    }
  }
  return [...theoKhach.values()].sort((a, b) => b.tong - a.tong);
}
