// Tìm và che những thứ không nên dán vào khung chat của AI: khóa, mật khẩu và thông tin cá nhân.
// Đây là LƯỚI LỌC cho những hình dạng đã biết, không phải lá chắn: bí mật có hình dạng lạ sẽ lọt qua.
export type Loai = "url-co-mat-khau" | "bot-token" | "khoa-aws" | "jwt" | "mat-khau-gan" | "email" | "so-dien-thoai";
export type PhatHien = { loai: Loai; dong: number; xemTruoc: string };

// Giá trị mẫu như "<token>", "your_key", "changeme" (hay nằm trong .env.example), hoặc chỗ đã che rồi, không phải bí mật thật.
const GIA_TRI_MAU = /^(<.*>|your[_-].*|changeme|x{3,}|\*{3,}|env\(.*|\[ẨN:.*)$/i;

// Thứ tự quan trọng: quy tắc cụ thể (bot-token, URL) chạy trước quy tắc chung ("token=...").
const CAC_QUY: { loai: Loai; mau: RegExp }[] = [
  { loai: "url-co-mat-khau", mau: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+/gi },
  { loai: "bot-token", mau: /(?<!\d)\d{8,10}:[A-Za-z0-9_-]{35}(?![A-Za-z0-9_-])/g },
  { loai: "khoa-aws", mau: /\bAKIA[0-9A-Z]{16}\b/g },
  { loai: "jwt", mau: /\beyJ[\w-]{8,}\.eyJ[\w-]{8,}\.[\w-]{8,}/g },
  { loai: "mat-khau-gan", mau: /\b\w*(?:api[_-]?key|[_-]key|secret|token|password|mat_khau)\w*\s*[:=]\s*["']?([^\s"',;]{8,})/gi },
  { loai: "email", mau: /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g },
  { loai: "so-dien-thoai", mau: /(?<!\d)(?:\+84|0)(?:[\s.]?\d){9}(?!\d)/g },
];

export function anBiMat(vanBan: string): { sach: string; phatHien: PhatHien[] } {
  const phatHien: PhatHien[] = [];
  let sach = vanBan;
  for (const { loai, mau } of CAC_QUY) {
    const truoc = sach;
    sach = truoc.replace(mau, (khop: string, ...doiSo: unknown[]) => {
      const viTri = doiSo[doiSo.length - 2] as number; // tham số kế cuối của callback replace là vị trí khớp
      const giaTri = loai === "mat-khau-gan" ? (doiSo[0] as string) : khop;
      if (GIA_TRI_MAU.test(giaTri)) return khop;
      phatHien.push({ loai, dong: truoc.slice(0, viTri).split("\n").length, xemTruoc: `${giaTri.slice(0, 4)}…` });
      return khop.replace(giaTri, `[ẨN:${loai}]`);
    });
  }
  return { sach, phatHien: phatHien.sort((a, b) => a.dong - b.dong) };
}
