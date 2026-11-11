#!/usr/bin/env bash
# Dùng sau khi chép phiên bản 3 vào trang: bash thu-lam-moi-ngay.sh
# Sửa tiêu đề, gọi /api/revalidate, rồi xem trang đổi ngay (không đợi hết 10 giây).
set -uo pipefail
cd "$(dirname "$0")"
cp data/posts.json /tmp/posts-goc.json
npx next build > /tmp/build.log 2>&1
(REVALIDATE_SECRET=bi-mat-thu npx next start -p 3100 > /tmp/server.log 2>&1 &)
sleep 4
hoi() { curl -s -D /tmp/h.txt localhost:3100/bai-viet/xin-chao -o /tmp/b.html
  echo "  $(grep -io '^x-nextjs-cache: .*' /tmp/h.txt | tr -d '\r' || true) | $(grep -o '<h1>[^<]*' /tmp/b.html | sed 's/<h1>//')"; }
echo "Trước khi sửa:"; hoi
sed -i 's/"title": "Xin chào"/"title": "Xin chào, bản sửa"/' data/posts.json
echo "Đã sửa file. Xem ngay (chưa gọi làm mới):"; hoi
echo "Gọi /api/revalidate không có mã bí mật:"
curl -s -o /dev/null -w "  HTTP %{http_code}\n" -X POST localhost:3100/api/revalidate -d '{"slug":"xin-chao"}'
echo "Gọi /api/revalidate có mã bí mật:"
curl -s -X POST localhost:3100/api/revalidate -H "x-revalidate-secret: bi-mat-thu" -d '{"slug":"xin-chao"}'; echo
echo "Xem lại:"; hoi; hoi
echo "Log máy chủ:"; grep "\[db\]" /tmp/server.log
cp /tmp/posts-goc.json data/posts.json
PID=$(netstat -ano 2>/dev/null | grep ":3100 .*LISTENING" | awk '{print $5}' | head -1)
[ -n "${PID:-}" ] && taskkill //F //PID "$PID" > /dev/null 2>&1 || kill $(lsof -ti:3100) 2>/dev/null || true
