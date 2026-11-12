import { describe, expect, test } from "vitest";

import { listIssues, newOrderSchema } from "./order-schema.ts";

const customer = { name: "Phạm Dung", phone: "0901000010" };
const validItem = { name: "Cà phê sữa", price: 29000, quantity: 2 };

// Chạy schema và trả về danh sách lỗi dạng "trường: thông báo", để test đọc như đọc câu.
function errorsOf(input: unknown): string[] {
  const result = newOrderSchema.safeParse(input);
  return result.success ? [] : listIssues(result.error).map((issue) => `${issue.truong}: ${issue.loi}`);
}

describe("newOrderSchema", () => {
  test("nhận đơn đúng và giữ nguyên dữ liệu", () => {
    expect(newOrderSchema.parse({ customer, items: [validItem] })).toEqual({ customer, items: [validItem] });
  });

  test("giá dạng chuỗi của máy cũ được đổi thành số", () => {
    const order = newOrderSchema.parse({ customer, items: [{ ...validItem, price: "35.000" }] });
    expect(order.items[0].price).toBe(35000);
  });

  test("cắt khoảng trắng thừa ở tên khách", () => {
    expect(newOrderSchema.parse({ customer: { ...customer, name: "  An  " }, items: [validItem] }).customer.name).toBe("An");
  });

  test.each([
    ["số lượng là chữ", { customer, items: [{ ...validItem, quantity: "hai" }] }, "items.0.quantity: Số lượng phải là số"],
    ["số lượng lẻ", { customer, items: [{ ...validItem, quantity: 1.5 }] }, "items.0.quantity: Số lượng phải là số nguyên"],
    ["số lượng bằng 0", { customer, items: [{ ...validItem, quantity: 0 }] }, "items.0.quantity: Số lượng tối thiểu là 1"],
    ["giá 35 (mất ngoặc kép)", { customer, items: [{ ...validItem, price: 35 }] }, "items.0.price: Giá không hợp lệ: 35"],
    ["khách thiếu tên", { customer: { phone: "0901000010" }, items: [validItem] }, "customer.name: Tên khách phải là chữ"],
    ["số điện thoại ngắn", { customer: { ...customer, phone: "090100" }, items: [validItem] }, "customer.phone: Số điện thoại gồm 10 chữ số, bắt đầu bằng 0"],
    ["thiếu items", { customer }, "items: Danh sách món phải là một mảng"],
    ["items rỗng", { customer, items: [] }, "items: Đơn phải có ít nhất một món"],
    ["trường lạ id", { id: 1, customer, items: [validItem] }, "(cả đơn): Không nhận trường: id"],
    ["cả đơn không phải đối tượng", [], "(cả đơn): Phải là một đối tượng JSON"],
  ])("từ chối đơn có %s", (_ten, input, expectedError) => {
    expect(errorsOf(input)).toEqual([expectedError]);
  });

  test("báo cùng lúc mọi lỗi, không dừng ở lỗi đầu tiên", () => {
    const errors = errorsOf({ customer: { phone: "1" }, items: [{ ...validItem, quantity: 0 }] });
    expect(errors).toHaveLength(3);
  });
});
