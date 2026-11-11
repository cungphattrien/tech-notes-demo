# Tập 7 — Embedding: cho agent tìm đoạn chính sách theo nghĩa

Tiếp tập 6. Bộ tìm kiếm theo từ khóa bỏ sót câu hỏi không dùng đúng chữ của tài liệu ("đền tiền" so với "hoàn tiền").
Tập này nhúng (embed) từng đoạn và câu hỏi thành vector bằng mô hình `Xenova/multilingual-e5-small`
(chạy trên máy, không cần key), rồi chọn đoạn có vector gần câu hỏi nhất.

```bash
npm install
npx tsx src/thu-nghia.ts      # vector là gì, độ giống giữa ba câu
npx tsx src/so-sanh.ts        # chấm từ khóa / theo nghĩa / kết hợp trên 12 câu hỏi mẫu (đối số: số đoạn, mặc định 2)
npx tsx src/chay.ts           # tìm theo nghĩa + ghép prompt + trả lời
```

- Lần chạy đầu tải mô hình khoảng 120 MB về máy. Cần mạng đúng một lần.
- `@xenova/transformers` 2.17.2 chạy được trên Node 18 trở lên. Bản mới hơn (`@huggingface/transformers`) cần Node 20+ do thư viện `sharp`.
- Không có `ANTHROPIC_API_KEY`: bước trả lời dùng mô hình giả lập như tập 6. Bước tìm đoạn là code thật.
