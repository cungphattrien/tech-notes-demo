// Dựng một database giống Supabase ở mức tối thiểu, bằng PGlite (Postgres thật chạy trong Node).
// Supabase tạo sẵn hai vai anon và authenticated; ở đây mình tự tạo để thử được ngay trên máy.
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

// soMigration: chạy bao nhiêu file migration đầu tiên (theo thứ tự tên), rồi chạy seed.sql.
export async function taoDb(soMigration) {
  const db = new PGlite();
  await db.exec("create role anon nologin; create role authenticated nologin;");
  for (const file of readdirSync("supabase/migrations").sort().slice(0, soMigration)) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  }
  await db.exec(readFileSync("supabase/seed.sql", "utf8"));
  return db;
}

// Chạy một câu SQL dưới vai anon (người đọc chưa đăng nhập), rồi trả lại vai ban đầu.
// In ra số dòng trả về / bị ảnh hưởng, hoặc thông báo lỗi của Postgres.
export async function voiVaiAnon(db, moTa, sql) {
  await db.exec("set role anon");
  try {
    const kq = await db.query(sql);
    const chiTiet = kq.rows.length > 0 ? kq.rows.map((r) => Object.values(r).join(" | ")).join("; ") : `${kq.affectedRows ?? 0} dòng bị ảnh hưởng`;
    console.log(`${moTa}: ${chiTiet}`);
  } catch (error) {
    console.log(`${moTa}: LỖI ${error.message}`);
  } finally {
    await db.exec("reset role");
  }
}

export async function demBai(db) {
  const kq = await db.query("select count(*)::int as n from public.posts");
  return kq.rows[0].n;
}
