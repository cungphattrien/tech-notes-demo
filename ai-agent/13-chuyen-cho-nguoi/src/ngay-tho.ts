// Bản đầu của Mộc: không có trạng thái cuộc trò chuyện. Mỗi tin đi qua mô hình giả như mọi tin khác;
// chỉ khi khách nói thẳng muốn gặp người thì thêm một câu hẹn rồi... vẫn để agent trả lời tiếp ở tin sau.
import { moHinhGia } from "./mo-hinh-gia.ts";
import { quyetDinhNgayTho } from "./quyet-dinh.ts";

export function xuLyNgayTho(tin: string): string {
  if (quyetDinhNgayTho(tin)) return "Mộc sẽ nhờ nhân viên liên hệ bạn.";
  return moHinhGia(tin).noiDung;
}
