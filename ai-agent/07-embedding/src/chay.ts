// RAG đầy đủ, bản tìm theo nghĩa: nhúng câu hỏi, lấy 3 đoạn gần nhất, ghép vào prompt, hỏi mô hình.
import { docChinhSach } from "./tach-doan.ts";
import { lapChiMuc, timTheoNghia } from "./tim-nghia.ts";
import { ghepCauHoi, traLoi } from "./tra-loi.ts";

const CAC_DOAN = docChinhSach();
const CAU_HOI = process.argv.slice(2).length ? [process.argv.slice(2).join(" ")] : [
  "Em hủy đơn chuyển khoản rồi, bao lâu thì tiền về?",
  "Ly cà phê pha sai, em muốn quán đền tiền",
];

const chiMuc = await lapChiMuc(CAC_DOAN);
for (const cau of CAU_HOI) {
  const ketQua = await timTheoNghia(cau, CAC_DOAN, chiMuc, 3);
  const duocChon = ketQua.map((kq) => kq.doan);
  console.log(`Khách: ${cau}`);
  console.log(`  gửi kèm: ${ketQua.map((kq) => `${kq.doan.tieuDe} (${kq.diem.toFixed(3)})`).join(" + ")}`);
  console.log(`  ${ghepCauHoi(cau, duocChon).length} ký tự`);
  if (process.env.IN_PROMPT) console.log(ghepCauHoi(cau, duocChon));
  console.log(`Mộc: ${await traLoi(cau, duocChon)}\n`);
}
