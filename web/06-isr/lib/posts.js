import { readFileSync } from "node:fs";
import { join } from "node:path";

let soLanHoi = 0;
const docFile = () => JSON.parse(readFileSync(join(process.cwd(), "data", "posts.json"), "utf8"));

// Thay cho một truy vấn Supabase: đọc file, chờ 150 ms cho giống đi qua mạng, và đếm số lần bị gọi.
// Mỗi lần được gọi, nó in một dòng ra terminal của máy chủ.
export async function layBai(slug) {
  soLanHoi += 1;
  console.log(`[db] lần hỏi thứ ${soLanHoi}: bài "${slug}"`);
  await new Promise((xong) => setTimeout(xong, 150));
  return docFile().find((bai) => bai.slug === slug) ?? null;
}

export async function layTatCaSlug() {
  return docFile().map((bai) => bai.slug);
}
