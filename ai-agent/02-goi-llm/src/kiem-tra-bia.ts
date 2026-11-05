// Lớp kiểm tra cuối: chatbot không xem được đơn hàng, nên mọi câu khẳng định trạng thái đơn đều là đoán.
const KHANG_DINH_TRANG_THAI = /đã (được )?giao|đang giao|đang pha|giao xong/i;

export const CAU_AN_TOAN =
  "Dạ Mộc chưa tra được đơn của bạn ở đây ạ. Nhân viên của quán sẽ kiểm tra rồi nhắn lại cho bạn nhé!";

export function chanTrangThaiBia(traLoi: string): { text: string; daChan: boolean } {
  if (KHANG_DINH_TRANG_THAI.test(traLoi)) return { text: CAU_AN_TOAN, daChan: true };
  return { text: traLoi, daChan: false };
}
