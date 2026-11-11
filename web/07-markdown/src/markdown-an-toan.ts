// Một phương ngữ Markdown rất nhỏ, đổi thành "khối" có kiểu thay vì HTML.
// Chữ nào không nhận ra thì thành đoạn văn thường. HTML thô không bao giờ được hiểu là HTML.
export type Khoi =
  | { loai: "tieu-de"; muc: 2 | 3; chu: string }
  | { loai: "doan"; chu: string }
  | { loai: "danh-sach"; muc: string[] }
  | { loai: "code"; ngonNgu: string; ma: string };

export function parseMarkdown(nguon: string): Khoi[] {
  const dong = nguon.replace(/\r\n?/g, "\n").split("\n");
  const khoi: Khoi[] = [];
  let i = 0;
  while (i < dong.length) {
    const d = dong[i].trim();
    const tieuDe = /^(#{2,3})\s+(.+)$/.exec(d);
    const moRao = /^```(\w*)$/.exec(d);
    if (!d) {
      i++;
    } else if (moRao) {
      const ma: string[] = [];
      for (i++; i < dong.length && dong[i].trim() !== "```"; i++) ma.push(dong[i]);
      i++; // dòng đóng ```
      khoi.push({ loai: "code", ngonNgu: moRao[1] || "text", ma: ma.join("\n") });
    } else if (tieuDe) {
      khoi.push({ loai: "tieu-de", muc: tieuDe[1].length as 2 | 3, chu: tieuDe[2].trim() });
      i++;
    } else if (/^[-*]\s+/.test(d)) {
      const muc: string[] = [];
      for (; i < dong.length && /^[-*]\s+/.test(dong[i].trim()); i++) muc.push(dong[i].trim().replace(/^[-*]\s+/, ""));
      khoi.push({ loai: "danh-sach", muc });
    } else {
      const chu: string[] = [];
      for (; i < dong.length && dong[i].trim() && !/^(#{2,3}\s|```|[-*]\s)/.test(dong[i].trim()); i++) chu.push(dong[i].trim());
      khoi.push({ loai: "doan", chu: chu.join(" ") });
    }
  }
  return khoi;
}

export type Manh = { loai: "chu" | "dam" | "code"; chu: string } | { loai: "lien-ket"; chu: string; href: string };

// Chỉ nhận liên kết http(s) hoặc đường dẫn trong site. "javascript:", "data:" và "//host" bị coi là chữ thường.
export function hrefAnToan(href: string): boolean {
  return /^https?:\/\//.test(href) || (href.startsWith("/") && !href.startsWith("//"));
}

export function tachManh(chu: string): Manh[] {
  const ketQua: Manh[] = [];
  let cuoi = 0;
  for (const m of chu.matchAll(/`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    if (m[3] !== undefined && !hrefAnToan(m[4])) continue; // liên kết không an toàn: để nguyên thành chữ
    if (m.index > cuoi) ketQua.push({ loai: "chu", chu: chu.slice(cuoi, m.index) });
    if (m[1] !== undefined) ketQua.push({ loai: "code", chu: m[1] });
    else if (m[2] !== undefined) ketQua.push({ loai: "dam", chu: m[2] });
    else ketQua.push({ loai: "lien-ket", chu: m[3], href: m[4] });
    cuoi = m.index + m[0].length;
  }
  if (cuoi < chu.length) ketQua.push({ loai: "chu", chu: chu.slice(cuoi) });
  return ketQua;
}
