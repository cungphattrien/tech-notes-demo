// RAG đầy đủ: tìm đoạn, ghép vào prompt, hỏi mô hình. So với việc gửi cả tài liệu ở mỗi lần gọi.
import { docChinhSach } from "./tach-doan.ts";
import { ghepCauHoi, traLoi } from "./tra-loi.ts";
import { timDoan } from "./tim-doan.ts";

const CAC_DOAN = docChinhSach();
const CAU_HOI = process.argv.slice(2).length ? [process.argv.slice(2).join(" ")] : [
  "Đơn từ bao nhiêu tiền thì được miễn phí giao hàng?",
  "Em hủy đơn chuyển khoản rồi, bao lâu thì tiền về?",
];

const kyTuCaTaiLieu = ghepCauHoi("", CAC_DOAN).length;
for (const cau of CAU_HOI) {
  const duocChon = timDoan(cau, CAC_DOAN).map((kq) => kq.doan);
  console.log(`Khách: ${cau}`);
  console.log(`  gửi kèm: ${duocChon.map((d) => d.tieuDe).join(" + ")}`);
  console.log(`  ${ghepCauHoi(cau, duocChon).length} ký tự (gửi cả tài liệu: ${kyTuCaTaiLieu} ký tự)`);
  console.log(`Mộc: ${await traLoi(cau, duocChon)}\n`);
}
