// In ra những gì được gửi cho mô hình khi khách hỏi về đơn 1041.
// Không cần key: chỉ dựng request, không gửi đi.
import { MODEL } from "./goi-llm.ts";
import { SYSTEM_V2 } from "./prompts.ts";

const request = {
  model: MODEL,
  max_tokens: 16000,
  system: SYSTEM_V2,
  messages: [{ role: "user", content: "Đơn 1041 của em giao chưa ạ?" }],
};

const json = JSON.stringify(request);
console.log(`Request dài ${json.length} ký tự, gồm: ${Object.keys(request).join(", ")}.`);
const maDon = SYSTEM_V2.match(/\b\d{4}\b/g) ?? [];
console.log(`System prompt có mã đơn hàng nào (số 4 chữ số) không? ${maDon.length ? maDon.join(", ") : "không"}`);
console.log(`Thông tin về đơn 1041 chỉ nằm ở: ${json.split("1041").length - 1} chỗ, là câu hỏi của khách.`);
