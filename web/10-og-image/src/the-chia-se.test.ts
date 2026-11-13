import { describe, expect, test } from "vitest";

import { docKichThuocPng } from "./png.ts";
import { coChuTieuDe, veTheChiaSe } from "./the-chia-se.tsx";
import { TIEU_DE } from "./tieu-de.ts";

const thongTin = (tieuDe: string) => ({ tieuDe, nhan: "WEB THỰC CHIẾN · Trung cấp", chanTrang: "9 phút đọc" });
const ve = async (tieuDe: string) => {
  const phanHoi = veTheChiaSe(thongTin(tieuDe));
  return { phanHoi, anh: Buffer.from(await phanHoi.arrayBuffer()) };
};

describe("coChuTieuDe", () => {
  test("tiêu đề càng dài, chữ càng nhỏ, đổi cỡ đúng ở ranh giới 40 và 70 ký tự", () => {
    expect([40, 41, 70, 71].map((n) => coChuTieuDe("a".repeat(n)))).toEqual([72, 60, 60, 50]);
  });
});

describe("veTheChiaSe", () => {
  test("trả về PNG với đúng kiểu nội dung", async () => {
    const { phanHoi } = await ve(TIEU_DE.vua);
    expect(phanHoi.status).toBe(200);
    expect(phanHoi.headers.get("content-type")).toBe("image/png");
  });

  test("mọi tiêu đề (kể cả tiêu đề 199 ký tự) cho ảnh 1200x630", async () => {
    for (const tieuDe of Object.values(TIEU_DE)) {
      const { anh } = await ve(tieuDe);
      expect(docKichThuocPng(anh)).toEqual({ rong: 1200, cao: 630 });
    }
  });

  test("ảnh nhẹ hơn 200 KB (nhiều lần dưới giới hạn 8 MB của Facebook)", async () => {
    for (const tieuDe of Object.values(TIEU_DE)) {
      const { anh } = await ve(tieuDe);
      expect(anh.length).toBeLessThan(200 * 1024);
    }
  });
});

describe("docKichThuocPng", () => {
  test("từ chối dữ liệu không phải PNG", () => {
    expect(() => docKichThuocPng(Buffer.from("không phải ảnh, chỉ là chữ thôi nhé"))).toThrow("Không phải file PNG");
  });
});
