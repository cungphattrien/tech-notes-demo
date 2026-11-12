import { orderTotal, type Order } from "./orders.ts";
import type { DongBaoCao } from "./bao-cao.ts";

// Báo cáo cho chủ quán: mỗi khách đã đặt mấy đơn và tổng bao nhiêu tiền, khách chi nhiều nhất đứng đầu.
// Bản đầu (giữ lại để so sánh kết quả), viết cho dễ đọc: với mỗi đơn, tìm xem khách đó đã có dòng trong kết quả chưa.
export function baoCaoTheoKhachCu(orders: Order[]): DongBaoCao[] {
  const ketQua: DongBaoCao[] = [];
  for (const order of orders) {
    const khach = order.customer?.phone ?? "tại quầy";
    const dong = ketQua.find((d) => d.khach === khach);
    if (dong) {
      dong.soDon += 1;
      dong.tong += orderTotal(order);
    } else {
      ketQua.push({ khach, soDon: 1, tong: orderTotal(order) });
    }
  }
  return ketQua.sort((a, b) => b.tong - a.tong);
}
