// Sinh một ngày truy cập GIẢ của blog (không phải số liệu thật): người đọc, trình duyệt tự động, trang xem thử và các lệnh gọi thẳng vào máy chủ.
// IP dùng khối 203.0.113.0/24, khối dành riêng cho ví dụ trong tài liệu.
export type MoTrang = {
  loai: "mo-trang";
  nguoi: number; // số thứ tự người đọc thật (0 với trình duyệt tự động)
  tab: string; // một tab trình duyệt; sessionStorage chỉ sống trong một tab
  ip: string;
  trinhDuyet: string;
  slug: string;
  giayOLai: number;
  webdriver: boolean;
  trangThat: boolean; // false = bản xem thử (preview) hoặc chạy trên máy
};
export type GoiTruc = { loai: "goi-truc"; slug: string }; // ai đó gọi thẳng server action, không qua trình duyệt
export type SuKien = MoTrang | GoiTruc;

export const BAI_DA_DANG = ["git-co-ban", "debug-breakpoint", "viet-test-dau-tien", "zod-validation", "rag-la-gi", "seo-nextjs"];
export const BAI_NHAP = "bai-dang-viet-do";

function sinhSo(hat: number): () => number {
  let a = hat;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TRINH_DUYET = ["Chrome/Windows", "Safari/iPhone", "Chrome/Android", "Firefox/Linux", "Safari/macOS"];

export function sinhNgayTruyCap(hat = 11): SuKien[] {
  const r = sinhSo(hat);
  const ds: SuKien[] = [];
  const chon = <T>(mang: T[]) => mang[Math.floor(r() * mang.length)];

  // 90 người đọc thật. Mỗi người đọc 1 đến 3 bài; 30% lượt mở là "lướt" (rời trong dưới 5 giây);
  // 25% bài được tải lại một hai lần trong cùng tab; 10 người mở cùng một bài ở hai tab khác nhau.
  for (let nguoi = 1; nguoi <= 90; nguoi++) {
    const ip = `203.0.113.${nguoi}`;
    const trinhDuyet = chon(TRINH_DUYET);
    const soBai = 1 + Math.floor(r() * 3);
    for (let b = 0; b < soBai; b++) {
      const slug = chon(BAI_DA_DANG);
      const tab = `tab-${nguoi}-${b}`;
      const giayOLai = r() < 0.3 ? 1 + Math.floor(r() * 4) : 8 + Math.floor(r() * 170);
      const moLai = r() < 0.25 ? 1 + Math.floor(r() * 2) : 0;
      for (let k = 0; k <= moLai; k++) ds.push({ loai: "mo-trang", nguoi, tab, ip, trinhDuyet, slug, giayOLai, webdriver: false, trangThat: true });
      if (nguoi <= 10 && b === 0) ds.push({ loai: "mo-trang", nguoi, tab: `${tab}-tab-hai`, ip, trinhDuyet, slug, giayOLai: 60, webdriver: false, trangThat: true });
    }
  }
  // 40 lượt của trình duyệt tự động (kiểm thử, robot đọc trang có chạy JavaScript).
  for (let i = 0; i < 40; i++) ds.push({ loai: "mo-trang", nguoi: 0, tab: `bot-${i}`, ip: `203.0.113.${200 + (i % 20)}`, trinhDuyet: "HeadlessChrome", slug: chon(BAI_DA_DANG), giayOLai: 30, webdriver: true, trangThat: true });
  // 20 lượt xem thử trên bản preview của Vercel.
  for (let i = 0; i < 20; i++) ds.push({ loai: "mo-trang", nguoi: 91, tab: `preview-${i}`, ip: "203.0.113.91", trinhDuyet: "Chrome/Windows", slug: chon(BAI_DA_DANG), giayOLai: 40, webdriver: false, trangThat: false });
  // 30 lệnh gọi thẳng: slug bịa, bài nháp, và chuỗi lạ.
  const SPAM = ["bai-khong-ton-tai", BAI_NHAP, "../../etc/passwd", "A", "x".repeat(150)];
  for (let i = 0; i < 30; i++) ds.push({ loai: "goi-truc", slug: i % 3 === 0 ? `bai-bia-${i}` : chon(SPAM) });
  return ds;
}
