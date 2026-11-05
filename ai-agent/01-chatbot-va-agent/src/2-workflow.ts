// Cách 2: workflow — các bước cố định do lập trình viên viết sẵn: phân loại → xử lý theo nhánh.
// Ở đây giả sử bước phân loại luôn đúng (trường hợp tốt nhất; thực tế thường dùng LLM cho bước này).
import { messages, type Intent } from "./messages.ts";
import { FAQ, giaMon, MENU, timDonTheoSdt, xemDon } from "./shop.ts";

export function workflow(text: string, intent: Intent): string {
  switch (intent) {
    case "gio-mo-cua":
      return FAQ.gioMoCua;
    case "phi-ship":
      return FAQ.phiShip;
    case "gia-mon": {
      const item = Object.keys(MENU).find((name) => text.toLowerCase().includes(name));
      return item ? giaMon(item) : "Bạn muốn hỏi giá món nào ạ?";
    }
    case "tra-don": {
      const id = text.match(/\b(\d{4})\b/)?.[1];
      if (id) return xemDon(Number(id));
      const phone = text.match(/\b0\d{9}\b/)?.[0];
      const order = phone ? timDonTheoSdt(phone) : undefined;
      return order ? xemDon(order.id) : "Bạn cho Mộc xin mã đơn hoặc số điện thoại nhé.";
    }
    default:
      return "Mộc cảm ơn bạn! Bạn cần gì cứ nhắn nhé.";
  }
}

for (const message of messages) {
  console.log(`Khách: ${message.text}\nMộc:   ${workflow(message.text, message.intent)}\n`);
}

// Một tin nhắn không thuộc nhánh nào đã viết sẵn:
const hard = "Đơn của em sđt 0901000001 giao chưa, nếu chưa thì thêm 1 bánh mì trứng nhé";
console.log(`Khách: ${hard}\nMộc:   ${workflow(hard, "tra-don")}`);
console.log("       (chỉ trả lời được nửa đầu — nhánh 'tra-don' không biết thêm món)");
