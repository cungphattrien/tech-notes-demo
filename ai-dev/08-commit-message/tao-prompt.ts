// Dựng prompt nhờ AI viết commit message từ các thay đổi đã `git add`. Không gọi AI: chỉ in prompt để bạn dán vào công cụ bạn dùng.
// Chạy: node tao-prompt.ts <đường-dẫn-kho> "<ý định của bạn: vì sao đổi>"
import { execFileSync } from "node:child_process";

export const MAX_DIFF_CHARS = 12_000;

const git = (repo: string, ...args: string[]) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();

export function buildPrompt(repo: string, intent: string): string {
  const diff = git(repo, "diff", "--staged");
  if (!diff) throw new Error("Chưa có gì được git add: không có thay đổi nào để mô tả.");
  if (!intent.trim()) throw new Error("Thiếu ý định: diff chỉ cho thấy ĐỔI GÌ, AI không thể đoán VÌ SAO bạn đổi.");
  const files = git(repo, "diff", "--staged", "--stat");
  const recent = git(repo, "log", "-5", "--format=- %s");
  const cut = diff.length > MAX_DIFF_CHARS;
  return [
    "Viết commit message bằng tiếng Việt cho các thay đổi dưới đây.",
    "Quy tắc:",
    "- Dòng đầu: kiểu(phạm vi): mô tả ngắn, tối đa 72 ký tự, không dấu chấm cuối. Kiểu là feat, fix, docs, test, refactor hoặc chore.",
    "- Cách một dòng trống, rồi phần thân (2 đến 5 dòng) giải thích VÌ SAO đổi và vì sao chọn cách này, không kể lại từng dòng code.",
    "- Chỉ dùng thông tin có trong diff và trong ý định của mình. Không nhắc test, benchmark hay tác dụng nào mà diff không cho thấy.",
    "- Nếu diff gồm nhiều việc không liên quan nhau, đừng viết một message chung: nói rõ nên tách thành mấy commit và tách thế nào.",
    "",
    "Tiêu đề các commit gần đây (để giữ cùng phong cách):",
    recent,
    "",
    `Ý định của mình: ${intent.trim()}`,
    "",
    "Các file đổi:",
    files,
    "",
    cut ? `Diff (đã cắt còn ${MAX_DIFF_CHARS} ký tự đầu, vì dài quá; hãy tách commit nhỏ hơn):` : "Diff:",
    cut ? diff.slice(0, MAX_DIFF_CHARS) : diff,
  ].join("\n");
}

if (import.meta.main) {
  const [repo, ...intent] = process.argv.slice(2);
  if (!repo) throw new Error('Cách dùng: node tao-prompt.ts <đường-dẫn-kho> "<ý định>"');
  console.log(buildPrompt(repo, intent.join(" ")));
}
