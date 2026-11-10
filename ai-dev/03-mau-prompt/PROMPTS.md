# 7 mẫu prompt viết code dùng hằng ngày

Thay phần trong `<...>`. Mỗi mẫu có một dòng "kiểm tra": việc bạn tự làm sau khi nhận câu trả lời.

## 1. Hỏi lại trước khi code

```
Đọc <SPEC.md / mô tả việc cần làm>. Chưa viết code.
Liệt kê những chỗ chưa rõ dưới dạng câu hỏi, mỗi câu kèm 2 cách hiểu có thể có và hậu quả của từng cách.
```
Kiểm tra: tự trả lời từng câu, ghi câu trả lời vào spec.

## 2. Tìm ca biên trước khi sửa

```
Với <hàm / lệnh>, liệt kê 10 đầu vào dễ làm sai nhất. Mỗi dòng: đầu vào → kết quả đúng theo <SPEC.md> → vì sao dễ sai.
Chưa sửa code, chưa viết test.
```
Kiểm tra: chạy thử vài đầu vào trên code hiện tại; chọn những dòng thật sự cần.

## 3. Viết test phải đỏ trước

```
Viết test cho các trường hợp <số ...> trong danh sách trên, vào <file test>. Không sửa code.
Chạy test và dán kết quả: các test mới phải ĐỎ trên code hiện tại. Test nào xanh ngay thì nói rõ.
```
Kiểm tra: test mới có đỏ không, và đỏ đúng lý do không.

## 4. Sửa code mà không sửa test

```
Sửa <file code> để mọi test trong <file test> qua. Không sửa test, không thêm thư viện.
Chạy toàn bộ test <kèm điều kiện, ví dụ TZ=UTC> và dán kết quả.
```
Kiểm tra: tự chạy lại test; xem diff có đụng tới file test không.

## 5. Giải thích để mình hiểu, kèm cách kiểm chứng

```
Giải thích <hàm> cho một người mới, từng dòng.
Với mỗi khẳng định, đưa kèm một lệnh chạy được (ví dụ node -e "...") để mình tự kiểm chứng.
Chỗ nào bạn không chắc, nói là không chắc.
```
Kiểm tra: chạy từng lệnh; khẳng định nào không có lệnh kiểm chứng thì chưa tin.

## 6. Review như một senior khó tính

```
Review <file> như một senior khó tính. Liệt kê vấn đề theo mức độ nghiêm trọng.
Mỗi vấn đề: dòng nào, hậu quả cụ thể (đầu vào nào → sai thế nào), cách kiểm chứng. Không sửa code.
```
Kiểm tra: tái hiện từng vấn đề (đo, chạy thử) trước khi đồng ý sửa.

## 7. Refactor mà không đổi hành vi

```
Sửa đúng vấn đề <số ...> trong review trên, không làm gì khác.
Không đổi hành vi: mọi test cũ phải qua, không sửa test. Dán kết quả test trước và sau khi sửa.
```
Kiểm tra: đọc diff, chạy test, đo lại nếu là vấn đề hiệu năng.
