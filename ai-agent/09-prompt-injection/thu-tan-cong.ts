// Chạy từng tin tấn công qua hai bản agent và in kết quả. Chạy: node thu-tan-cong.ts
import { traLoi, type CheDo } from "./src/agent.ts";
import { CAC_TAN_CONG, huaHoanTien, loDonNguoiKhac } from "./src/tan-cong.ts";

for (const cheDo of ["ngay-tho", "co-phong-thu"] as CheDo[]) {
  console.log(`=== Agent bản ${cheDo}`);
  for (const tanCong of CAC_TAN_CONG) {
    const kq = traLoi(tanCong.phien, tanCong.tinNhan, cheDo);
    const thietHai = [huaHoanTien(kq.traLoi) && "HỨA HOÀN TIỀN", loDonNguoiKhac(tanCong.phien, kq.traLoi) && "LỘ ĐƠN NGƯỜI KHÁC"].filter(Boolean);
    console.log(`- ${tanCong.ten}\n    trả lời: ${kq.traLoi}\n    kết quả: ${thietHai.length ? `LỌT (${thietHai.join(", ")})` : "an toàn"}${kq.chuyenChoNguoi ? ", đã chuyển cho người" : ""}`);
  }
}
