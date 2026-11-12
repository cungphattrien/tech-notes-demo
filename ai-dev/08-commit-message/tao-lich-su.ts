// Dựng hai kho Git tạm (trong thư mục tạm của hệ điều hành) cho cùng một buổi tối làm tính năng "sửa tin nhắn":
// một kho commit lộn xộn, một kho commit gọn có phần thân giải thích. Chạy: node tao-lich-su.ts <thư-mục-đích>
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dich = process.argv[2];
if (!dich) throw new Error("Cách dùng: node tao-lich-su.ts <thư-mục-đích>");

const SPEC_V12 = "# Spec sổ chi tiêu v1.2\n\n- Gửi \"cà phê 25k\" thì bot ghi một khoản chi.\n";
const SPEC_V13 = SPEC_V12.replace("v1.2", "v1.3") + "- Sửa một tin nhắn đã gửi thì khoản chi tương ứng được cập nhật, không ghi thêm.\n";
const NHAN_TIN = 'bot.on("message:text", handleMessage);\n';
const BOT = {
  goc: NHAN_TIN,
  saiBoLoc: NHAN_TIN + 'bot.on("edited_message.text", handleEdit);\n',
  dungBoLoc: NHAN_TIN + 'bot.on("edited_message:text", handleEdit);\n',
  // Tìm khoản chi theo message_id của tin được sửa, không lấy khoản cuối cùng.
  timTheoId: NHAN_TIN + 'bot.on("edited_message:text", handleEdit); // tìm khoản chi theo message_id\n',
};
const TEST = 'test("sửa tin nhắn thì cập nhật khoản chi, không ghi thêm", () => {});\n';
const GHI_CHU = "# Kiểm chứng code AI viết\n\nChạy thử, biên dịch, rồi test. Tìm tên hàm trong code thư viện.\n";

type Buoc = { message: string; files: Record<string, string> };

// Cùng một chuỗi thay đổi, ghi lại theo hai cách.
const LON_XON: Buoc[] = [
  { message: "fix", files: { "src/bot.ts": BOT.saiBoLoc } },
  { message: "sửa lại", files: { "src/bot.ts": BOT.dungBoLoc } },
  { message: "ok", files: { "src/bot.test.ts": TEST } },
  { message: "update", files: { "spec.md": SPEC_V13, "README.md": "# Sổ chi tiêu\n\nXem spec.md.\n" } },
  { message: "fix tiếp", files: { "src/bot.ts": BOT.timTheoId } },
  { message: "xong", files: { "docs/kiem-chung.md": GHI_CHU } },
];

const GON_GANG: Buoc[] = [
  { message: "docs(spec): thêm yêu cầu v1.3, sửa tin nhắn thì cập nhật khoản chi", files: { "spec.md": SPEC_V13 } },
  {
    message: [
      "feat(bot): cập nhật khoản chi khi người dùng sửa tin nhắn",
      "",
      'Telegram gửi tin nhắn được sửa như một update riêng ("edited_message"), nên handler',
      '"message:text" không nhận được. Trước đây bot bỏ qua và khoản chi giữ số tiền cũ.',
      "",
      "Tìm khoản chi theo message_id của tin được sửa, không theo thứ tự: người dùng có thể",
      "sửa một tin cũ chứ không chỉ tin cuối cùng.",
    ].join("\n"),
    files: { "src/bot.ts": BOT.timTheoId },
  },
  { message: "test(bot): thêm test cho việc sửa tin nhắn", files: { "src/bot.test.ts": TEST } },
  { message: "docs: ghi lại cách kiểm chứng code AI viết", files: { "docs/kiem-chung.md": GHI_CHU } },
];

function dungKho(ten: string, cacBuoc: Buoc[]): void {
  const thuMuc = join(dich, ten);
  rmSync(thuMuc, { recursive: true, force: true });
  mkdirSync(join(thuMuc, "src"), { recursive: true });
  mkdirSync(join(thuMuc, "docs"), { recursive: true });
  const git = (...args: string[]) => execFileSync("git", ["-c", "user.name=Minh", "-c", "user.email=minh@example.com", ...args], { cwd: thuMuc, stdio: "pipe" });
  git("init", "-q");
  // Commit đầu tiên của cả hai kho giống nhau: spec v1.2 và bot chưa biết sửa tin nhắn.
  writeFileSync(join(thuMuc, "spec.md"), SPEC_V12);
  writeFileSync(join(thuMuc, "src/bot.ts"), BOT.goc);
  git("add", "-A");
  git("commit", "-q", "-m", "chore: khởi tạo kho với bot ghi khoản chi");
  for (const buoc of cacBuoc) {
    for (const [file, noiDung] of Object.entries(buoc.files)) writeFileSync(join(thuMuc, file), noiDung);
    git("add", "-A");
    git("commit", "-q", "-m", buoc.message);
  }
}

dungKho("lon-xon", LON_XON);
dungKho("gon-gang", GON_GANG);
console.log(`Đã dựng 2 kho trong ${dich}: lon-xon (7 commit gồm commit khởi tạo) và gon-gang (5 commit gồm commit khởi tạo)`);
