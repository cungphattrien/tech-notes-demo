// Thử trường hợp anh Khoa nêu trong bình luận số 7: giá là SỐ nhưng không hợp lý.
// Chạy trong thư mục kho: node thu-gia-so.ts
import { normalizeOrder, orderTotal, parsePrice, type RawOrder } from "./src/orders.ts";

for (const gia of [-25000, 35.5, Number.NaN]) {
  try {
    console.log(`parsePrice(${gia}) →`, parsePrice(gia));
  } catch (error) {
    console.log(`parsePrice(${gia}) → LỖI ${(error as Error).message}`);
  }
}

// Máy cũ quên dấu ngoặc kép: "price": 35.000 trong JSON là số 35.
const don: RawOrder = JSON.parse('{"id":1050,"createdAt":"2026-11-04T08:00:00+07:00","source":"may-cu","items":[{"name":"Cà phê muối","price":35.000,"quantity":2}]}');
console.log("giá sau JSON.parse:", don.items[0].price);
try {
  console.log("tổng đơn 1050:", orderTotal(normalizeOrder(don)));
} catch (error) {
  console.log(`tổng đơn 1050: LỖI ${(error as Error).message}`);
}
