// Tin nhắn mẫu (minh họa) kèm ý định đúng, để chấm điểm từng cách làm.

export type Intent = "gio-mo-cua" | "phi-ship" | "gia-mon" | "tra-don" | "khac";

export const messages: { text: string; intent: Intent }[] = [
  { text: "Quán mở cửa mấy giờ vậy ạ?", intent: "gio-mo-cua" },
  { text: "co ship qua quan 7 ko shop", intent: "phi-ship" },
  { text: "Giá cà phê muối bao nhiêu?", intent: "gia-mon" },
  { text: "Bạc xỉu bao nhiêu tiền 1 ly vậy", intent: "gia-mon" },
  { text: "Đơn 1041 của em giao chưa ạ?", intent: "tra-don" },
  { text: "Mấy giờ thì đơn 1042 tới nơi?", intent: "tra-don" },
  { text: "Sáng nay em đặt mà chưa thấy ai gọi, sđt 0901000001", intent: "tra-don" },
  { text: "Cảm ơn quán, cà phê ngon lắm!", intent: "khac" },
];
