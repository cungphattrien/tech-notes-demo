#!/usr/bin/env bash
# Dựng một repo nhỏ của quán Mộc có sẵn tình huống: hai người cùng sửa hàm tinhPhiGiao.
# Chạy: bash dung-xung-dot.sh   (tạo thư mục moc-xung-dot cạnh file này; xóa thư mục đó rồi chạy lại để làm lại từ đầu)
set -euo pipefail

THU_MUC="moc-xung-dot"
[ -e "$THU_MUC" ] && { echo "Thư mục $THU_MUC đã có, hãy xóa nó rồi chạy lại."; exit 1; }

git init -q -b main "$THU_MUC"
cd "$THU_MUC"
git config user.name "Ban"
git config core.autocrlf false
git config user.email "ban@example.com"
mkdir src

# --- Điểm xuất phát: cả hai cùng thấy phiên bản này -----------------------------------------------
cat > src/phi-giao.ts <<'EOF'
// Phí giao hàng của quán Mộc.
export const PHI_GIAO = 15000;
export const MIEN_PHI_TU = 150000;

export function tinhPhiGiao(tongTien: number): number {
  return tongTien >= MIEN_PHI_TU ? 0 : PHI_GIAO;
}
EOF
git add . && git commit -q -m "Them ham tinh phi giao hang"

# --- Nhánh của BẠN: tính phí theo khoảng cách (hai commit liên tiếp cùng sửa một hàm) ---------------
git switch -q -c feat/phi-giao-theo-km
cat > src/phi-giao.ts <<'EOF'
// Phí giao hàng của quán Mộc.
export const PHI_GIAO = 15000;
export const MIEN_PHI_TU = 150000;

export function tinhPhiGiao(tongTien: number, km: number): number {
  if (tongTien >= MIEN_PHI_TU) return 0;
  return PHI_GIAO + Math.max(0, km - 3) * 5000;
}
EOF
git commit -q -am "Tinh phi giao theo khoang cach"
cat > src/phi-giao.ts <<'EOF'
// Phí giao hàng của quán Mộc.
export const PHI_GIAO = 15000;
export const MIEN_PHI_TU = 150000;

export function tinhPhiGiao(tongTien: number, km: number): number {
  if (tongTien >= MIEN_PHI_TU) return 0;
  return PHI_GIAO + Math.max(0, Math.ceil(km) - 3) * 5000; // km lẻ tính tròn lên
}
EOF
git commit -q -am "Lam tron km le len"

# --- Trong lúc đó, đồng nghiệp (anh Khoa) đã gộp một thay đổi khác vào main ------------------------------
git switch -q main
git config user.name "Khoa"
git config user.email "khoa@example.com"
cat > src/phi-giao.ts <<'EOF'
// Phí giao hàng của quán Mộc.
export const PHI_GIAO = 15000;
export const MIEN_PHI_TU = 200000; // khuyến mãi mới: miễn phí từ 200.000đ

export function tinhPhiGiao(tongTien: number): number {
  if (tongTien <= 0) return 0; // giỏ trống thì không tính phí
  return tongTien >= MIEN_PHI_TU ? 0 : PHI_GIAO;
}
EOF
git commit -q -am "Doi nguong mien phi giao len 200k, gio trong khong tinh phi"
git config user.name "Ban"
git config user.email "ban@example.com"

echo "Đã dựng xong trong $(pwd)"
git log --oneline --graph --all
