// Bộ câu hỏi để chấm bộ tìm kiếm. `can` là những mục chính sách phải có mặt thì mới đủ thông tin trả lời.
export type CauHoiMau = { cau: string; can: string[] };

export const CAU_HOI_MAU: CauHoiMau[] = [
  { cau: "Đơn từ bao nhiêu tiền thì được miễn phí giao hàng?", can: ["Phí giao hàng"] },
  { cau: "Quán giao sai món thì được hoàn tiền bao lâu?", can: ["Đổi món khi giao sai hoặc pha sai", "Hoàn tiền"] },
  { cau: "Em hủy đơn chuyển khoản rồi, bao lâu thì tiền về?", can: ["Hủy đơn", "Hoàn tiền"] },
  { cau: "Ly cà phê pha sai, em muốn quán đền tiền", can: ["Đổi món khi giao sai hoặc pha sai"] },
  { cau: "Mình bị dị ứng sữa thì uống gì được?", can: ["Dị ứng và thành phần"] },
  { cau: "Tết quán có bán không?", can: ["Giờ mở cửa và ngày lễ"] },
  { cau: "Nhà em cách quán 8 cây số, quán có ship không?", can: ["Phí giao hàng"] },
  { cau: "Em mang bình giữ nhiệt tới thì có được bớt không?", can: ["Ly tự mang"] },
  { cau: "Điểm thưởng dùng được trong bao lâu?", can: ["Tích điểm"] },
  { cau: "Em muốn đặt 30 ly cho công ty thì làm sao?", can: ["Đặt số lượng lớn"] },
  { cau: "Quán có đưa số điện thoại của em cho ai khác không?", can: ["Bảo mật thông tin khách"] },
  { cau: "Mã giảm giá dùng chung với điểm tích lũy được không?", can: ["Khuyến mãi và mã giảm giá"] },
];
