// Hai cách làm bảng đăng ký bản tin, chạy trên Postgres thật (PGlite chạy ngay trong Node, không cần Supabase).
// Chạy: node chay.ts
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

async function dungMoiTruong() {
  const db = new PGlite();
  await db.exec(readFileSync("moi-truong.sql", "utf8"));
  return db;
}

const loi = async (viec: () => Promise<unknown>) => {
  try {
    await viec();
    return "không lỗi";
  } catch (e) {
    const err = e as { message: string; code?: string };
    return `lỗi ${err.code}: ${err.message}`;
  }
};

// ---------- Cách 1: cho trình duyệt ghi thẳng vào bảng ----------
console.log("=== Cách 1: bảng cho vai trò anon insert và select thẳng ===");
{
  const db = await dungMoiTruong();
  await db.exec(`
    create table public.subscribers (id bigint generated always as identity primary key, email text unique not null);
    alter table public.subscribers enable row level security;
    create policy "ai cũng thêm được" on public.subscribers for insert to anon with check (true);
    create policy "ai cũng đọc được"  on public.subscribers for select to anon using (true);
    grant insert, select on public.subscribers to anon;
  `);
  await db.exec("set role anon");
  for (const email of ["an@example.com", "binh@example.com", "chi@example.com"]) {
    await db.query("insert into public.subscribers (email) values ($1)", [email]);
  }
  // Một người lạ, chỉ có khóa công khai của trang, đọc cả danh sách:
  const lo = await db.query("select email from public.subscribers order by id");
  console.log("Người lạ đọc được:", lo.rows.map((r) => (r as { email: string }).email).join(", "));
}

// ---------- Cách 2: migration thật của blog ----------
console.log("\n=== Cách 2: migration thật của blog (chỉ gọi hàm subscribe) ===");
{
  const db = await dungMoiTruong();
  await db.exec(readFileSync("migration.sql", "utf8"));
  await db.exec("set role anon");

  console.log("anon select trực tiếp:", await loi(() => db.query("select * from public.subscribers")));
  console.log("anon đăng ký 'An@Example.com ':", await loi(() => db.query("select public.subscribe($1, $2)", ["An@Example.com ", "/bai-viet/lam-blog-ca-nhan-0d"])));
  console.log("anon đăng ký lại 'an@example.com':", await loi(() => db.query("select public.subscribe($1)", ["an@example.com"])));
  console.log("anon đăng ký email sai 'khong-phai-email':", await loi(() => db.query("select public.subscribe($1)", ["khong-phai-email"])));

  await db.exec("reset role");
  const hang = (await db.query("select email, source, status, unsubscribe_token from public.subscribers")).rows as {
    email: string; source: string; status: string; unsubscribe_token: string;
  }[];
  console.log("Tác giả thấy:", hang.map(({ email, source, status }) => ({ email, source, status })));

  await db.exec("set role anon");
  console.log("Hủy đăng ký bằng token:", (await db.query("select public.unsubscribe($1) as ok", [hang[0].unsubscribe_token])).rows);
  await db.exec("reset role");
  console.log("Trạng thái sau khi hủy:", (await db.query("select status, unsubscribed_at is not null as co_gio_huy from public.subscribers")).rows);

  await db.exec("set role anon");
  await db.query("select public.subscribe($1)", ["an@example.com"]);
  await db.exec("reset role");
  console.log("Đăng ký lại sau khi hủy:", (await db.query("select status, unsubscribed_at from public.subscribers")).rows);

  // Chặn tràn: 30 lượt trong một phút là đủ, lượt thứ 31 bị từ chối.
  await db.exec("set role anon");
  let tuChoiLanThu = 0;
  for (let i = 2; i <= 40; i++) {
    const kq = await loi(() => db.query("select public.subscribe($1)", [`nguoi${i}@example.com`]));
    if (kq !== "không lỗi") {
      tuChoiLanThu = i;
      console.log(`Lượt đăng ký thứ ${i} trong một phút:`, kq);
      break;
    }
  }
  await db.exec("reset role");
  console.log("Số dòng trong bảng:", (await db.query("select count(*)::int as n from public.subscribers")).rows, "(lượt bị từ chối:", tuChoiLanThu + ")");
}
