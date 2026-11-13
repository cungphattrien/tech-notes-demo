# Tập 10 — Regex và xử lý chuỗi: nhập file CSV đơn cũ lộn xộn

Tiếp tập 9. Báo cáo của quán Mộc đã nhanh, nhưng máy bán hàng cũ còn để lại một file CSV hàng nghìn đơn do nhiều người nhập tay: ngày, số điện thoại, tiền, món đều mỗi người một kiểu. Tập này nhập file đó bằng biểu thức chính quy (regex), và dành riêng một mục cho cái bẫy làm treo máy chủ.

- `src/don-cu.csv`: file mẫu 9 dòng đơn (có BOM và xuống dòng `\r\n` như file xuất từ Excel). Dữ liệu là minh họa.
- `src/csv.ts`: `tachDongCsv`, tách một dòng CSV có ô nằm trong ngoặc kép.
- `src/chuan-hoa.ts`: chuẩn hóa số điện thoại, ngày, tiền và danh sách món bằng regex.
- `src/nhap-csv.ts`: `nhapCsv`, mỗi dòng hoặc thành một đơn hợp lệ hoặc bị loại kèm lý do và dòng gốc.
- `nhap.ts`: in báo cáo nhập. `thu-cach-ngay-tho.ts`: hai cách làm đầu tiên (sai). `thu-redos.ts`: biểu thức chính quy gây treo. `do-toc-do.ts`: nhập 3.600 dòng.
- `src/nhap-csv.test.ts`: 8 test.

```bash
node nhap.ts src/don-cu.csv
node thu-cach-ngay-tho.ts
node thu-redos.ts
node do-toc-do.ts
node --test src/nhap-csv.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Số đo thời gian phụ thuộc máy.
