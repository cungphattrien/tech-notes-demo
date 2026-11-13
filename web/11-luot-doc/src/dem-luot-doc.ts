// Mô phỏng hai nửa của việc đếm lượt đọc, theo đúng thứ tự của blog thật:
//   1. Trình duyệt (view-beacon.tsx): chờ 5 giây, kiểm tra shouldCountView, mỗi tab một lần cho mỗi bài, rồi gọi máy chủ.
//   2. Máy chủ (hàm SQL record_post_view): chỉ đếm bài ĐÃ ĐĂNG, mỗi (bài, ngày) một dòng, tăng thêm 1.
import type { SuKien } from "./su-kien.ts";
import { GIAY_CHO_TRUOC_KHI_TINH, isPostSlug, shouldCountView, type ViewRow } from "./views.ts";

export type LyDoLoai = "xem thử, không phải trang thật" | "trình duyệt tự động" | "rời trước 5 giây" | "cùng tab đã tính" | "slug sai dạng" | "không phải bài đã đăng";
export type KetQuaDem = { bang: ViewRow[]; loai: Map<LyDoLoai, number>; soLenhGoi: number };

export function demLuotDoc(suKien: SuKien[], baiDaDang: string[], ngay: string): KetQuaDem {
  const bang = new Map<string, number>(); // khóa "slug|ngày" -> số lượt, giống bảng post_views
  const loai = new Map<LyDoLoai, number>();
  const tuChoi = (lyDo: LyDoLoai) => loai.set(lyDo, (loai.get(lyDo) ?? 0) + 1);
  const daTinhTrongTab = new Set<string>(); // thay cho sessionStorage: "tab|slug"
  let soLenhGoi = 0;

  // Nửa máy chủ: chỉ nhận slug đúng dạng và là bài đã đăng.
  const ghiLuotDoc = (slug: string) => {
    soLenhGoi++;
    if (!isPostSlug(slug)) return tuChoi("slug sai dạng");
    if (!baiDaDang.includes(slug)) return tuChoi("không phải bài đã đăng");
    const khoa = `${slug}|${ngay}`;
    bang.set(khoa, (bang.get(khoa) ?? 0) + 1);
  };

  for (const sk of suKien) {
    if (sk.loai === "goi-truc") {
      ghiLuotDoc(sk.slug); // không qua trình duyệt, nên chỉ máy chủ chặn được
      continue;
    }
    const khoaTab = `${sk.tab}|${sk.slug}`;
    if (!sk.trangThat) { tuChoi("xem thử, không phải trang thật"); continue; }
    if (sk.webdriver) { tuChoi("trình duyệt tự động"); continue; }
    if (sk.giayOLai < GIAY_CHO_TRUOC_KHI_TINH) { tuChoi("rời trước 5 giây"); continue; } // đồng hồ 5 giây chưa kịp chạy
    if (!shouldCountView({ enabled: sk.trangThat, webdriver: sk.webdriver, alreadyCounted: daTinhTrongTab.has(khoaTab) })) { tuChoi("cùng tab đã tính"); continue; }
    daTinhTrongTab.add(khoaTab);
    ghiLuotDoc(sk.slug);
  }
  const rows = [...bang].map(([khoa, views]) => ({ slug: khoa.split("|")[0], day: khoa.split("|")[1], views }));
  return { bang: rows, loai, soLenhGoi };
}
