package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;

// Combo gồm nhiều thứ bán được, bán với một giá riêng. Combo không "là" món nào: nó "có" các món.
public class Combo implements CoTheBan {
    private final String ma;
    private final String ten;
    private final long giaCombo;
    private final List<CoTheBan> thanhPhan;

    public Combo(String ma, String ten, long giaCombo, CoTheBan... thanhPhan) {
        if (thanhPhan.length < 2) {
            throw new IllegalArgumentException("Combo cần ít nhất 2 thành phần");
        }
        this.ma = ma;
        this.ten = ten;
        this.giaCombo = giaCombo;
        this.thanhPhan = List.of(thanhPhan);
        if (giaCombo >= giaLe()) {
            throw new IllegalArgumentException("Giá combo " + giaCombo + " phải rẻ hơn mua lẻ " + giaLe());
        }
    }

    // Giá nếu mua lẻ từng thành phần: hỏi chính các thành phần (ủy quyền), không tự tính lại.
    public long giaLe() {
        long tong = 0;
        for (CoTheBan phan : thanhPhan) {
            tong += phan.donGia();
        }
        return tong;
    }

    @Override
    public String ma() {
        return "COMBO-" + ma;
    }

    @Override
    public String moTa() {
        List<String> ten = new ArrayList<>();
        for (CoTheBan phan : thanhPhan) {
            ten.add(phan.moTa());
        }
        return this.ten + ": " + String.join(" + ", ten);
    }

    @Override
    public long donGia() {
        return giaCombo;
    }

    // Combo đã là giá ưu đãi, không giảm thêm 10%.
    @Override
    public boolean duocGiamGia() {
        return false;
    }
}
