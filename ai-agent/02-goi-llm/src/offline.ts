// Chế độ offline: KHÔNG phải mô hình thật. Nó trả lời theo kịch bản để code chạy được khi chưa có key.
// Kịch bản cố ý bắt chước hai hành vi hay gặp ở LLM thật:
//   1. Có thông tin trong system prompt thì trả lời theo đó.
//   2. Không có thông tin, mà system prompt cũng không cho phép nói "chưa biết", thì đoán một câu nghe hợp lý.
// Muốn thấy câu trả lời thật, đặt ANTHROPIC_API_KEY rồi chạy lại.
import type { KetQua } from "./goi-llm.ts";

function dongCo(system: string, tuKhoa: RegExp): string | undefined {
  return system.split("\n").find((dong) => tuKhoa.test(dong));
}

export function traLoiOffline(system: string, cauHoi: string): KetQua {
  const q = cauHoi.toLowerCase();
  const choPhepChuaBiet = system.includes("chưa tra được đơn");
  let text: string;

  if (/đơn|đặt/.test(q) && /\d{4}|giao chưa|tới/.test(q)) {
    text = choPhepChuaBiet
      ? "Dạ Mộc chưa tra được đơn của bạn ở đây ạ. Bạn chờ chút, nhân viên của quán sẽ kiểm tra rồi nhắn lại ngay nhé!"
      : `Dạ đơn ${q.match(/\d{4}/)?.[0] ?? "của bạn"} đã được giao rồi ạ, bạn kiểm tra giúp Mộc nhé!`;
  } else if (/giờ|mở cửa/.test(q)) {
    text = dongCo(system, /mở cửa từ/) ?? "Dạ quán mở cửa từ 7:00 đến 21:00 ạ.";
  } else if (/ship|giao/.test(q)) {
    text = dongCo(system, /bán kính/) ?? "Dạ quán có giao hàng, phí ship tùy khoảng cách ạ.";
  } else if (/giá|bao nhiêu/.test(q)) {
    const mon = ["cà phê muối", "bạc xỉu", "cà phê sữa", "cà phê đen", "bánh mì trứng"].find((m) => q.includes(m));
    const dong = mon ? dongCo(system, new RegExp(`- ${mon}:`)) : undefined;
    text = dong ? `Dạ ${dong.slice(2)} ạ.` : `Dạ ${mon ?? "món này"} giá khoảng 30.000đ ạ.`;
  } else {
    text = choPhepChuaBiet ? "Dạ Mộc chưa có thông tin này ạ." : "Dạ Mộc cảm ơn bạn nhiều ạ!";
  }

  return { text, stopReason: "end_turn", inputTokens: 0, outputTokens: 0, offline: true };
}
