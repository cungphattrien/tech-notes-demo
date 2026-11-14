// Bộ test đầy đủ: mỗi quy tắc có ví dụ ở sát hai bên ranh giới, kể cả các ca "không được đổi hành vi".
import { describe, expect, it } from "vitest";
import { MAX_EMAIL_LENGTH, MIN_FILL_MS, emailProblem, looksAutomated, normalizeEmail, signupSource } from "./ban-tin.ts";

describe("normalizeEmail", () => {
  it("bỏ khoảng trắng hai đầu và hạ chữ thường", () => {
    expect(normalizeEmail("  An@Example.com ")).toBe("an@example.com");
  });
  it("giữ nguyên dấu + dùng làm nhãn", () => {
    expect(normalizeEmail("an+blog@example.com")).toBe("an+blog@example.com");
  });
});

describe("emailProblem", () => {
  it.each([
    ["an@example.com", null],
    ["AN@EXAMPLE.COM  ", null],
    ["", "emailMissing"],
    ["   ", "emailMissing"],
    ["khong-co-a-cong", "emailInvalid"],
    ["an@khong-co-cham", "emailInvalid"],
    ["an @example.com", "emailInvalid"],
    ["a@b@example.com", "emailInvalid"],
  ])("%j → %j", (vao, ra) => {
    expect(emailProblem(vao)).toBe(ra);
  });
  it("email dài đúng 254 ký tự thì hợp lệ, 255 thì không", () => {
    const duoi = "@example.com";
    const dung = "a".repeat(MAX_EMAIL_LENGTH - duoi.length) + duoi;
    expect(dung).toHaveLength(254);
    expect(emailProblem(dung)).toBeNull();
    expect(emailProblem("a" + dung)).toBe("emailInvalid");
  });
});

describe("looksAutomated", () => {
  const luc = 1_000_000;
  it("ô bẫy có chữ là robot, dù điền chậm", () => {
    expect(looksAutomated({ honeypot: "http://spam", startedAt: String(luc - 60_000), now: luc })).toBe(true);
  });
  it("ô bẫy chỉ có khoảng trắng thì không tính", () => {
    expect(looksAutomated({ honeypot: "   ", startedAt: String(luc - 60_000), now: luc })).toBe(false);
  });
  it("điền nhanh hơn 1,5 giây là robot, đúng 1,5 giây thì không", () => {
    expect(looksAutomated({ honeypot: "", startedAt: String(luc - (MIN_FILL_MS - 1)), now: luc })).toBe(true);
    expect(looksAutomated({ honeypot: "", startedAt: String(luc - MIN_FILL_MS), now: luc })).toBe(false);
  });
  it("không có mốc giờ thì không phạt người dùng", () => {
    for (const startedAt of ["", "abc", "0", "-5"]) {
      expect(looksAutomated({ honeypot: "", startedAt, now: luc })).toBe(false);
    }
  });
  it("mốc giờ nằm trong tương lai (đồng hồ lệch) thì không phạt", () => {
    expect(looksAutomated({ honeypot: "", startedAt: String(luc + 5_000), now: luc })).toBe(false);
  });
});

describe("signupSource", () => {
  it.each([
    ["/bai-viet/abc", "/bai-viet/abc"],
    ["/", "/"],
    ["https://xau.com/", ""],
    ["//xau.com", ""],
    ["bai-viet", ""],
    ["/co khoang trang", ""],
  ])("%j → %j", (vao, ra) => {
    expect(signupSource(vao)).toBe(ra);
  });
  it("cắt ở 120 ký tự", () => {
    expect(signupSource("/" + "a".repeat(300))).toHaveLength(120);
  });
});
