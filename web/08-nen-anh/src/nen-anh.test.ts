import sharp from "sharp";
import { expect, test } from "vitest";

import { nenAnh } from "./nen-anh.ts";

const anh = (width: number, height: number, orientation?: number) =>
  sharp({ create: { width, height, channels: 3, background: "#3366cc" } }).jpeg().withMetadata(orientation ? { orientation } : {}).toBuffer();

test("ảnh lớn được thu nhỏ còn 1600 px và đổi sang WebP", async () => {
  const ketQua = await nenAnh(await anh(4000, 3000));
  expect(ketQua).toMatchObject({ type: "image/webp", width: 1600, height: 1200 });
});

test("ảnh chụp dọc (Orientation 6) được xoay đúng chiều trước khi bỏ EXIF", async () => {
  const ketQua = await nenAnh(await anh(3000, 2000, 6));
  expect(ketQua.width).toBe(1067);
  expect(ketQua.height).toBe(1600);
  expect((await sharp(ketQua.buffer).metadata()).orientation).toBeUndefined();
});

test("ảnh nhỏ mà nén xong không nhỏ hơn thì giữ bản gốc", async () => {
  const goc = await sharp({ create: { width: 40, height: 40, channels: 3, background: "#fff" } }).webp({ quality: 1, effort: 6 }).toBuffer();
  const ketQua = await nenAnh(goc);
  expect(ketQua.buffer).toBe(goc);
});
