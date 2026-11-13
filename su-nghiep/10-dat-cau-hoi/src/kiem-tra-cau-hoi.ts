// Kiểm tra một tin nhắn hỏi đồng nghiệp có đủ sáu phần chưa. Chỉ kiểm tra SỰ CÓ MẶT của từng phần bằng từ khóa và hình dạng,
// không đánh giá chất lượng: tin nhắn nhồi từ khóa mà rỗng ruột vẫn qua (xem test cuối cùng).
export type Phep = { ten: string; dat: (tin: string) => boolean };

export const CAC_PHEP: Phep[] = [
  { ten: "nói đang làm gì", dat: (tin) => /(em|mình|tôi) đang (làm|chạy|cố|định|thử|viết|sửa)/iu.test(tin) },
  { ten: "dán lỗi nguyên văn", dat: (tin) => /^\s*(\w*Error\b|\w*Exception\b|Traceback|fatal:|npm ERR!)/m.test(tin) },
  { ten: "nói mong đợi và thực tế", dat: (tin) => /(mong đợi|kỳ vọng|đáng lẽ)/iu.test(tin) && /(thực tế|thay vì|nhưng)/iu.test(tin) },
  { ten: "nêu ít nhất hai việc đã thử", dat: (tin) => /đã thử/iu.test(tin) && (tin.match(/^\s*(?:[-*]|\d+\.)\s+\S/gmu) ?? []).length >= 2 },
  { ten: "cho biết môi trường", dat: (tin) => /(windows|macos|linux)/iu.test(tin) && /(node|phiên bản|version)\s*v?\d/iu.test(tin) },
  { ten: "kết thúc bằng một câu hỏi", dat: (tin) => /\?\s*$/u.test(tin.trim()) },
];

export function kiemTra(tin: string): { phep: string; dat: boolean }[] {
  return CAC_PHEP.map(({ ten, dat }) => ({ phep: ten, dat: dat(tin) }));
}
