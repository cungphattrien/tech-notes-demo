#!/usr/bin/env bash
# Gọi thử API của OrderServer bằng curl. Chạy sau khi server đã khởi động (cổng 8080).
# Dùng: bash thu-api.sh
# Nội dung gửi lên nằm trong file UTF-8 (-d @file) để chữ tiếng Việt không bị vỡ trên Windows.
B=http://localhost:8080
H='Content-Type: application/json'

run() { printf '\n$ %s\n' "$1"; eval "$1"; printf '\n'; }

run "curl -si $B/orders"
run "curl -si $B/orders/1"
run "curl -si $B/orders/99"
run "curl -si -X POST $B/orders -H '$H' -d @don-moi.json"
run "curl -s $B/orders"
run "curl -si -X POST $B/orders -H '$H' -d @don-thieu.json"
run "curl -si -X DELETE $B/orders/1"
run "curl -si -X PUT $B/orders/2 -H '$H' -d @sua-don.json"
run "curl -si $B/orders/abc"
run "curl -si '$B/getOrder?id=99'"
