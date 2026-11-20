#!/usr/bin/env bash
# Chạy lại các bước Git của bài trong thư mục tạm: hai nhánh, fast-forward, conflict, push, clone, pull.
# "GitHub" ở đây là một bare repo cục bộ, để chạy được mà không cần tài khoản hay mạng.
# Cần: git (2.28 trở lên, để có init -b), mvn, JDK 25. Chạy: bash chay-demo.sh
set -u
NGUON="$(cd "$(dirname "$0")" && pwd)"
GOC="$NGUON/../07-git-co-ban"          # project ở đầu bài: bản cuối của tập 7
TAM="$(mktemp -d)"
echo "Thư mục tạm: $TAM"
mkdir "$TAM/don-hang"; cd "$TAM/don-hang"
cp -r "$GOC/pom.xml" "$GOC/src" "$GOC/.gitignore" .
# Đưa ký tự xuống dòng về LF để các file patch áp dụng được trên mọi máy.
find . -type f \( -name "*.java" -o -name "*.xml" -o -name ".gitignore" \) -exec sed -i.bak 's/\r$//' {} \; -exec rm -f {}.bak \;

buoc() { echo; echo "\$ $*"; "$@"; }
chay_test() {
  if ! command -v mvn > /dev/null; then echo "(không tìm thấy mvn, bỏ qua bước chạy test)"; return; fi
  mvn -q test > /dev/null 2>&1 && echo "(mvn test: qua)" || echo "(mvn test: HỎNG)"
}

git init -q -b main
git config user.name "Minh"; git config user.email "minh@example.com"
git add .; git commit -q -m "Tính tiền đơn hàng và test cho TinhDon"

buoc git switch -c khuyen-mai-mua-2-tang-1
git apply "$NGUON/patches/01-khuyen-mai-mua-2-tang-1.patch"; chay_test
git add .; buoc git commit -m "Thử khuyến mãi mua 2 tặng 1"

buoc git switch main
buoc git switch -c chan-tong-tien-am
git apply "$NGUON/patches/02-chan-tong-tien-am.patch"; chay_test
git add .; buoc git commit -m "Báo lỗi khi tổng tiền âm"

buoc git switch main
buoc git merge chan-tong-tien-am
buoc git log --oneline --graph --all
buoc git merge khuyen-mai-mua-2-tang-1
buoc git status
echo; echo "--- Phần cuối TinhDonTest.java đang có dấu conflict:"; tail -10 src/test/java/vn/moc/donhang/TinhDonTest.java

# Gỡ conflict: giữ cả hai test (bản đã gỡ chính là file trong thư mục của tập này).
cp "$NGUON/src/test/java/vn/moc/donhang/TinhDonTest.java" src/test/java/vn/moc/donhang/TinhDonTest.java
sed -i.bak 's/\r$//' src/test/java/vn/moc/donhang/TinhDonTest.java; rm -f src/test/java/vn/moc/donhang/TinhDonTest.java.bak
chay_test
buoc git add src/test/java/vn/moc/donhang/TinhDonTest.java
buoc git commit --no-edit
buoc git log --oneline --graph
buoc git branch -d khuyen-mai-mua-2-tang-1 chan-tong-tien-am

# "GitHub" giả: bare repo, nhánh mặc định main như GitHub.
git init -q --bare -b main "$TAM/remote/don-hang.git"
buoc git remote add origin "$TAM/remote/don-hang.git"
buoc git push
buoc git push -u origin main
cd "$TAM"
buoc git clone "$TAM/remote/don-hang.git" may-thu-hai
