#!/usr/bin/env bash
# Dùng: bash thu-phien-ban.sh 2   (hoặc 3). Chép phiên bản vào trang, build, chạy máy chủ ở cổng 3100,
# gửi 5 request, sửa tiêu đề bài trong data/posts.json, đợi 11 giây, gửi thêm 3 request, đợi 2 giây, gửi thêm 2 request, rồi in log [db].
set -uo pipefail
cd "$(dirname "$0")"
FILE=$(ls phien-ban/$1-*.js)
cp "$FILE" "app/bai-viet/[slug]/page.js"
cp data/posts.json /tmp/posts-goc.json
npx next build > /tmp/build.log 2>&1
(npx next start -p 3100 > /tmp/server.log 2>&1 &)
sleep 4
hoi() { curl -s -D /tmp/h.txt localhost:3100/bai-viet/xin-chao -o /tmp/b.html
  echo "  $(grep -io '^x-nextjs-cache: .*' /tmp/h.txt | tr -d '\r' || true) | $(grep -o '<h1>[^<]*' /tmp/b.html | sed 's/<h1>//')"; }
echo "5 request đầu:"; for i in 1 2 3 4 5; do hoi; done
sed -i 's/"title": "Xin chào"/"title": "Xin chào, bản sửa"/' data/posts.json
echo "Đã sửa tiêu đề trong data/posts.json. Đợi 11 giây..."; sleep 11
echo "3 request sau:"; for i in 1 2 3; do hoi; done
sleep 2; echo "Hai giây sau:"; for i in 1 2; do hoi; done
echo "Log máy chủ:"; grep "\[db\]" /tmp/server.log
cp /tmp/posts-goc.json data/posts.json
# Tắt máy chủ (Windows: tìm tiến trình đang nghe cổng 3100; macOS/Linux: dùng `kill $(lsof -ti:3100)`).
PID=$(netstat -ano 2>/dev/null | grep ":3100 .*LISTENING" | awk '{print $5}' | head -1)
[ -n "${PID:-}" ] && taskkill //F //PID "$PID" > /dev/null 2>&1 || kill $(lsof -ti:3100) 2>/dev/null || true
