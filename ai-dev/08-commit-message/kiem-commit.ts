// Kiểm tra các commit trong một kho Git theo vài quy tắc đơn giản. Chạy: node kiem-commit.ts <đường-dẫn-kho>
// Đây là bộ quy tắc mình tự đặt cho bài này, không phải tiêu chuẩn của Git hay của Conventional Commits.
import { execFileSync } from "node:child_process";

export const MAX_SUBJECT = 72;
const KIEU = /^(feat|fix|docs|test|refactor|chore|perf|build|ci|style)(\([\w-]+\))?!?: \S.*/;
// Dòng tiêu đề chỉ có một từ chung chung thì không nói gì về thay đổi.
const MO_HO = /^(fix|update|ok|xong|sửa|sửa lại|fix tiếp|wip|test|tmp)$/i;

export type Commit = { hash: string; subject: string; body: string };

export function checkCommit({ subject, body }: Commit): string[] {
  const problems: string[] = [];
  if (MO_HO.test(subject.trim())) problems.push("tiêu đề mơ hồ, không nói đã đổi gì");
  else if (!KIEU.test(subject)) problems.push("không theo dạng kiểu(phạm vi): mô tả");
  if (subject.length > MAX_SUBJECT) problems.push(`tiêu đề dài ${subject.length} ký tự (tối đa ${MAX_SUBJECT})`);
  // Thay đổi thêm tính năng hoặc sửa lỗi nên nói vì sao; docs/test thường không cần.
  if (/^(feat|fix)[(:!]/.test(subject) && body.trim() === "") problems.push("thiếu phần thân giải thích vì sao");
  return problems;
}

export function readCommits(repo: string): Commit[] {
  const raw = execFileSync("git", ["log", "--reverse", "--format=%h%x00%s%x00%b%x01"], { cwd: repo, encoding: "utf8" });
  return raw.split("\x01").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
    const [hash, subject, body = ""] = chunk.split("\x00");
    return { hash, subject, body };
  });
}

if (import.meta.main) {
  const repo = process.argv[2];
  if (!repo) throw new Error("Cách dùng: node kiem-commit.ts <đường-dẫn-kho>");
  let withProblems = 0;
  const commits = readCommits(repo);
  for (const commit of commits) {
    const problems = checkCommit(commit);
    if (problems.length) withProblems++;
    console.log(`${problems.length ? "✗" : "✓"} ${commit.hash} ${commit.subject}${problems.map((p) => `\n    - ${p}`).join("")}`);
  }
  console.log(`\n${commits.length} commit, ${withProblems} commit có vấn đề`);
}
