// Chạy một file .sql trên PostgreSQL (PGlite: PostgreSQL chạy ngay trong Node, không cần cài gì).
// Mỗi lần chạy tạo một database mới: nạp schema.sql và du-lieu-mau.sql, rồi chạy file bạn chỉ định
// và in kết quả theo kiểu psql. Dùng: node chay-sql.mjs bai-1-select.sql
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Dùng: node chay-sql.mjs <file.sql>");
  process.exit(1);
}

const db = new PGlite();
await db.exec(readFileSync("schema.sql", "utf8"));
await db.exec(readFileSync("du-lieu-mau.sql", "utf8"));

const statements = readFileSync(file, "utf8")
  .replace(/^\s*--.*$/gm, "") // bỏ dòng chú thích
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.trim())
  .filter(Boolean);

const show = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace("T", " ");
  return String(value);
};

function printTable(fields, rows) {
  const names = fields.map((f) => f.name);
  const cells = rows.map((row) => names.map((n) => show(row[n])));
  const isNumber = names.map((_, i) => cells.length > 0 && cells.every((r) => /^-?\d+(\.\d+)?$/.test(r[i])));
  const widths = names.map((n, i) => Math.max([...n].length, ...cells.map((r) => [...r[i]].length)));
  const pad = (text, i, right) => {
    const gap = widths[i] - [...text].length;
    return right ? " ".repeat(gap) + text : text + " ".repeat(gap);
  };
  const center = (text, i) => {
    const gap = widths[i] - [...text].length;
    const left = Math.floor(gap / 2);
    return " ".repeat(left) + text + " ".repeat(gap - left);
  };
  console.log(" " + names.map((n, i) => center(n, i)).join(" | "));
  console.log(widths.map((w) => "-".repeat(w + 2)).join("+"));
  for (const r of cells) console.log(" " + r.map((c, i) => pad(c, i, isNumber[i])).join(" | ").trimEnd());
  console.log(`(${rows.length} ${rows.length === 1 ? "row" : "rows"})`);
}

for (const sql of statements) {
  console.log(`sql> ${sql.replace(/\s+/g, " ")};`);
  try {
    const result = await db.query(sql);
    const verb = sql.split(/\s+/)[0].toUpperCase();
    if (result.fields.length > 0) printTable(result.fields, result.rows);
    if (verb === "INSERT") console.log(`INSERT 0 ${result.affectedRows}`);
    else if (verb === "UPDATE" || verb === "DELETE") console.log(`${verb} ${result.affectedRows}`);
    else if (result.fields.length === 0) console.log(verb);
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
  }
  console.log();
}
