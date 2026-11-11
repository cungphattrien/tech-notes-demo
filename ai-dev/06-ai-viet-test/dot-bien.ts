// "Làm hỏng code có chủ đích" (mutation testing làm tay): mỗi lần sửa một chỗ nhỏ trong bot.ts, rồi chạy một file test.
// Test tốt phải ĐỎ khi code hỏng. Nếu test vẫn xanh, test đó chưa bảo vệ được chỗ vừa bị sửa.
// Dùng: node dot-bien.ts src/bot-yeu.test.ts
import { spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const fileTest = process.argv[2];
if (!fileTest) throw new Error("Cần tên file test, ví dụ: node dot-bien.ts src/bot.test.ts");

// Mỗi mục: tên, đoạn code gốc trong bot.ts, đoạn code hỏng thay vào.
const DOT_BIEN: [string, string, string][] = [
  ["cả bot dùng chung một cuốn sổ (lỗi bài 5)", "const nguoi = ctx.from.id;", "const nguoi = 0;"],
  ["lẫn giây với mili giây (lỗi bài 4)", 'donVi === "giay" ? ctx.message.date * 1000 : ctx.message.date', "ctx.message.date"],
  ['"message:text" thành "message": ảnh cũng vào handler', 'bot.on("message:text"', 'bot.on("message"'],
  ["tin nhắn được sửa cũng bị ghi thêm", 'bot.on("message:text"', 'bot.on(["message:text", "edited_message:text"]'],
  ["bot không còn gọi handleMessage", "await ctx.reply(handleMessage(ctx.message.text, luc, so));", 'await ctx.reply("Đã ghi");'],
];

const THU_MUC = ".dot-bien"; // bản sao tạm của src/, xóa khi xong; bot.ts thật không bị đụng tới
const goc = readFileSync("src/bot.ts", "utf8");
const chay = () => spawnSync(process.execPath, ["--test", `${THU_MUC}/${fileTest.replace(/^src\//, "")}`], { encoding: "utf8" }).status === 0;

console.log(`Kiểm tra ${fileTest}:`);
cpSync("src", THU_MUC, { recursive: true });
console.log(`  code nguyên vẹn: ${chay() ? "xanh (đúng như mong đợi)" : "ĐỎ, sửa test trước đã"}`);
let sot = 0;
for (const [ten, tu, thanh] of DOT_BIEN) {
  if (!goc.includes(tu)) throw new Error(`Không thấy đoạn cần sửa trong bot.ts: ${tu}`);
  writeFileSync(`${THU_MUC}/bot.ts`, goc.replace(tu, thanh));
  const bat = !chay();
  if (bat) sot += 1;
  console.log(`  ${bat ? "bắt được " : "BỎ LỌT   "} ${ten}`);
}
rmSync(THU_MUC, { recursive: true, force: true });
console.log(`  => bắt ${sot}/${DOT_BIEN.length} chỗ hỏng`);
