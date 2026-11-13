// Kiểm tra một tin nhắn xin nhận xét có đủ năm phần chưa. Chỉ kiểm tra SỰ CÓ MẶT của từng phần bằng từ khóa và hình dạng,
// không đánh giá chất lượng: tin nhắn nhồi từ khóa mà rỗng ruột vẫn qua (xem test cuối cùng).
export type Phep = { ten: string; dat: (tin: string) => boolean };

const SO_GACH_DAU_DONG = (tin: string) => (tin.match(/^\s*(?:[-*]|\d+\.)\s+\S/gmu) ?? []).length;

export const CAC_PHEP: Phep[] = [
  { ten: "gửi kèm thứ cụ thể (link, số pull request hoặc tên file)", dat: (tin) => /https?:\/\/\S+|PR\s*#?\d+|\b[\w-]+\.(?:ts|tsx|js|md|py|sql)\b/iu.test(tin) },
  { ten: "nói rõ muốn góp ý về một hai điều", dat: (tin) => /(muốn|xin|nhờ).{0,40}(góp ý|nhận xét|feedback|xem giúp)/iu.test(tin) && SO_GACH_DAU_DONG(tin) >= 1 && SO_GACH_DAU_DONG(tin) <= 3 },
  { ten: "không hỏi chung chung kiểu 'em làm thế nào'", dat: (tin) => !/(làm|học) (thế nào|ra sao)|có ổn không|thấy (em|mình) (sao|thế nào)|cần cải thiện (gì|không)/iu.test(tin) },
  { ten: "cho biết cần bao lâu", dat: (tin) => /\d+\s*phút/iu.test(tin) },
  { ten: "có hạn và cách trả lời dễ", dat: (tin) => /trước\s+(thứ|ngày|\d{1,2}\/\d{1,2})/iu.test(tin) && /(comment|bình luận)\s+(thẳng\s+|trực tiếp\s+)?(vào|trong|trên)|trả lời (bằng|ngắn)/iu.test(tin) },
];

export function kiemTra(tin: string): { phep: string; dat: boolean }[] {
  return CAC_PHEP.map(({ ten, dat }) => ({ phep: ten, dat: dat(tin) }));
}
