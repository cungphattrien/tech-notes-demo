// Khách nhắn hai tin liên tiếp. Mỗi tin là một lần chayAgent mới, với mảng messages mới.
import { chayAgent } from "./agent.ts";

for (const tinNhan of ["Đơn 1041 của em giao chưa ạ?", "Vậy thêm cho em một bạc xỉu nữa nhé"]) {
  const kq = await chayAgent(tinNhan);
  console.log(`Khách: ${tinNhan}`);
  for (const dong of kq.nhatKy) console.log(`  ${dong}`);
  console.log(`Mộc:   ${kq.traLoi}\n`);
}
