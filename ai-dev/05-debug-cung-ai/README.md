# Tập 5 — Debug cùng AI: đưa đúng ngữ cảnh

- `PROMPT-DEBUG.md` — prompt debug cho lỗi "sổ chung", theo mẫu: bối cảnh, lỗi, tái hiện, kết quả thật,
  kết quả mong muốn, code liên quan, đã loại trừ, yêu cầu.
- `hai-nguoi-dung.ts` — tái hiện lỗi không cần token: hai người nhắn, người thứ nhất hỏi /tong.
- `src/bot.ts` — đã sửa: mỗi người dùng Telegram một cuốn sổ (`Map` theo `ctx.from.id`). `taoBot` không còn
  nhận tham số `so`.
- `thu-offline.ts`, `src/chay-bot.ts` — cập nhật theo chữ ký mới của `taoBot`.

```bash
TZ=UTC node hai-nguoi-dung.ts            # sau khi sửa: /tong chỉ còn 1 khoản, 35.000đ
TZ=UTC node src/so-chi-tieu.test.ts      # 7 test
TZ=UTC node src/parse-expense.test.ts    # 16 test
TZ=UTC node thu-offline.ts
```

Cần Node.js 22.18+. Node chạy thẳng `.ts` bằng cách bỏ phần kiểu, không kiểm tra kiểu.

Còn lại: không có test nào cho `bot.ts`. Lần sửa này đổi chữ ký `taoBot` và làm hỏng `thu-offline.ts`
mà cả 23 test vẫn xanh. Tập 6: để AI viết test, và kiểm tra lại test đó.
