#!/usr/bin/env bash
# Chạy lại các bước Git của bài trong một thư mục tạm, không đụng tới repo nào khác.
# Cần: git, mvn, JDK 25. Chạy: bash chay-demo.sh
set -u
NGUON="$(cd "$(dirname "$0")" && pwd)"
TAM="$(mktemp -d)"
echo "Thư mục tạm: $TAM"
mkdir "$TAM/don-hang"
cp -r "$NGUON/pom.xml" "$NGUON/src" "$NGUON/.gitignore" "$TAM/don-hang/"
cd "$TAM/don-hang"

buoc() { echo; echo "\$ $*"; "$@"; }
chay_test() {
  if ! command -v mvn > /dev/null; then echo "(không tìm thấy mvn, bỏ qua bước chạy test)"; return; fi
  mvn -q test > /dev/null 2>&1 && echo "mvn test: qua" || echo "mvn test: HỎNG"
}

buoc git init -b main
buoc git status
buoc git add .
buoc git status
# Danh tính chỉ đặt cho repo tạm này (bỏ --global), để không đổi cấu hình máy bạn.
git config user.name "Minh"
git config user.email "minh@example.com"
buoc git commit -m "Tính tiền đơn hàng và test cho TinhDon"
buoc git log

# Đưa lại lỗi > thay cho >= rồi xem Git chỉ ra chỗ đổi.
sed -i.bak 's/tongTien >= NGUONG_GIAM_GIA/tongTien > NGUONG_GIAM_GIA/' src/main/java/vn/moc/donhang/TinhDon.java
rm -f src/main/java/vn/moc/donhang/TinhDon.java.bak
chay_test
buoc git status
buoc git diff
buoc git restore src/main/java/vn/moc/donhang/TinhDon.java
chay_test

# Một thay đổi thật: phiếu mẫu thêm một ly trà đào.
sed -i.bak 's/{"Cà phê sữa", "Bánh mì que"}/{"Cà phê sữa", "Bánh mì que", "Trà đào"}/; s/{2, 2}/{2, 2, 1}/; s/{35_000, 15_000}/{35_000, 15_000, 45_000}/' src/main/java/vn/moc/donhang/App.java
rm -f src/main/java/vn/moc/donhang/App.java.bak
buoc git add src/main/java/vn/moc/donhang/App.java
buoc git diff --staged
buoc git commit -m "Phiếu mẫu thêm một ly trà đào"
buoc git revert --no-edit HEAD
buoc git log --oneline
