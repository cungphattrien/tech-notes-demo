// Ba câu ví dụ để thấy embedding đo "giống nghĩa" thế nào. Không cần chính sách, không gọi mô hình ngôn ngữ.
import { doGiong, nhungCauHoi } from "./nhung.ts";

const CAU = [
  "Ly cà phê pha sai, em muốn quán đền tiền",
  "Quán hoàn tiền trong ba ngày làm việc",
  "Mã giảm giá không cộng dồn với tích điểm",
];

const vector = await Promise.all(CAU.map((cau) => nhungCauHoi(cau)));
console.log(`Mỗi câu thành một vector ${vector[0].length} số. Ba số đầu của câu 1: ${vector[0].slice(0, 3).map((x) => x.toFixed(4)).join(", ")}\n`);
for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
  console.log(`${doGiong(vector[a], vector[b]).toFixed(3)}  câu ${a + 1} so với câu ${b + 1}`);
}
