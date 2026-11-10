// Bật RLS nhưng chưa viết policy nào: anon được phép select, nhưng không thấy dòng nào.
import { demBai, taoDb, voiVaiAnon } from "./gia-lap-supabase.mjs";

const db = await taoDb(2);
await db.exec(`
  grant select on public.posts to anon;
  alter table public.posts enable row level security;
`);

await voiVaiAnon(db, "anon đếm số bài", "select count(*)::int as so_bai from public.posts");
console.log(`Số bài thật sự có trong bảng: ${await demBai(db)}`);
