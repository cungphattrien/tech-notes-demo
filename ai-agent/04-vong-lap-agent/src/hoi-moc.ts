import { chayAgent } from "./agent.ts";
import { coKey, MODEL } from "./goi-llm.ts";

const CAU_HOI = [
  "Quán mở cửa mấy giờ vậy ạ?",
  "Đơn 1041 của em giao chưa ạ?",
  "Đơn #1099 sao chưa thấy ạ",
  "Sáng nay em đặt mà chưa thấy ai gọi, sđt 0901000001",
  "Em đặt sáng nay, sđt 0901000001. Nếu đơn chưa giao thì thêm giúp em một bạc xỉu nhé",
  "Thêm giúp em một bánh mì trứng vào đơn 1042 nhé",
];

console.log(coKey() ? `Gọi Claude thật (${MODEL})\n` : "Chế độ OFFLINE (giả lập, không phải mô hình thật)\n");

for (const cauHoi of CAU_HOI) {
  const kq = await chayAgent(cauHoi);
  console.log(`Khách: ${cauHoi}`);
  for (const dong of kq.nhatKy) console.log(`  ${dong}`);
  console.log(`Mộc:   ${kq.traLoi}`);
  console.log(`       (${kq.soLanGoi} lần gọi mô hình)\n`);
}
