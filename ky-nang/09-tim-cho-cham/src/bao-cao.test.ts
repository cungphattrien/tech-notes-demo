import { describe, expect, test } from "vitest";

import { baoCaoTheoKhach } from "./bao-cao.ts";
import { baoCaoTheoKhachCu } from "./bao-cao-cu.ts";
import { taoDonHang } from "./tao-du-lieu.ts";
import type { Order } from "./orders.ts";

const don = (id: number, phone: string | undefined, gia: number): Order => ({
  id, createdAt: "2026-11-03T08:00:00+07:00", source: "web",
  ...(phone ? { customer: { name: "Khách", phone } } : {}),
  items: [{ name: "Cà phê", price: gia, quantity: 1 }],
});

describe("baoCaoTheoKhach", () => {
  test("gộp đơn theo số điện thoại, tổng tiền đúng, khách chi nhiều nhất đứng đầu", () => {
    const orders = [don(1, "0901", 25000), don(2, "0902", 70000), don(3, "0901", 25000)];
    expect(baoCaoTheoKhach(orders)).toEqual([
      { khach: "0902", soDon: 1, tong: 70000 },
      { khach: "0901", soDon: 2, tong: 50000 },
    ]);
  });

  test("đơn tại quầy (không có khách) gộp chung một dòng", () => {
    const orders = [don(1, undefined, 25000), don(2, undefined, 29000)];
    expect(baoCaoTheoKhach(orders)).toEqual([{ khach: "tại quầy", soDon: 2, tong: 54000 }]);
  });

  test("danh sách rỗng cho báo cáo rỗng", () => {
    expect(baoCaoTheoKhach([])).toEqual([]);
  });

  test("bản Map cho đúng kết quả của bản đầu trên 3.000 đơn (kể cả thứ tự khi bằng tiền)", () => {
    const orders = taoDonHang(3_000, 1_200);
    expect(baoCaoTheoKhach(orders)).toEqual(baoCaoTheoKhachCu(orders));
  });
});
