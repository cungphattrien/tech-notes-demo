// Bộ test đầu tiên: mỗi hàm một ví dụ "đường đẹp". Chạy xanh, nhưng chưa chắc bảo vệ được gì (xem lam-hong.ts).
import { describe, expect, it } from "vitest";
import { emailProblem, looksAutomated, normalizeEmail, signupSource } from "./ban-tin.ts";

describe("ban-tin (sơ khai)", () => {
  it("chuẩn hóa email", () => {
    expect(normalizeEmail("  An@Example.com ")).toBe("an@example.com");
  });
  it("email hợp lệ không có vấn đề", () => {
    expect(emailProblem("an@example.com")).toBeNull();
  });
  it("email sai bị báo", () => {
    expect(emailProblem("khong-co-a-cong")).toBe("emailInvalid");
  });
  it("robot điền ô bẫy bị nhận ra", () => {
    expect(looksAutomated({ honeypot: "http://spam", startedAt: "0", now: 10_000 })).toBe(true);
  });
  it("nguồn đăng ký là đường dẫn trong site", () => {
    expect(signupSource("/bai-viet/abc")).toBe("/bai-viet/abc");
  });
});
