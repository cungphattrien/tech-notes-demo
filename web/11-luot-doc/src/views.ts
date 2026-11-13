// Các hàm thuần của việc đếm lượt đọc, cùng ý với src/lib/views.ts của blog Tech Notes (bản demo bỏ phần riêng của Next.js).

export const GIAY_CHO_TRUOC_KHI_TINH = 5; // người đọc ở lại trang ít nhất chừng này giây thì mới tính một lượt đọc

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isPostSlug = (value: unknown): value is string => typeof value === "string" && value.length <= 120 && SLUG.test(value);

/** Có nên tính một lượt đọc cho trình duyệt này không: chỉ trên trang thật, không phải trình duyệt tự động, và chưa tính trong phiên này. */
export function shouldCountView({ enabled, webdriver, alreadyCounted }: { enabled: boolean; webdriver: boolean; alreadyCounted: boolean }) {
  return enabled && !webdriver && !alreadyCounted;
}

export type ViewRow = { slug: string; day: string; views: number };

/** Tổng theo slug trong `days` ngày gần nhất (tính cả hôm nay), nhiều nhất trước. */
export function totalsSince(rows: ViewRow[], today: string, days = 30): Map<string, number> {
  const cutoff = new Date(`${today}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const from = cutoff.toISOString().slice(0, 10);
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.day < from || row.day > today) continue;
    totals.set(row.slug, (totals.get(row.slug) ?? 0) + row.views);
  }
  return new Map([...totals].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

/** Ngày hôm nay theo giờ Việt Nam (UTC+7), dùng làm khóa của bảng đếm. */
export function vnToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
