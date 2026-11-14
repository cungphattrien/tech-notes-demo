// Chạy dịch vụ thật trên máy bạn: node --env-file=.env chay.ts   (hoặc npm start)
// Nhận SIGTERM/SIGINT thì dừng êm. (Trên Windows, SIGTERM từ bên ngoài giết tiến trình ngay; Ctrl+C thì chạy đoạn dừng êm này.)
import { CauHinhLoi, docCauHinh, type CauHinh } from "./src/cau-hinh.ts";
import { NhatKy } from "./src/nhat-ky.ts";
import { taoMayChu } from "./src/may-chu.ts";
import { SoDo } from "./src/so-do.ts";
import { TongDai } from "./src/tong-dai.ts";

let cauHinh: CauHinh;
try {
  cauHinh = docCauHinh();
} catch (loi) {
  if (!(loi instanceof CauHinhLoi)) throw loi;
  console.error(loi.message);
  process.exit(1);
}

const nhatKy = new NhatKy();
const tongDai = new TongDai(nhatKy);
const { server, dung } = taoMayChu({ cauHinh, tongDai, soDo: new SoDo(), nhatKy });

server.listen(cauHinh.PORT, () => console.log(`Dịch vụ nghe ở cổng ${cauHinh.PORT}${cauHinh.AGENT_TAT ? " (AGENT ĐANG TẮT, chuyển thẳng cho người)" : ""}`));

for (const tinHieu of ["SIGTERM", "SIGINT"] as const) {
  process.on(tinHieu, () => {
    console.log(`Nhận ${tinHieu}, dừng êm...`);
    dung().then(() => process.exit(0), () => process.exit(1));
  });
}
