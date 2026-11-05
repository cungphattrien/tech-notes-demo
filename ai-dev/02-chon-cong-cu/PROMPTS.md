# Cùng một việc, giao cho ba kiểu công cụ

Việc: sửa lỗi "35 nghìn" và thêm lệnh `/tong`, theo SPEC.md v1.1. Spec đã sửa trước, test viết trước.

## Prompt dùng chung (chat trong Copilot / Cursor, hoặc gõ vào Claude Code)

```
Đọc SPEC.md (v1.1). Có hai thay đổi so với v1: mục "Quy tắc đọc số tiền" thêm nghìn/ngàn/triệu,
và mục "Lệnh /tong" mới.
1. Test đã có trong src/parse-expense.test.ts và src/so-chi-tieu.test.ts. Đừng sửa test.
2. Sửa src/parse-expense.ts và viết src/so-chi-tieu.ts để mọi test qua. Không dùng thư viện ngoài.
3. Chạy cả hai file test với TZ=UTC và dán kết quả.
Nếu spec có chỗ chưa rõ, hỏi lại trước khi viết code.
```

## Khác nhau ở chỗ nào

- Gợi ý khi gõ (Copilot, Tab của Cursor): bạn tự viết `so-chi-tieu.ts`, công cụ gợi ý từng dòng. Bạn quyết định mọi thứ, nhưng tự chạy test.
- Agent trong editor (agent mode của Copilot, agent của Cursor): công cụ sửa nhiều file, bạn duyệt từng thay đổi trong editor.
- Agent trong terminal (Claude Code): công cụ đọc file, sửa, tự chạy lệnh test, rồi báo kết quả. Bạn đọc diff cuối cùng.

Code trong thư mục này được làm bằng Claude Code với đúng prompt trên.
