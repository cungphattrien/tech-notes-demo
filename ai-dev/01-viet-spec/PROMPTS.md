# Hai cách nhờ AI viết cùng một hàm

## Prompt mơ hồ

```
Viết cho mình hàm parse tin nhắn chi tiêu kiểu "cà phê 35k" trong TypeScript.
```

AI phải tự đoán: "1tr2" là bao nhiêu? "45.000" là 45 hay 45 nghìn? Tin nhắn không có số thì trả về gì —
`null`, ném lỗi, hay số 0? Có dùng thư viện không? Mỗi lần hỏi lại có thể ra một kiểu đoán khác.

## Prompt kèm spec

```
Đọc SPEC.md, mục "Quy tắc đọc số tiền".
1. Viết test bằng node:test cho từng dòng trong bảng (file src/parse-expense.test.ts).
2. Viết hàm parseExpense(message: string): { note: string; amount: number } | null
   trong src/parse-expense.ts để mọi test qua. Không dùng thư viện ngoài.
3. Chạy `node --test src/parse-expense.test.ts` và dán kết quả.
Nếu spec có chỗ chưa rõ, hỏi lại trước khi viết code.
```

Kết quả: AI có tiêu chí "đúng" rõ ràng (các test), và mình kiểm tra được bằng một lệnh.
