# Tập 6 — RAG: cho agent đọc đúng đoạn chính sách

`chinh-sach.md` là chính sách mẫu của quán Mộc (minh họa, 14 đoạn). Thay vì gửi cả tài liệu ở mỗi lần gọi,
chương trình tách tài liệu thành đoạn, tìm các đoạn khớp với câu hỏi bằng từ khóa rồi chỉ gửi các đoạn đó.

```bash
npm install
node src/thu-tim.ts                                  # đoạn nào được chọn cho năm câu hỏi (không gọi mô hình)
node src/chay.ts                                     # tìm đoạn + ghép prompt + trả lời, hai câu mẫu
node src/chay.ts "Ly cà phê pha sai, em muốn quán đền tiền"   # hỏi câu của bạn
```

- Có `ANTHROPIC_API_KEY`: gọi Claude thật (`claude-opus-5-5`, effort `low`).
- Không có key (hoặc `MOC_OFFLINE=1`): mô hình giả lập, chỉ đọc lại câu có nhiều từ trùng nhất trong các đoạn được gửi.
  Bước tìm đoạn là code thật ở cả hai chế độ. Chế độ gọi Claude thật chưa được chạy khi viết bài.

Còn lại: tìm bằng từ khóa bỏ sót câu không dùng đúng từ trong tài liệu ("tiền về" so với "hoàn tiền").
