#!/usr/bin/env bash
# Dựng kho Git ở đúng trạng thái cuối bài trước: nhánh fix/gia-don-hang-may-cu có hai commit,
# đã đẩy lên kho "từ xa" giả lập, đang chờ review.
# Cách dùng: bash tao-kho-thu.sh <thư-mục-đích>
set -euo pipefail
DICH="${1:?Cần thư mục đích, ví dụ: bash tao-kho-thu.sh ~/don-hang-moc}"
GOC="$(cd "$(dirname "$0")/.." && pwd)"
toi() { git -c user.name="Bạn" -c user.email="ban@moc.example" "$@"; }

mkdir -p "$DICH" "$DICH.git"
git init -q --bare -b main "$DICH.git"          # kho "từ xa" giả lập, thay cho GitHub
cd "$DICH"
git init -q -b main
git remote add origin "$DICH.git"

# Hai commit có sẵn trên main.
cp -r "$GOC/01-doc-stack-trace/data" "$GOC/01-doc-stack-trace/src" .
printf 'node_modules/\n' > .gitignore
git add . && git -c user.name="Tuấn" -c user.email="tuan@moc.example" commit -q -m "Hệ thống đơn hàng: danh sách đơn và tổng tiền"
git commit -q --allow-empty -m "fix: trang đơn hàng không sập khi đơn tại quầy thiếu khách hàng"
git push -q -u origin main

# Hai commit của pull request ở bài trước.
git switch -q -c fix/gia-don-hang-may-cu
cp "$GOC/03-test-vitest/src/orders.ts" "$GOC/03-test-vitest/src/server.ts" src/
git add src/orders.ts src/server.ts
toi commit -q -m 'fix: đọc đúng giá dạng "35.000" của máy bán hàng cũ'
cp "$GOC/03-test-vitest/src/orders.test.ts" src/
cp "$GOC/03-test-vitest/package.json" "$GOC/03-test-vitest/package-lock.json" .
git add package.json package-lock.json src/orders.test.ts
toi commit -q -m "test: thêm Vitest và test khóa lỗi đơn 1044"
git push -q -u origin fix/gia-don-hang-may-cu
echo "Đã dựng kho thử ở $DICH, đang ở nhánh $(git branch --show-current)"
