# Tập 13 — Test và CI cho blog

Tiếp tập 12. Blog đã có form đăng ký bản tin, và mỗi lần sửa code lại thấy lo làm hỏng chỗ khác. Tập này dùng chính các hàm của form bản tin (`src/ban-tin.ts`, chép từ tập 12) để thấy: bộ test xanh chưa chắc bảo vệ được gì, cách kiểm bằng "làm hỏng code có chủ đích", và một workflow GitHub Actions chạy kiểm kiểu + test mỗi lần đẩy code.

**Lưu ý quan trọng:** mình không chạy được GitHub Actions trên máy. `.github/workflows/ci.yml` chỉ được kiểm bằng `kiem-ci.ts` (vài quy tắc mình tự đặt) và bằng việc từng lệnh trong đó chạy được trên máy. Workflow gốc của blog Tech Notes (`.github/workflows/ci.yml` trong repo blog) là bản dài hơn (thêm kiểm governance, lint, build và npm audit). Tập này không có Playwright (blog chưa dùng Playwright).

- `src/ban-tin.ts`: bốn hàm thuần của form đăng ký.
- `src/ban-tin.so-khai.test.ts` (5 test, "đường đẹp") và `src/ban-tin.test.ts` (23 test, ranh giới và ca đặc biệt).
- `lam-hong.ts`: sửa `ban-tin.ts` một chỗ nhỏ, chạy test, xem có test nào đỏ. 10 lỗi cố ý.
- `.github/workflows/ci.yml`, `kiem-ci.ts`, `kiem-ci.test.ts` (4 test), `vi-du-loi/ci-loi.yml`.

```bash
npm install
npm test                                        # 32 test
node lam-hong.ts src/ban-tin.so-khai.test.ts    # 2/10 bị bắt
node lam-hong.ts src/ban-tin.test.ts            # 9/10 bị bắt
node kiem-ci.ts .github/workflows/ci.yml
node kiem-ci.ts vi-du-loi/ci-loi.yml
```

Cần Node.js 22.18+. Vitest 5.1.0.
