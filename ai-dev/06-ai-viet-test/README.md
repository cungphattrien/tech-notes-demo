# Tập 6 — Để AI viết test, và kiểm tra lại test đó

Thêm test cho `src/bot.ts`, lớp nối app sổ chi tiêu với Telegram mà tập 5 chưa có test nào.

- `src/thu-bot.ts` — đồ nghề dùng chung: bot với `botInfo` giả, transformer chặn lời gọi tới Telegram, update giả.
- `src/bot-yeu.test.ts` — bản test "trông đủ": 3 test xanh nhưng bảo vệ rất ít.
- `src/bot.test.ts` — bản test chặt: 4 test, mỗi test bảo vệ một điều đã từng hỏng hoặc nằm trong spec.
- `dot-bien.ts` — làm hỏng `bot.ts` có chủ đích (mutation testing làm tay) để xem test nào bắt được.
- `src/ham-khong-ton-tai.test.ts` — một test gọi hàm grammY không có (`processUpdate`); chỉ lộ ra khi chạy.

```bash
npm install
node --test src/bot.test.ts src/so-chi-tieu.test.ts src/parse-expense.test.ts   # 27 test
node dot-bien.ts src/bot-yeu.test.ts      # bắt 1/5 chỗ hỏng
node dot-bien.ts src/bot.test.ts          # bắt 5/5 chỗ hỏng
node --test --experimental-test-coverage --test-coverage-include="src/bot.ts" src/bot-yeu.test.ts
node --test src/ham-khong-ton-tai.test.ts # TypeError: ... processUpdate is not a function
```

Cần Node.js 22.18+. Hai bản test là bản mình dựng để minh họa, không trích từ một lần AI cụ thể nào.

Còn lại: AI gọi một hàm không có thật mà test vẫn "viết xong". Tập 7: kiểm chứng code AI viết.
