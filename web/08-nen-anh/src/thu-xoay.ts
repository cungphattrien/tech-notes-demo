// Ảnh chụp dọc từ điện thoại thường được lưu thành pixel nằm ngang kèm thẻ EXIF Orientation = 6 ("xoay 90° khi hiển thị").
// Nếu bỏ EXIF mà không xoay pixel trước, ảnh sẽ nằm ngang. Chạy: node src/thu-xoay.ts
import sharp from "sharp";

import { nenAnh } from "./nen-anh.ts";

const anhDoc = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: "#c0392b" } })
  .jpeg().withMetadata({ orientation: 6 }).toBuffer();

const meta = await sharp(anhDoc).metadata();
console.log(`Ảnh gốc: pixel ${meta.width}x${meta.height}, Orientation ${meta.orientation} (trình xem ảnh sẽ hiển thị ${meta.height}x${meta.width})`);

const sai = await sharp(anhDoc).resize({ width: 1600, height: 1600, fit: "inside" }).webp().toBuffer({ resolveWithObject: true });
console.log(`Bỏ EXIF, không xoay: ${sai.info.width}x${sai.info.height}, không còn Orientation nên ảnh hiển thị nằm ngang`);

const dung = await nenAnh(anhDoc);
console.log(`nenAnh (xoay trước): ${dung.width}x${dung.height}`);
