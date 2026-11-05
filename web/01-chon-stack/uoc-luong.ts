// Ước lượng: gói Supabase Free (database 500 MB, file storage 1 GB) chứa được bao nhiêu bài?
//
//   node uoc-luong.ts                  # dùng số mặc định
//   node uoc-luong.ts bai-mau.md       # đo một bài Markdown thật của bạn
import { readFileSync } from "node:fs";

const MB = 1024 * 1024;
const LIMITS = { databaseMb: 500, storageMb: 1024 }; // supabase.com/pricing, gói Free (11/2026)

// Số đo thật từ bài nháp của Tech Notes: 1.302 chữ ≈ 7.972 byte (tiếng Việt có dấu tốn 2–3 byte/ký tự).
const MEASURED = { words: 1302, bytes: 7972 };

const file = process.argv[2];
const bytesPerWord = file
  ? Buffer.byteLength(readFileSync(file, "utf8")) / readFileSync(file, "utf8").split(/\s+/).filter(Boolean).length
  : MEASURED.bytes / MEASURED.words;

// Giả định (đổi tùy blog của bạn):
const WORDS_PER_POST = 3000; // bài dài kiểu hướng dẫn
const OVERHEAD = 2; // nhân đôi cho tiêu đề, mô tả, chỉ mục, phiên bản cũ… (ước lượng dè dặt)
const IMAGES_PER_POST = 3;
const PHOTO_MB = 4; // ảnh chụp điện thoại chưa nén (ví dụ)
const COMPRESSED_KB = 300; // cùng ảnh sau khi nén WebP, rộng 1600px (ví dụ)

const postBytes = bytesPerWord * WORDS_PER_POST * OVERHEAD;
const fmt = (n: number) => Math.floor(n).toLocaleString("vi-VN");

console.log(`Một chữ ≈ ${bytesPerWord.toFixed(1)} byte → một bài ${WORDS_PER_POST} chữ ≈ ${fmt(postBytes / 1024)} KB (đã tính phụ phí x${OVERHEAD})`);
console.log(`\n1) Chỉ lưu chữ trong database 500 MB: ~${fmt((LIMITS.databaseMb * MB) / postBytes)} bài`);

const rawImages = IMAGES_PER_POST * PHOTO_MB * MB;
console.log(`2) Nhét luôn ${IMAGES_PER_POST} ảnh gốc (${PHOTO_MB} MB/ảnh) vào database: ~${fmt((LIMITS.databaseMb * MB) / (postBytes + rawImages))} bài`);

const compressed = IMAGES_PER_POST * COMPRESSED_KB * 1024;
console.log(`3) Ảnh nén ${COMPRESSED_KB} KB để ở Storage 1 GB, database chỉ lưu đường dẫn:`);
console.log(`   database: ~${fmt((LIMITS.databaseMb * MB) / postBytes)} bài · storage: đủ ảnh cho ~${fmt((LIMITS.storageMb * MB) / compressed)} bài`);
