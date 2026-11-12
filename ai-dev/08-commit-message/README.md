# Tập 8 — Commit message và mô tả pull request cùng AI

Tiếp tập 7. Làm xong tính năng sửa tin nhắn trong một buổi tối, lịch sử Git chỉ có "fix", "ok", "xong". Tập này dựng lại cùng một chuỗi thay đổi theo hai cách ghi, rồi cho thấy cách nhờ AI viết commit message mà không mất ý nghĩa.

- `tao-lich-su.ts`: dựng hai kho Git tạm (`lon-xon`, `gon-gang`) trong thư mục bạn chỉ định.
- `kiem-commit.ts`: kiểm tra từng commit theo vài quy tắc mình tự đặt (tiêu đề mơ hồ, dạng `kiểu(phạm vi): mô tả`, độ dài, thân giải thích vì sao).
- `tao-prompt.ts`: dựng prompt nhờ AI viết commit message từ `git diff --staged` và ý định của bạn. Không gọi AI.
- `kiem-commit.test.ts`: 4 test cho bộ quy tắc.

```bash
mkdir /tmp/kho   # hoặc thư mục tạm bất kỳ
node tao-lich-su.ts /tmp/kho
node kiem-commit.ts /tmp/kho/lon-xon
node kiem-commit.ts /tmp/kho/gon-gang
node --test kiem-commit.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts) và Git. Không cài thêm thư viện nào.
