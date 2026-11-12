import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

import { listOrders, normalizeOrder, orderTotal, parsePrice, type RawOrder } from "./orders.ts";

describe("parsePrice", () => {
  test.each([
    [35000, 35000], // đơn từ web: giá đã là số, giữ nguyên
    ["35.000", 35000], // máy cũ: dấu chấm ngăn hàng nghìn — đúng lỗi của đơn 1044
    ["1.250.000", 1250000], // nhiều nhóm nghìn
    [" 35.000 ", 35000], // máy cũ đôi khi thêm dấu cách
    ["35000", 35000], // chuỗi chỉ có chữ số
  ])("đọc %j thành %d", (raw, expected) => {
    expect(parsePrice(raw)).toBe(expected);
  });

  test.each([
    ["35,000"], // dấu phẩy: không biết là kiểu Mỹ (35 nghìn) hay kiểu châu Âu (35 phẩy 0)
    ["35.00"], // nhóm sau dấu chấm không đủ 3 chữ số: có thể là số thập phân
    ["35k"], // viết tắt: máy cũ không ghi kiểu này, gặp là bất thường
    [""], // ô giá bị bỏ trống
    [-25000], // giá âm: không món nào có giá âm
    [35.5], // số lẻ: tiền đồng không có phần thập phân
    [Number.NaN], // kết quả của một phép tính hỏng ở máy cũ
    [35], // "35.000" mất dấu ngoặc kép trong JSON thành số 35, nhỏ hơn MIN_PRICE
  ])("từ chối %j thay vì đoán", (raw) => {
    expect(() => parsePrice(raw)).toThrow("Giá không hợp lệ");
  });
});

describe("đơn 1044 (lỗi 70 đồng)", () => {
  // Đúng dữ liệu máy cũ đã gửi: giá là chuỗi "35.000".
  const don1044: RawOrder = {
    id: 1044,
    createdAt: "2026-11-03T10:30:00+07:00",
    source: "may-cu",
    customer: { name: "Lê Chi", phone: "0901000004" },
    items: [{ name: "Cà phê muối", price: "35.000", quantity: 2 }],
  };

  test("2 ly cà phê muối giá 35.000 là 70.000 đồng", () => {
    expect(orderTotal(normalizeOrder(don1044))).toBe(70000);
  });
});

describe("dữ liệu thật trong data/orders.json", () => {
  const rawOrders: RawOrder[] = JSON.parse(readFileSync(new URL("../data/orders.json", import.meta.url), "utf8"));

  test("tổng tiền của cả bốn đơn", () => {
    const totals = listOrders(rawOrders.map(normalizeOrder)).map(({ id, tong }) => ({ id, tong }));
    expect(totals).toEqual([
      { id: 1041, tong: 83000 }, // 2 cà phê sữa 29.000 + 1 bánh mì trứng 25.000
      { id: 1042, tong: 32000 },
      { id: 1043, tong: 25000 },
      { id: 1044, tong: 70000 },
    ]);
  });
});
