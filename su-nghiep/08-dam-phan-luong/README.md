# Tập 8 — Đàm phán lương lần đầu

Mọi chi tiết về Minh, công ty A, chị Hạnh, thư mời và các con số lương là minh họa. Tiếp tập 7: công ty A gọi báo sẽ gửi offer.

- `thu-moi-v2.json` — thư mời sau khi hai bên thống nhất (minh họa). `thu-moi.json` — thư mời nhận việc của công ty A (minh họa): 10 triệu/tháng, thử việc 85% từ 01/12/2026 đến 31/01/2027.
- `kiem-offer.ts` — kiểm tra thư mời theo Điều 25 (thử việc tối đa 60 ngày) và Điều 26 (lương thử việc ít nhất 85%) của Bộ luật Lao động 2019, kèm checklist các mục nên hỏi lại.
- `so-sanh-offer.ts` — so sánh 4 phương án: tổng lương gộp 12 tháng đầu và lương thực nhận ước tính sau thử việc (trừ 10,5% bảo hiểm; chỉ tính khi không phải nộp thuế TNCN).
- `email-dam-phan.md` — email phản hồi thư mời của Minh.
- `tinh-toan.test.ts` — 6 test.

```bash
node kiem-offer.ts thu-moi.json
node kiem-offer.ts thu-moi-v2.json
node so-sanh-offer.ts
node --test tinh-toan.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Quy định về thử việc, bảo hiểm và thuế có thể thay đổi: mình không phải luật sư, hãy đối chiếu văn bản hiện hành. Tỷ lệ bảo hiểm 10,5% và mức giảm trừ 15,5 triệu/tháng là con số mình tra ngày 12/11/2026 từ các bài tổng hợp, không phải từ văn bản gốc.
