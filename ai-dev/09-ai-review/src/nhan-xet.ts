// Mỗi nhận xét của người review (hoặc của AI) là một GIẢ THUYẾT. Ở đây mình biến từng nhận xét thành một phép thử chạy được.
// Danh sách nhận xét dưới đây là ví dụ minh họa do mình viết tay, mô phỏng một lần AI review đoạn code ở tong-thang.ts.
import { tongTheoThang, type Khoan } from "./tong-thang.ts";

export type NhanXet = {
  so: number;
  noiDung: string;
  // Hàm trả true nếu lỗi được mô tả có thật. undefined: nhận xét về cách viết, không kiểm được bằng chạy thử.
  kiem?: () => boolean;
};

// 6:30 sáng ngày 1/12/2026 giờ Việt Nam, tức 23:30 ngày 30/11 theo giờ UTC.
const SANG_MUNG_1_THANG_12: Khoan = { luc: "2026-12-01T06:30:00+07:00", soTien: 29_000, ghiChu: "cà phê" };

export const CAC_NHAN_XET: NhanXet[] = [
  {
    so: 1,
    noiDung: "getFullYear/getMonth lấy theo múi giờ của máy chạy code. Máy chủ chạy giờ UTC thì khoản 6:30 sáng 1/12 giờ Việt Nam bị tính vào tháng 11.",
    kiem: () => tongTheoThang([{ ...SANG_MUNG_1_THANG_12 }], "2026-12") === 0, // khoản này thuộc tháng 12: ra 0 nghĩa là bị tính sai tháng
  },
  {
    so: 2,
    noiDung: "cacKhoan.sort đổi thứ tự mảng của người gọi (sort sửa tại chỗ), nên một hàm chỉ để tính tổng lại có tác dụng phụ.",
    kiem: () => {
      const dauVao: Khoan[] = [{ luc: "2026-12-02T10:00:00+07:00", soTien: 1, ghiChu: "b" }, { luc: "2026-12-01T10:00:00+07:00", soTien: 1, ghiChu: "a" }];
      tongTheoThang(dauVao, "2026-12");
      return dauVao[0].ghiChu === "a";
    },
  },
  {
    so: 3,
    noiDung: 'Tháng không hợp lệ như "2026-13" sẽ làm hàm ném lỗi.',
    kiem: () => {
      try {
        tongTheoThang([{ ...SANG_MUNG_1_THANG_12 }], "2026-13");
        return false; // không ném lỗi: nhận xét sai
      } catch {
        return true;
      }
    },
  },
  {
    so: 4,
    noiDung: "Hàm sort không cần thiết: tổng không phụ thuộc thứ tự các khoản, nên có thể bỏ hẳn.",
    kiem: () => {
      const cacKhoan: Khoan[] = [{ luc: "2026-12-02T10:00:00+07:00", soTien: 5, ghiChu: "b" }, { luc: "2026-12-01T10:00:00+07:00", soTien: 7, ghiChu: "a" }];
      // Đảo thứ tự đầu vào mà tổng không đổi nghĩa là thứ tự không ảnh hưởng, tức sort thật sự thừa.
      return tongTheoThang([...cacKhoan], "2026-12") === tongTheoThang([...cacKhoan].reverse(), "2026-12");
    },
  },
  { so: 5, noiDung: "Biến `khoa` nên đặt tên rõ hơn, ví dụ `thangCuaKhoan`." },
];
