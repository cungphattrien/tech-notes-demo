# Tập 6 — Vượt vòng phỏng vấn kỹ thuật và live coding

Minh và công ty A là minh họa. Bài luyện là một bài live coding điển hình, giải trong 20 phút.

- `bai-luyen/ban-dau.ts` — bản viết vội trong 6 phút đầu, trước khi hỏi lại đề: sai ở ví dụ đầu tiên.
- `bai-luyen/top-ghi-chu.ts` — bản sau khi hỏi lại đề và đi qua ví dụ bằng tay.
- `bai-luyen/top-ghi-chu.test.ts` — 7 test, mỗi test bảo vệ một luật của đề.

```bash
node bai-luyen/ban-dau.ts                  # bản vội: đếm sai
node bai-luyen/top-ghi-chu.test.ts         # bản sửa: 7 test
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).

Còn lại: sau vòng kỹ thuật là vòng với HR, người hỏi về bản thân Minh chứ không hỏi code. Tập 7.
