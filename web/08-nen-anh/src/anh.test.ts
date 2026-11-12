import { describe, expect, test } from "vitest";

import { fitWithin, formatBytes, pickSmaller, shouldOptimize } from "./anh.ts";

describe("fitWithin", () => {
  test("ảnh lớn thu nhỏ theo cạnh dài, giữ tỉ lệ", () => {
    expect(fitWithin(6000, 4000)).toEqual({ width: 1600, height: 1067 });
    expect(fitWithin(4000, 6000)).toEqual({ width: 1067, height: 1600 });
  });
  test("ảnh nhỏ hơn giới hạn thì giữ nguyên, không phóng to", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
  test("ảnh rất dẹt không bị làm tròn xuống 0", () => {
    expect(fitWithin(16000, 1)).toEqual({ width: 1600, height: 1 });
  });
});

describe("pickSmaller", () => {
  const goc = { size: 100 };
  test("bản nén nhỏ hơn thì dùng bản nén", () => {
    expect(pickSmaller(goc, { size: 60 }, false)).toEqual({ size: 60 });
  });
  test("bản nén nặng hơn và không đổi kích thước thì giữ bản gốc", () => {
    expect(pickSmaller(goc, { size: 130 }, false)).toBe(goc);
  });
  test("đã thu nhỏ kích thước thì dùng bản mới dù nặng hơn", () => {
    expect(pickSmaller(goc, { size: 130 }, true)).toEqual({ size: 130 });
  });
  test("không nén được (null) thì giữ bản gốc", () => {
    expect(pickSmaller(goc, null, true)).toBe(goc);
  });
});

test("GIF không bị nén lại vì có thể là ảnh động", () => {
  expect(shouldOptimize("image/gif")).toBe(false);
  expect(shouldOptimize("image/jpeg")).toBe(true);
});

test("formatBytes", () => {
  expect(formatBytes(900)).toBe("900 B");
  expect(formatBytes(340 * 1024)).toBe("340 KB");
});
