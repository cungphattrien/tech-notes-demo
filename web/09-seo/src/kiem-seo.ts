// Kiểm tra nhanh phần <head> của một trang. Dùng biểu thức chính quy cho gọn: đủ cho phần head do chính mình dựng,
// không dùng được để đọc HTML bất kỳ trên mạng (muốn vậy hãy dùng bộ phân tích HTML thật).
export type KetQua = { dau: "✓" | "✗"; noiDung: string };

const lay = (html: string, mau: RegExp) => html.match(mau)?.[1];

export function kiemSeo(head: string): KetQua[] {
  const kq: KetQua[] = [];
  const ghi = (dat: boolean, noiDung: string) => kq.push({ dau: dat ? "✓" : "✗", noiDung });

  const title = lay(head, /<title>([^<]*)<\/title>/);
  ghi(title !== undefined && title.length >= 30 && title.length <= 65, title === undefined ? "Thiếu thẻ <title>" : `Tiêu đề ${title.length} ký tự (nên 30–65)`);

  const mota = lay(head, /<meta name="description" content="([^"]*)"/);
  ghi(mota !== undefined && mota.length >= 120 && mota.length <= 160, mota === undefined ? "Thiếu meta description" : `Mô tả ${mota.length} ký tự (nên 120–160)`);

  const canonical = head.match(/<link rel="canonical" href="([^"]*)"/g) ?? [];
  ghi(canonical.length === 1 && /href="https?:\/\//.test(canonical[0]), canonical.length === 0 ? "Thiếu canonical" : canonical.length > 1 ? "Có hơn một canonical" : "Có đúng một canonical, là URL đầy đủ");

  const hreflang = head.match(/<link rel="alternate" hreflang=/g) ?? [];
  ghi(hreflang.length === 0 || hreflang.length >= 2, hreflang.length === 1 ? "Chỉ có một hreflang: cần ít nhất hai (hoặc không có)" : `hreflang: ${hreflang.length} liên kết`);

  const ld = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (ld.length === 0) ghi(false, "Thiếu dữ liệu có cấu trúc JSON-LD");
  for (const [, noiDung] of ld) {
    try {
      const du = JSON.parse(noiDung);
      ghi(typeof du["@type"] === "string", `JSON-LD hợp lệ, @type = ${du["@type"]}`);
    } catch {
      ghi(false, "JSON-LD không đọc được (không phải JSON hợp lệ)");
    }
  }

  ghi(!/<meta name="robots" content="[^"]*noindex/.test(head), /noindex/.test(head) ? "Trang đang noindex: Google sẽ không đưa vào kết quả" : "Không noindex");
  return kq;
}
