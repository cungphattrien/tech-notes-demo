// Đọc sổ phản hồi (một dòng một việc) và xếp các việc theo tình trạng tại một ngày cho trước.
// Dạng một dòng: - [x] mô tả | từ: ai | nhận: dd/mm/yyyy | hạn: dd/mm/yyyy | báo lại: dd/mm/yyyy hoặc "chưa"
export type Viec = { xong: boolean; moTa: string; tu: string; nhan: string; han: string; baoLai: string | null };

const NGAY = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const sangIso = (ngay: string): string => {
  const m = NGAY.exec(ngay.trim());
  if (!m) throw new Error(`Ngày phải có dạng dd/mm/yyyy, nhưng gặp "${ngay}"`);
  return `${m[3]}-${m[2]}-${m[1]}`;
};

export function docSo(noiDung: string): Viec[] {
  return noiDung.split(/\r?\n/).filter((dong) => dong.trim() !== "").map((dong, i) => {
    const m = /^- \[( |x)\] (.+)$/.exec(dong.trim());
    if (!m) throw new Error(`Dòng ${i + 1} sai dạng: "${dong}"`);
    const [moTa, ...cacTruong] = m[2].split("|").map((s) => s.trim());
    const truong = Object.fromEntries(cacTruong.map((t) => [t.split(":")[0].trim(), t.slice(t.indexOf(":") + 1).trim()]));
    for (const khoa of ["từ", "nhận", "hạn", "báo lại"]) if (!(khoa in truong)) throw new Error(`Dòng ${i + 1} thiếu "${khoa}"`);
    return { xong: m[1] === "x", moTa, tu: truong["từ"], nhan: sangIso(truong["nhận"]), han: sangIso(truong["hạn"]), baoLai: truong["báo lại"] === "chưa" ? null : sangIso(truong["báo lại"]) };
  });
}

export type Nhom = "đã xong và đã báo lại" | "xong rồi nhưng chưa báo lại" | "quá hạn" | "còn trong hạn";

/** Xếp một việc vào nhóm. `homNay` ở dạng yyyy-mm-dd. Việc xong mà chưa báo lại người cho nhận xét vẫn tính là "chưa khép vòng". */
export function xepNhom(viec: Viec, homNay: string): Nhom {
  if (viec.xong) return viec.baoLai ? "đã xong và đã báo lại" : "xong rồi nhưng chưa báo lại";
  return viec.han < homNay ? "quá hạn" : "còn trong hạn";
}

export function tomTat(cacViec: Viec[], homNay: string): Map<Nhom, Viec[]> {
  const kq = new Map<Nhom, Viec[]>([["xong rồi nhưng chưa báo lại", []], ["quá hạn", []], ["còn trong hạn", []], ["đã xong và đã báo lại", []]]);
  for (const viec of cacViec) kq.get(xepNhom(viec, homNay))!.push(viec);
  return kq;
}
