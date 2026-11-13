# Tập 11 — Xử lý merge conflict và rebase không sợ mất code

Tiếp tập 10. Hai người cùng sửa hàm tính phí giao hàng của quán Mộc: bạn thêm phí theo khoảng cách ở nhánh riêng, còn anh Khoa đã gộp vào `main` một khuyến mãi mới. Khi bạn gộp `main` vào nhánh của mình, Git báo xung đột. Tập này dựng đúng tình huống đó trong một repo thật và đi qua từng cách xử lý: `merge`, `rebase`, lệnh abort, và cách cứu khi chọn nhầm.

Mọi tên (quán Mộc, anh Khoa), địa chỉ email và số tiền là minh họa.

- `dung-xung-dot.sh`: dựng repo `moc-xung-dot` có sẵn xung đột (nhánh `feat/phi-giao-theo-km` có 2 commit, `main` có thêm 1 commit của anh Khoa).
- `kiem-tra.ts`: năm phép kiểm cho hàm `tinhPhiGiao`; chép vào thư mục repo, KHÔNG `git add` nó.
- `xung-dot.test.ts`: 7 test, mỗi test dựng một repo mới trong thư mục tạm và kiểm lại từng bước trong bài.

```bash
bash dung-xung-dot.sh
node --test xung-dot.test.ts
```

Cần Git, bash (Git Bash trên Windows) và Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Mã băm commit (như `2b19d91`) khác nhau ở mỗi lần dựng, vì Git tính cả giờ commit.
