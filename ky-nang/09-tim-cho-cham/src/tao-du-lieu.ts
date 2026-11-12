// Sinh một danh sách đơn hàng lớn nhưng luôn giống nhau mỗi lần chạy (bộ sinh số ngẫu nhiên có hạt giống cố định).
import type { Order } from "./orders.ts";

// mulberry32: bộ sinh số ngẫu nhiên nhỏ, cùng hạt giống thì ra cùng dãy số.
function sinhSo(hat: number): () => number {
  let a = hat;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MON: [string, number][] = [["cà phê đen", 25000], ["cà phê sữa", 29000], ["bạc xỉu", 32000], ["cà phê muối", 35000], ["bánh mì trứng", 25000]];

export function taoDonHang(soDon: number, soKhach: number, hat = 42): Order[] {
  const ngauNhien = sinhSo(hat);
  return Array.from({ length: soDon }, (_, i) => {
    const coKhach = ngauNhien() < 0.9; // 10% là đơn tại quầy, không có thông tin khách
    const stt = Math.floor(ngauNhien() * soKhach);
    const soMon = 1 + Math.floor(ngauNhien() * 3);
    return {
      id: 10_000 + i,
      createdAt: new Date(Date.UTC(2026, 0, 1) + i * 600_000).toISOString(),
      source: coKhach ? "web" : "may-cu",
      ...(coKhach ? { customer: { name: `Khách ${stt}`, phone: `09${String(10_000_000 + stt).padStart(8, "0")}` } } : {}),
      items: Array.from({ length: soMon }, () => {
        const [name, price] = MON[Math.floor(ngauNhien() * MON.length)];
        return { name, price, quantity: 1 + Math.floor(ngauNhien() * 2) };
      }),
    } satisfies Order;
  });
}
