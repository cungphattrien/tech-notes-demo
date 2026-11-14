// Nhật ký dạng JSON Lines: mỗi sự kiện một dòng, đều có maHoiThoai để ghép lại cả cuộc trò chuyện.
// Số điện thoại bị che trước khi ghi, vì nhật ký sống lâu hơn cuộc trò chuyện và nhiều người đọc được nó.

export type SuKien = { loai: string; maHoiThoai: string; [khoa: string]: unknown };

const SO_DIEN_THOAI = /(?<!\d)(?:\+84|0)\d{8,9}(?!\d)/gu;
/** "0901000001" → "090*****01": giữ đủ để phân biệt hai khách, không đủ để gọi lại. */
export const cheSoDienThoai = (chu: string): string =>
  chu.replace(SO_DIEN_THOAI, (so) => so.slice(0, 3) + "*".repeat(so.length - 5) + so.slice(-2));

export class NhatKy {
  readonly dong: string[] = [];
  private readonly gio: () => Date;
  constructor(gio: () => Date = () => new Date()) {
    this.gio = gio;
  }
  ghi(suKien: SuKien): void {
    const ban = JSON.parse(cheSoDienThoai(JSON.stringify({ luc: this.gio().toISOString(), ...suKien })));
    this.dong.push(JSON.stringify(ban));
  }
  cuaHoiThoai(maHoiThoai: string): Record<string, unknown>[] {
    return this.dong.map((d) => JSON.parse(d)).filter((s) => s.maHoiThoai === maHoiThoai);
  }
}
