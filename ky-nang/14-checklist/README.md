# Tập 14 — Nhìn lại 2 tuần: checklist khi nhận một dự án cũ

Tiếp tập 13. Sau 13 tập sửa hệ thống đơn hàng của quán Mộc (nhân vật minh họa), tập này gom những gì đã làm thành một danh sách câu hỏi để hỏi **trước** khi sửa dòng code đầu tiên của một dự án mới nhận, và một bản nháp ghi chú bàn giao khi mình rời dự án.

**Lưu ý quan trọng:** `kiem-du-an.ts` chỉ đọc file và chỉ thấy những gì nó được viết để thấy (11 câu). Mẫu tìm khóa bí mật chỉ gồm vài dạng quen thuộc. Nó không chạy code của dự án và không đánh giá code tốt hay xấu. `ban-giao.ts` không biết lý do các quyết định hay ai là người liên hệ, nên không bịa ra chúng.

- `kiem-du-an.ts` (+ 13 test): 11 câu, mỗi câu trả lời đạt / thiếu / cảnh báo / không áp dụng. Trong kho Git thì chỉ xét file mà người clone sẽ có.
- `ban-giao.ts` (+ 6 test): sinh bản nháp bàn giao từ `package.json`, `git log` và kết quả của `kiem-du-an.ts`.

```bash
node kiem-du-an.ts ../00-ban-dau        # dự án lúc mới nhận (tập 0): 4/10
node kiem-du-an.ts ../13-readme         # dự án sau 13 tập: 10/11
node kiem-du-an.ts <thư-mục-dự-án-của-bạn>
node ban-giao.ts ../13-readme --lich-su ..
npm test                                # 19 test
```

Cần Node.js 22.18+ và Git. Không cần `npm install`.
