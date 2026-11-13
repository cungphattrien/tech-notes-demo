// Mô phỏng một ngày của quán Mộc: 200 tin nhắn của 60 khách, rồi tính tiền theo từng cách vận hành.
// Không gọi mô hình thật: số token là ước lượng, bảng giá là giả định. Cái cần xem là CHÊNH LỆCH giữa các cách làm.
import { chonMoHinh } from "./dinh-tuyen.ts";
import { type LuotGoi, tinhTien, type MoHinh } from "./gia.ts";
import { TIEN_TO } from "./chinh-sach.ts";
import { BoNhoDem } from "./luu-dem.ts";
import { uocTinhToken } from "./token.ts";

export type Loai = "tra-don" | "thuc-don" | "gio-mo-cua" | "hoan-tien" | "ngoai-pham-vi";
export type YeuCau = { giay: number; khach: string; loai: Loai; tin: string };

const TIN: Record<Loai, string[]> = {
  "tra-don": ["Đơn 1041 của em đâu rồi?", "Đơn 1042 khi nào tới vậy quán?", "Đơn 1043 đã giao chưa?"],
  "thuc-don": ["Quán có những món gì?", "Quán có món gì uống với bánh không?"],
  "gio-mo-cua": ["Quán mấy giờ đóng cửa vậy?", "Giờ mở cửa của quán thế nào?"],
  "hoan-tien": ["Em muốn hoàn tiền đơn 1041.", "Giao trễ quá, quán đền tiền cho em đi."],
  "ngoai-pham-vi": ["Hôm nay Hà Nội có mưa không?", "Viết giúp em một hàm sắp xếp mảng."],
};
const TRONG_SO: [Loai, number][] = [["tra-don", 45], ["thuc-don", 20], ["gio-mo-cua", 15], ["hoan-tien", 10], ["ngoai-pham-vi", 10]];
// Số token đầu ra của từng lượt gọi mô hình cho mỗi loại tin (ước lượng). "tra-don" có hai lượt: gọi công cụ, rồi trả lời.
const TOKEN_RA: Record<Loai, number[]> = { "tra-don": [30, 70], "thuc-don": [90], "gio-mo-cua": [45], "hoan-tien": [60], "ngoai-pham-vi": [40] };

function sinhSo(hat: number): () => number {
  let a = hat;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Giờ cao điểm: sáng, trưa, chiều, tối. Mỗi phần tử là [giờ bắt đầu, giờ kết thúc, trọng số].
const KHUNG_GIO = [[7, 9, 3], [11, 13, 5], [15, 17, 2], [19, 21, 1]];

export function sinhLuuLuong(soYeuCau = 200, hat = 2026): YeuCau[] {
  const ngauNhien = sinhSo(hat);
  const tongKhung = KHUNG_GIO.reduce((t, k) => t + k[2], 0);
  const ds: YeuCau[] = [];
  for (let i = 0; i < soYeuCau; i++) {
    let r = ngauNhien() * tongKhung;
    const khung = KHUNG_GIO.find((k) => (r -= k[2]) < 0) ?? KHUNG_GIO[0];
    const giay = Math.floor((khung[0] + ngauNhien() * (khung[1] - khung[0])) * 3600);
    let p = ngauNhien() * 100;
    const loai = TRONG_SO.find(([, w]) => (p -= w) < 0)?.[0] ?? "tra-don";
    const cacTin = TIN[loai];
    const khach = `09010000${String(1 + Math.floor(ngauNhien() * 60)).padStart(2, "0")}`;
    ds.push({ giay, khach, loai, tin: cacTin[Math.floor(ngauNhien() * cacTin.length)] });
  }
  return ds.sort((a, b) => a.giay - b.giay);
}

export type CachVanHanh = {
  cache: "khong" | "5p" | "1h";
  dinhTuyen: boolean;
  /** Số lượt gọi mô hình tối đa cho một tin nhắn. Chưa đặt thì tin "lặp công cụ" chạy hết 12 lượt. */
  toiDaLuot?: number;
  /** Lỗi hay gặp: đặt giờ hiện tại ở ĐẦU hướng dẫn, làm tiền tố khác nhau ở mỗi lượt gọi và phá cache. */
  gioODau?: boolean;
};
export type KetQua = { tien: number; soLuotGoi: number; doc: number; ghi: number; khong: number; chuyenNguoi: number };

const LUOT_LAP = 12; // một tin nhắn làm agent gọi lại cùng một công cụ mãi (mô phỏng lỗi vòng lặp)

export function chayNgay(luuLuong: YeuCau[], cach: CachVanHanh): KetQua {
  const ttl = cach.cache === "1h" ? 3600 : 300;
  const bo: Record<MoHinh, BoNhoDem> = { lon: new BoNhoDem(ttl), nho: new BoNhoDem(ttl) };
  const kq: KetQua = { tien: 0, soLuotGoi: 0, doc: 0, ghi: 0, khong: 0, chuyenNguoi: 0 };
  luuLuong.forEach((yc, i) => {
    const moHinh: MoHinh = cach.dinhTuyen ? chonMoHinh(yc.tin) : "lon";
    const biLap = i % 50 === 7; // 4 trong 200 tin làm agent lặp công cụ
    const tokenRa = biLap ? Array<number>(LUOT_LAP).fill(30) : TOKEN_RA[yc.loai];
    const toiDa = cach.toiDaLuot ?? Infinity;
    const soLuot = Math.min(tokenRa.length, toiDa);
    if (tokenRa.length > toiDa) kq.chuyenNguoi++;
    let phanDoi = uocTinhToken(yc.tin); // phần đổi theo tin nhắn; mỗi lượt sau cộng thêm ~80 token kết quả công cụ
    for (let l = 0; l < soLuot; l++) {
      const gio = cach.gioODau ? `Bây giờ là ${new Date((yc.giay + l) * 1000).toISOString().slice(11, 19)}.\n` : "";
      const tienTo = gio + TIEN_TO;
      const tokenTienTo = uocTinhToken(tienTo);
      const luot: LuotGoi = { moHinh, tokenVao: tokenTienTo + phanDoi, tokenRa: tokenRa[l], tokenTienTo, cache: "khong" };
      if (cach.cache !== "khong") {
        const ketQuaCache = bo[moHinh].dung(`${moHinh}|${tienTo}`, tokenTienTo, yc.giay + l);
        luot.cache = ketQuaCache === "doc" ? "doc" : ketQuaCache === "ghi" ? (cach.cache === "1h" ? "ghi1h" : "ghi5p") : "khong";
        kq[ketQuaCache]++;
      }
      kq.tien += tinhTien(luot);
      kq.soLuotGoi++;
      phanDoi += 80;
    }
  });
  return kq;
}
