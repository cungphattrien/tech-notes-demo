// Ba đơn hàng minh họa của quán Mộc; soDienThoai là của chủ đơn.
export const DON_HANG = [
  { maDon: "1041", soDienThoai: "0901000001", mon: ["cà phê sữa", "bánh mì trứng"], trangThai: "đang pha chế" },
  { maDon: "1042", soDienThoai: "0901000002", mon: ["bạc xỉu"], trangThai: "đang giao" },
  { maDon: "1043", soDienThoai: "0901000003", mon: ["cà phê muối"], trangThai: "đã giao" },
];

export const timDon = (maDon: string) => DON_HANG.find((don) => don.maDon === maDon);
