// Kiểm nhanh ("smoke test") một địa chỉ sau khi deploy: vài trang chính còn chạy không, và quy tắc index có đúng với loại môi trường không.
// Production phải cho công cụ tìm kiếm index và không được trỏ về localhost; preview phải noindex.
// Chỉ gửi vài yêu cầu GET, không sửa gì. Chạy: node kiem-sau-deploy.ts <địa-chỉ-gốc> production|preview
export type Loai = "production" | "preview";
export type Lay = (url: string) => Promise<{ status: number; headers: { get(ten: string): string | null }; text(): Promise<string> }>;
export type KetQuaKiem = { duong: string; dat: boolean; chiTiet: string };

const TRANG = ["/", "/bai-viet"];

const coNoindex = (html: string, header: string | null): boolean =>
  /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) || /noindex/i.test(header ?? "");

/** Các URL tuyệt đối trong thẻ canonical và og:* mà trang trỏ tới. */
const urlTrongThe = (html: string): string[] =>
  [...html.matchAll(/<(?:link[^>]+rel=["']canonical["'][^>]*href|meta[^>]+property=["']og:(?:url|image)["'][^>]*content)=["']([^"']+)["']/gi)].map((m) => m[1]!);

export async function kiemSauDeploy(goc: string, loai: Loai, lay: Lay): Promise<KetQuaKiem[]> {
  const ketQua: KetQuaKiem[] = [];
  const g = goc.replace(/\/+$/, "");

  for (const duong of TRANG) {
    const batDau = Date.now();
    let r;
    try {
      r = await lay(g + duong);
    } catch (loi) {
      ketQua.push({ duong, dat: false, chiTiet: `không kết nối được (${loi instanceof Error ? loi.message : "lỗi"})` });
      continue;
    }
    const html = await r.text();
    const ms = Date.now() - batDau;
    const van: string[] = [];
    if (r.status !== 200) van.push(`mã ${r.status}, cần 200`);
    if (!/<title>[^<]+<\/title>/i.test(html)) van.push("không có <title>");
    const noindex = coNoindex(html, r.headers.get("x-robots-tag"));
    if (loai === "production" && noindex) van.push("production mà có noindex: công cụ tìm kiếm sẽ bỏ qua trang này");
    if (loai === "preview" && !noindex) van.push("preview mà không có noindex: bản nháp có thể bị index");
    if (loai === "production") {
      const localhost = urlTrongThe(html).filter((u) => /localhost|127\.0\.0\.1/.test(u));
      if (localhost.length > 0) van.push(`canonical/og trỏ về localhost (${localhost[0]}); thường do thiếu NEXT_PUBLIC_SITE_URL lúc build`);
    }
    ketQua.push({ duong, dat: van.length === 0, chiTiet: van.length === 0 ? `200 trong ${ms} ms, ${noindex ? "noindex" : "index được"}` : van.join("; ") });
  }

  try {
    const r = await lay(g + "/robots.txt");
    const chu = await r.text();
    const chanHet = /^\s*Disallow:\s*\/\s*$/im.test(chu);
    const van: string[] = [];
    if (r.status !== 200) van.push(`mã ${r.status}, cần 200`);
    if (loai === "production" && chanHet) van.push("production mà robots.txt chặn toàn bộ (Disallow: /)");
    if (loai === "preview" && !chanHet) van.push("preview mà robots.txt không chặn toàn bộ");
    ketQua.push({ duong: "/robots.txt", dat: van.length === 0, chiTiet: van.length === 0 ? (chanHet ? "chặn toàn bộ" : "cho phép") : van.join("; ") });
  } catch (loi) {
    ketQua.push({ duong: "/robots.txt", dat: false, chiTiet: `không kết nối được (${loi instanceof Error ? loi.message : "lỗi"})` });
  }
  return ketQua;
}

if (process.argv[1]?.endsWith("kiem-sau-deploy.ts")) {
  const [goc, loai] = process.argv.slice(2);
  if (!goc || (loai !== "production" && loai !== "preview")) throw new Error("Cách dùng: node kiem-sau-deploy.ts <địa-chỉ-gốc> production|preview");
  const lay: Lay = (url) => fetch(url, { signal: AbortSignal.timeout(15_000) });
  const kq = await kiemSauDeploy(goc, loai, lay);
  console.log(`${goc} (${loai})`);
  for (const k of kq) console.log(`  ${k.dat ? "✓" : "✗"} ${k.duong}  ${k.chiTiet}`);
  const hong = kq.filter((k) => !k.dat).length;
  console.log(hong === 0 ? "\nTất cả đạt." : `\n${hong}/${kq.length} chỗ không đạt.`);
  process.exitCode = hong === 0 ? 0 : 1;
}
