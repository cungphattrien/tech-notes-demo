// Dựng một database giống Supabase ở mức tối thiểu, bằng PGlite (Postgres thật chạy trong Node).
// Supabase có sẵn hai vai anon, authenticated và hai hàm auth.jwt(), auth.uid(); ở đây mình tự tạo.
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

// Trên Supabase, mỗi request mang một JWT. Lớp API giải mã nó, đặt nội dung (claims) vào thiết lập
// request.jwt.claims của phiên, rồi mới chạy câu SQL. auth.jwt() chỉ đọc lại thiết lập đó.
const GIA_LAP_AUTH = `
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  grant usage on schema auth to anon, authenticated;
  create function auth.jwt() returns jsonb language sql stable as $$
    select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
`;

// soMigration: chạy bao nhiêu file migration đầu tiên (theo thứ tự tên), rồi chạy seed.sql.
// sqlThem: một file SQL chạy thêm sau cùng, dùng để thử một bộ policy chưa đưa vào migration.
export async function taoDb(soMigration, sqlThem) {
  const db = new PGlite();
  await db.exec(GIA_LAP_AUTH);
  for (const file of readdirSync("supabase/migrations").sort().slice(0, soMigration)) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  }
  await db.exec(readFileSync("supabase/seed.sql", "utf8"));
  if (sqlThem) await db.exec(readFileSync(sqlThem, "utf8"));
  return db;
}

// Chạy một câu SQL như thể nó đến từ một người cụ thể. claims = null là người chưa đăng nhập (vai anon);
// có claims là người đã đăng nhập (vai authenticated) với đúng nội dung JWT đó.
// Trả về một chuỗi ngắn: kết quả, số dòng bị ảnh hưởng, hoặc lỗi của Postgres.
export async function chayVoi(db, claims, sql) {
  await db.query("select set_config('request.jwt.claims', $1, false)", [claims ? JSON.stringify(claims) : ""]);
  await db.exec(`set role ${claims ? "authenticated" : "anon"}`);
  try {
    const kq = await db.query(sql);
    if (kq.rows.length > 0) return kq.rows.map((r) => Object.values(r).join(" | ")).join("; ");
    return `${kq.affectedRows ?? 0} dòng`;
  } catch (error) {
    return `LỖI ${error.message}`;
  } finally {
    await db.exec("reset role");
  }
}
