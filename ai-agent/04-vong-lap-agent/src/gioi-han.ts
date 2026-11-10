// Chạy câu hỏi cần 4 lần gọi mô hình, nhưng chỉ cho phép 2 lần, để xem agent dừng thế nào.
import { chayAgent } from "./agent.ts";

const cauHoi = "Em đặt sáng nay, sđt 0901000001. Nếu đơn chưa giao thì thêm giúp em một bạc xỉu nhé";
const kq = await chayAgent(cauHoi, 2);
console.log(`Khách: ${cauHoi}`);
for (const dong of kq.nhatKy) console.log(`  ${dong}`);
console.log(`Mộc:   ${kq.traLoi}`);
