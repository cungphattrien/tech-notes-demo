// Nén một ảnh: xoay đúng chiều theo EXIF, thu nhỏ tối đa 1600 px, đổi sang WebP. Metadata (máy, GPS) không được giữ lại.
import sharp from "sharp";

import { fitWithin, MAX_IMAGE_WIDTH, pickSmaller } from "./anh.ts";

export type KetQua = { buffer: Buffer; type: string; width: number; height: number; size: number };

export async function nenAnh(input: Buffer, max = MAX_IMAGE_WIDTH): Promise<KetQua> {
  // rotate() không đối số: xoay pixel theo thẻ Orientation của EXIF. Phải làm trước khi bỏ EXIF, nếu không ảnh chụp dọc sẽ nằm ngang.
  const upright = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
  const { width, height } = fitWithin(upright.info.width, upright.info.height, max);
  const resized = width !== upright.info.width;
  const webp = await sharp(upright.data).resize(width, height).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  const optimized: KetQua = { buffer: webp.data, type: "image/webp", width, height, size: webp.data.length };
  const dinhDang = (await sharp(input).metadata()).format;
  const original: KetQua = { buffer: input, type: `image/${dinhDang}`, width: upright.info.width, height: upright.info.height, size: input.length };
  return pickSmaller(original, optimized, resized);
}
