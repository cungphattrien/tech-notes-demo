#!/usr/bin/env bash
# Dựng một kho Git để luyện tập bài này: nhánh main có code của tập 1 (đã sửa lỗi sập trang),
# còn thư mục làm việc chứa bản sửa giá + test của tập 2–3, CHƯA commit, kèm vài thứ để quên.
# Cách dùng: bash tao-kho-thu.sh <thư-mục-đích>
set -euo pipefail
DICH="${1:?Cần thư mục đích, ví dụ: bash tao-kho-thu.sh ~/don-hang-moc}"
GOC="$(cd "$(dirname "$0")/.." && pwd)"

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

# Thay đổi của tập 2–3, chưa commit.
cp "$GOC/03-test-vitest/src/"*.ts src/
cp "$GOC/03-test-vitest/package.json" "$GOC/03-test-vitest/package-lock.json" .
cp -r "$GOC/03-test-vitest/test-sai" .
mkdir -p .vscode && cp "$GOC/02-debug-breakpoint/.vscode/launch.json" .vscode/
# Một dòng log để quên từ lúc debug.
sed -i 's|^const orders = rawOrders.map(normalizeOrder);|const orders = rawOrders.map(normalizeOrder);\nconsole.log("DEBUG don 1044:", orders[3]);|' src/server.ts
echo "Đã dựng kho thử ở $DICH (kho từ xa giả lập: $DICH.git)"
