// Đơn hàng của quán Mộc (minh họa), giống dữ liệu ở tập 1.
// Ngoài đời, hai hàm dưới đây sẽ đọc database; ở đây đọc một mảng cho dễ chạy.
export type Don = {
  maDon: string;
  soDienThoai: string;
  mon: string[];
  trangThai: "đang pha chế" | "đang giao" | "đã giao";
  datLuc: string;
};

const DON_HANG: Don[] = [
  { maDon: "1041", soDienThoai: "0901000001", mon: ["cà phê sữa", "bánh mì trứng"], trangThai: "đang pha chế", datLuc: "hôm nay 8:12" },
  { maDon: "1042", soDienThoai: "0901000002", mon: ["bạc xỉu"], trangThai: "đang giao", datLuc: "hôm nay 9:40" },
];

export function timDonTheoMa(maDon: string): Don | undefined {
  return DON_HANG.find((don) => don.maDon === maDon);
}

export function timDonTheoSdt(soDienThoai: string): Don | undefined {
  return DON_HANG.find((don) => don.soDienThoai === soDienThoai);
}
