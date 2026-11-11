#!/usr/bin/env bash
# Dùng: bash do-toc-do.sh 2   (hoặc 3). Build phiên bản đó rồi đo thời gian trả lời của 10 request liên tiếp.
set -uo pipefail
cd "$(dirname "$0")"
cp phien-ban/$1-*.js "app/bai-viet/[slug]/page.js"
npx next build > /tmp/build.log 2>&1
(npx next start -p 3100 > /tmp/server.log 2>&1 &)
sleep 4
curl -s localhost:3100/bai-viet/xin-chao -o /dev/null   # request làm nóng, không tính
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null -w "%{time_total}\n" localhost:3100/bai-viet/xin-chao; done | sort -n | awk '{a[NR]=$1} END {printf "  nhanh nhất %.0f ms, chậm nhất %.0f ms, giữa %.0f ms\n", a[1]*1000, a[NR]*1000, a[int((NR+1)/2)]*1000}'
echo "  số lần hỏi database: $(grep -c '\[db\]' /tmp/server.log) (11 request)"
PID=$(netstat -ano 2>/dev/null | grep ":3100 .*LISTENING" | awk '{print $5}' | head -1)
[ -n "${PID:-}" ] && taskkill //F //PID "$PID" > /dev/null 2>&1 || kill $(lsof -ti:3100) 2>/dev/null || true
