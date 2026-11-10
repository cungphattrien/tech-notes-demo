# Tập 4 — Dùng AI đọc hiểu thư viện lạ (grammY) trước khi viết code

App sổ chi tiêu được nối với Telegram qua grammY 1.46.0. Mỗi dòng trong `src/bot.ts` đều được đối chiếu
với mã nguồn trong `node_modules/grammy/` và chạy thử offline, không cần token hay mạng.

```bash
npm install
TZ=UTC node thu-offline.ts       # 5 update giả, chạy 2 lần: đơn vị thời gian đúng (giây) và sai (mili giây)
TZ=UTC node hai-nguoi-dung.ts    # hai người nhắn cùng một bot: /tong cộng chung cả hai (lỗi để lại cho tập 5)
npx tsc --noEmit --strict --skipLibCheck --module nodenext --allowImportingTsExtensions ban-nhap/thu-tu-tri-nho.ts
                                 # bản nháp AI viết theo trí nhớ: 2 lỗi (botInfo thiếu 6 trường, bot.catch = ...)
BOT_TOKEN=<token từ @BotFather> node src/chay-bot.ts   # chạy bot thật
```

Những chỗ đã đọc trong mã nguồn (grammY 1.46.0):
- `@grammyjs/types/message.d.ts:18` — `date` là Unix time (giây).
- `grammy/out/filter.js:403-407` — `message:text` không khớp tin nhắn được sửa.
- `grammy/out/bot.js:91-100` — error handler mặc định dừng bot; `:383` — `catch` là phương thức.
- `grammy/out/bot.js:222-226` — `handleUpdate` cần `botInfo`.

Cần Node.js 22.18+.

Còn lại: cả bot dùng chung một cuốn sổ, nên `/tong` của người này tính cả khoản chi của người khác. Tập 5: debug cùng AI.
