# Tập 4 — Git branch, commit và pull request cho bản sửa đầu tiên

Code không đổi so với tập 3. Tập này đưa bản sửa giá và test vào code chung: tạo nhánh, chia hai commit, đẩy lên, mở pull request.

```bash
bash tao-kho-thu.sh ~/don-hang-moc   # dựng kho luyện tập: main có code tập 1, thư mục làm việc có thay đổi tập 2–3 chưa commit
cd ~/don-hang-moc
git status                           # 2 file sửa, 5 mục chưa theo dõi (gồm .vscode/, test-sai/ và một dòng console.log để quên)
```

Kho "từ xa" là một kho bare nằm cạnh (`~/don-hang-moc.git`), thay cho GitHub, nên `git push` chạy được mà không cần tài khoản.

Các bước trong bài:

```bash
git switch -c fix/gia-don-hang-may-cu
git diff src/server.ts                        # thấy dòng console.log DEBUG, xóa nó đi
git add src/orders.ts src/server.ts           # commit 1: bản sửa
git commit                                    # fix: đọc đúng giá dạng "35.000" của máy bán hàng cũ
npm install && npm test                       # 11 test xanh
git add package.json package-lock.json src/orders.test.ts
git commit                                    # test: thêm Vitest và test khóa lỗi đơn 1044
git push -u origin fix/gia-don-hang-may-cu
```

`MO-TA-PR.md` là mô tả pull request mẫu.

Còn lại: pull request nhận về 12 bình luận. Bài sau: đọc, trả lời và sửa theo code review.
