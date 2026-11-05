# Tập 2 — Chọn công cụ AI cho side project

Việc dùng để so sánh: sửa lỗi "35 nghìn" (tập 1) và thêm lệnh `/tong`.

- `SPEC.md` — spec v1.1: thêm nghìn/ngàn/triệu, thêm quy tắc cho `/tong` (tháng theo giờ Việt Nam).
- `PROMPTS.md` — prompt dùng chung, và ba kiểu làm việc: gợi ý khi gõ, agent trong editor, agent trong terminal.
- `src/parse-expense.ts` + test — 16 test (11 cũ + 5 mới).
- `src/so-chi-tieu.ts` + test — ghi khoản chi, lệnh `/tong`, 5 test, có ca ranh giới tháng giữa giờ VN và UTC.

```bash
TZ=UTC node src/parse-expense.test.ts   # 16 test
TZ=UTC node src/so-chi-tieu.test.ts     # 5 test
```

Chạy với `TZ=UTC` để giống máy chủ thật (Vercel, GitHub Actions đều chạy theo giờ UTC). Cần Node.js 22.18+.

Còn lại: code chạy được, test qua, nhưng bạn có giải thích được `Intl.DateTimeFormat(... timeZone ...)` làm gì không? Tập 3: các mẫu prompt dùng hằng ngày.
