// Đo: cùng một ảnh, nén theo các cách khác nhau thì còn bao nhiêu? Chạy: node src/do-nen.ts <file-ảnh.jpg>
import { readFile } from "node:fs/promises";
import exifReader from "exif-reader";
import sharp from "sharp";

import { fitWithin, formatBytes } from "./anh.ts";

const file = process.argv[2];
if (!file) throw new Error("Cách dùng: node src/do-nen.ts <file-ảnh.jpg>");
const goc = await readFile(file);
const meta = await sharp(goc).metadata();
const exif = meta.exif ? exifReader(meta.exif) : undefined;
console.log(`Ảnh gốc: ${meta.width}x${meta.height}, ${formatBytes(goc.length)}, máy: ${exif?.Image?.Make} ${exif?.Image?.Model}, GPS: ${exif?.GPSInfo ? "có" : "không"}`);

const { width, height } = fitWithin(meta.width!, meta.height!);
const cachNen: [string, () => Promise<Buffer>][] = [
  ["JPEG q82, giữ kích thước gốc", () => sharp(goc).jpeg({ quality: 82 }).toBuffer()],
  [`JPEG q82, thu nhỏ còn ${width}x${height}`, () => sharp(goc).resize(width, height).jpeg({ quality: 82 }).toBuffer()],
  [`WebP q82, thu nhỏ còn ${width}x${height}`, () => sharp(goc).resize(width, height).webp({ quality: 82 }).toBuffer()],
  [`AVIF q50, thu nhỏ còn ${width}x${height}`, () => sharp(goc).resize(width, height).avif({ quality: 50 }).toBuffer()],
];
for (const [ten, chay] of cachNen) {
  const batDau = performance.now();
  const ra = await chay();
  const thongTin = await sharp(ra).metadata();
  console.log(`${ten}: ${formatBytes(ra.length)} (${Math.round(performance.now() - batDau)} ms, còn EXIF: ${thongTin.exif ? "có" : "không"})`);
}
