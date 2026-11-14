# Tập 14 — Sau 2 tuần làm cùng AI: workflow giữ được tư duy

Tiếp tập 13. Mọi thứ đã nhanh hơn nhờ tự động hóa, nên câu hỏi còn lại là: mình có còn hiểu code mà AI viết ra không? Tập này có hai công cụ nhỏ cho hai thói quen: nhìn diff trước khi chấp nhận (`kiem-diff.ts`) và đoán trước khi AI làm (`du-doan.ts`).

**Lưu ý quan trọng:**
- Không có AI nào được chạy ở tập này. `kiem-diff.ts` chỉ nhìn danh sách file và số dòng (`git diff --numstat`), **không đọc nội dung**, nên không biết code đúng hay sai.
- Chạy `kiem-diff.ts` trên lịch sử Git thật của repo demo này cho kết quả thật; nhưng các thay đổi trong repo demo thường thêm cả thư mục mới (nên `package.json` mới bị báo "file nhạy cảm" là nhiễu).
- Các mục trong ví dụ `du-doan.ts` trong bài là minh họa, không phải số đo của ai.

- `kiem-diff.ts`: năm dấu hiệu (sửa code không kèm test, xóa test, diff lớn, file nhạy cảm, nhiều file). Ngưỡng 300 dòng và 20 file do mình tự đặt.
- `du-doan.ts`: sổ đoán trước (JSON Lines), có `ghi`, `chot`, `tong-ket`.
- `kiem-diff.test.ts`: 13 test cho cả hai.

```bash
node kiem-diff.ts ../.. --lich-su ai-dev      # các commit của thư mục ai-dev trong repo demo
node kiem-diff.ts ../.. <mã-commit>
SO_DU_DOAN=so.jsonl node du-doan.ts ghi "Thêm lệnh /xoa" "AI sẽ thêm một hàm xóa khoản chi cuối cùng và test cho nó"
node du-doan.ts chot 1 dung
node du-doan.ts tong-ket
npm test
```

Cần Node.js 22.18+ và Git. Không cần `npm install`.
