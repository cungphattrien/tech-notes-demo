# Tập 7 — Trả lời câu hỏi hành vi bằng STAR

Mọi chi tiết về Minh, bạn Hùng, bạn Lan và nhóm đồ án là minh họa.

- `kho-chuyen.md` — kho ba chuyện của Minh, mỗi chuyện bốn dòng STAR.
- `cau-hoi-hanh-vi.md` — tám câu hỏi hành vi thường gặp, mỗi câu dùng chuyện nào.
- `tra-loi-truoc.md` — câu trả lời đầu tiên của Minh cho câu hỏi về mâu thuẫn trong nhóm.
- `tra-loi-sau.md` — bản viết lại theo STAR.
- `kiem-tra-star.ts` — đếm từ từng phần, ước lượng thời lượng nói, cảnh báo khi lệch.

```bash
node kiem-tra-star.ts tra-loi-truoc.md     # 3 cảnh báo về cấu trúc, 1 về "bọn em"
node kiem-tra-star.ts tra-loi-sau.md       # không cảnh báo
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Ngưỡng cảnh báo và tốc độ nói (130 từ/phút) là con số mình tự đặt,
không phải tiêu chuẩn của ai.
