#!/usr/bin/env bash
# Dựng một kho Git thử, rồi tạo lại bốn commit dọn server.ts theo đúng thứ tự trong bài.
# Cách dùng: bash lam-lai-cac-commit.sh <thư-mục-đích>
set -euo pipefail
DICH="${1:?Cần thư mục đích, ví dụ: bash lam-lai-cac-commit.sh ~/don-hang-moc-06}"
GOC="$(cd "$(dirname "$0")" && pwd)"
toi() { git -c user.name="Bạn" -c user.email="ban@moc.example" "$@"; }

mkdir -p "$DICH/src" && cd "$DICH"
git init -q -b main
cp -r "$GOC/data" "$GOC/package.json" "$GOC/package-lock.json" .
cp "$GOC/ban-dau/server.ts" "$GOC/ban-dau/orders.ts" "$GOC/src/orders.test.ts" src/
printf 'node_modules/\n' > .gitignore
toi add . && toi commit -q -m "Trạng thái sau khi merge bản sửa giá (bài trước)"
git switch -q -c refactor/don-server-ts

cp "$GOC/src/server.test.ts" src/
toi add src/server.test.ts && toi commit -q -m "test: chụp lại hành vi của server.ts trước khi dọn"

# Bước đổi tên: chỉ đổi tên, chưa di chuyển code.
sed -e 's/const dataFile/const ORDERS_FILE/; s/readFileSync(dataFile/readFileSync(ORDERS_FILE/' \
    -e 's/rawOrders/ordersInFile/g; s/const body/const orderListJson/; s/end(body)/end(orderListJson)/' \
    -e 's/(req, res)/(request, response)/; s/req\.url/request.url/; s/res\.writeHead/response.writeHead/g' \
    "$GOC/ban-dau/server.ts" > src/server.ts
cp "$GOC/src/orders.ts" src/orders.ts
toi add src && toi commit -q -m "refactor: đặt tên biến nói rõ nó chứa gì"

cp "$GOC/src/server.ts" "$GOC/src/order-file.ts" "$GOC/src/order-server.ts" src/
toi add src && toi commit -q -m "refactor: tách việc đọc file và dựng máy chủ khỏi server.ts"

cp "$GOC/src/order-file.test.ts" "$GOC/src/order-server.test.ts" src/
toi add src && toi commit -q -m "test: thêm test cho loadOrders và createOrderServer"
echo "Đã dựng kho thử ở $DICH, nhánh $(git branch --show-current)"
