import { MENU } from "./thong-tin-quan.ts";

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

// Thêm món vào đơn. Chỉ được thêm khi đơn còn đang pha chế: đơn đã lên xe thì không sửa được nữa.
export function themMon(maDon: string, mon: string, soLuong: number): { ok: true; don: Don } | { ok: false; lyDo: string } {
  const don = timDonTheoMa(maDon);
  if (!don) return { ok: false, lyDo: `Không có đơn ${maDon}.` };
  if (!(mon in MENU)) return { ok: false, lyDo: `Quán không bán "${mon}".` };
  if (don.trangThai !== "đang pha chế") return { ok: false, lyDo: `Đơn ${maDon} ${don.trangThai}, không thêm món được nữa.` };
  for (let i = 0; i < soLuong; i++) don.mon.push(mon);
  return { ok: true, don };
}
