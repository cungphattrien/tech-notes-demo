// Cho cùng một ghi chú đi qua bảy kiểu "mô hình" giả, xem câu trả lời thô và kết quả sau khi kiểm tra. Chạy: node thu-phan-loai.ts
import { moHinhGia, type KieuGia } from "./src/mo-hinh.ts";
import { HE_THONG, PhanLoai } from "./src/phan-loai.ts";

const KIEU: KieuGia[] = ["ngoan", "rao-code", "lan-man", "bia-nhan", "bi-dan-dat", "loi", "cham"];
const GHI_CHU = "cà phê";

for (const kieu of KIEU) {
  const phanLoai = new PhanLoai(moHinhGia(kieu), 300); // hạn chót 300 ms cho nhanh; app thật dùng 3.000 ms
  let tho = "(không có câu trả lời)";
  try {
    tho = await moHinhGia(kieu)({ heThong: HE_THONG, nguoiDung: GHI_CHU }, { signal: AbortSignal.timeout(300) });
  } catch {}
  const kq = await phanLoai.phanLoai(GHI_CHU);
  console.log(`${kieu.padEnd(10)} thô: ${JSON.stringify(tho).slice(0, 62).padEnd(62)} -> ${String(kq.danhMuc).padEnd(8)} (${kq.nguon})`);
}
