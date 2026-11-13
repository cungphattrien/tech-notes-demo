// Kiểm tra từng bước trong bài viết bằng một repo Git thật, dựng trong thư mục tạm. Cần bash và git. Chạy: node --test xung-dot.test.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

const AQUI = import.meta.dirname;
const ENV = { ...process.env, LC_ALL: "C", GIT_EDITOR: "true" };

// Dựng một repo mới cho mỗi test: chạy dung-xung-dot.sh trong thư mục tạm, chép kiem-tra.ts vào.
function dungRepo(): string {
  const goc = mkdtempSync(join(tmpdir(), "moc-xung-dot-"));
  const kq = spawnSync("bash", [resolve(AQUI, "dung-xung-dot.sh")], { cwd: goc, env: ENV, encoding: "utf8" });
  assert.equal(kq.status, 0, kq.stderr);
  const repo = join(goc, "moc-xung-dot");
  copyFileSync(resolve(AQUI, "kiem-tra.ts"), join(repo, "kiem-tra.ts"));
  return repo;
}
const git = (repo: string, ...args: string[]) => spawnSync("git", args, { cwd: repo, env: ENV, encoding: "utf8" });
const file = (repo: string) => join(repo, "src", "phi-giao.ts");
const kiemTra = (repo: string) => spawnSync("node", ["kiem-tra.ts"], { cwd: repo, env: ENV, encoding: "utf8" });

const BAN_DUNG = `// Phí giao hàng của quán Mộc.
export const PHI_GIAO = 15000;
export const MIEN_PHI_TU = 200000; // khuyến mãi mới: miễn phí từ 200.000đ

export function tinhPhiGiao(tongTien: number, km: number): number {
  if (tongTien <= 0) return 0; // giỏ trống thì không tính phí
  if (tongTien >= MIEN_PHI_TU) return 0;
  return PHI_GIAO + Math.max(0, km - 3) * 5000;
}
`;

test("repo dựng sẵn: nhánh của bạn có 2 commit, main có thêm 1 commit từ đồng nghiệp", () => {
  const repo = dungRepo();
  assert.equal(git(repo, "rev-list", "--count", "main").stdout.trim(), "2");
  assert.equal(git(repo, "rev-list", "--count", "feat/phi-giao-theo-km").stdout.trim(), "3");
});

test("merge main vào nhánh: dòng khuyến mãi tự gộp, hàm tinhPhiGiao xung đột", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  const kq = git(repo, "merge", "main");
  assert.notEqual(kq.status, 0);
  assert.match(kq.stdout, /CONFLICT \(content\): Merge conflict in src\/phi-giao\.ts/);
  const noiDung = readFileSync(file(repo), "utf8");
  assert.match(noiDung, /^<<<<<<< HEAD$/m);
  assert.match(noiDung, /^>>>>>>> main$/m);
  assert.ok(noiDung.indexOf("MIEN_PHI_TU = 200000") < noiDung.indexOf("<<<<<<<"), "dòng 200000 đã tự gộp, nằm trước vùng xung đột");
});

test("chỉ xóa dòng đánh dấu thì code không còn chạy được", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  git(repo, "merge", "main");
  writeFileSync(file(repo), readFileSync(file(repo), "utf8").split("\n").filter((d) => !/^(<<<<<<<|=======|>>>>>>>)/.test(d)).join("\n"));
  const kq = kiemTra(repo);
  assert.notEqual(kq.status, 0);
  assert.match(kq.stderr, /SyntaxError/);
});

test("gộp tay đúng: 5 phép kiểm đều ĐÚNG, commit gộp có hai cha", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  git(repo, "merge", "main");
  writeFileSync(file(repo), BAN_DUNG.replace("km - 3", "Math.ceil(km) - 3").replace("5000;", "5000; // km lẻ tính tròn lên"));
  git(repo, "add", "src/phi-giao.ts");
  assert.equal(git(repo, "commit", "--no-edit").status, 0);
  assert.equal(kiemTra(repo).stdout.match(/^ĐÚNG/gm)?.length, 5);
  assert.equal(git(repo, "rev-list", "--parents", "-n", "1", "HEAD").stdout.trim().split(" ").length, 3);
});

test("khi rebase, ours là main (bên được đặt lên trên) và theirs là commit của bạn: ngược với merge", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  const kq = git(repo, "rebase", "main");
  assert.notEqual(kq.status, 0);
  assert.match(git(repo, "status").stdout, /rebas(e|ing)/i);
  git(repo, "checkout", "--ours", "src/phi-giao.ts");
  assert.doesNotMatch(readFileSync(file(repo), "utf8"), /km: number/); // bản của main chưa có tham số km
  git(repo, "checkout", "--theirs", "src/phi-giao.ts");
  assert.match(readFileSync(file(repo), "utf8"), /km: number/); // bản của bạn
});

test("chọn cả file bên 'theirs' làm mất khuyến mãi của đồng nghiệp: 2 phép kiểm SAI", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  git(repo, "rebase", "main");
  git(repo, "checkout", "--theirs", "src/phi-giao.ts");
  git(repo, "add", "src/phi-giao.ts");
  assert.equal(git(repo, "rebase", "--continue").status, 0);
  assert.equal(kiemTra(repo).stdout.match(/^SAI/gm)?.length, 2);
});

test("rebase --abort trả nhánh về đúng như trước; reflog tìm lại được trạng thái trước rebase hỏng", () => {
  const repo = dungRepo();
  git(repo, "switch", "-q", "feat/phi-giao-theo-km");
  const truoc = git(repo, "rev-parse", "HEAD").stdout.trim();
  git(repo, "rebase", "main");
  git(repo, "rebase", "--abort");
  assert.equal(git(repo, "rev-parse", "HEAD").stdout.trim(), truoc);

  git(repo, "rebase", "main");
  git(repo, "checkout", "--theirs", "src/phi-giao.ts");
  git(repo, "add", "src/phi-giao.ts");
  git(repo, "rebase", "--continue");
  assert.notEqual(git(repo, "rev-parse", "HEAD").stdout.trim(), truoc);
  assert.match(git(repo, "reflog").stdout, new RegExp(truoc.slice(0, 7)));
  git(repo, "reset", "--hard", truoc);
  assert.equal(git(repo, "rev-parse", "HEAD").stdout.trim(), truoc);
});
