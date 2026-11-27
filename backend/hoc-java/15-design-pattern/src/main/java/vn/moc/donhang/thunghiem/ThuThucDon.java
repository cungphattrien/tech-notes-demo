package vn.moc.donhang.thunghiem;

import vn.moc.donhang.MenuItem;
import vn.moc.donhang.ThucDon;
import vn.moc.donhang.TuyChon;

// Gọi món qua Factory: người gọi chỉ nói mã, nhận về đúng loại món với đúng giá.
public class ThuThucDon {

    public static void main(String[] args) {
        ThucDon thucDon = ThucDon.cuaQuanMoc();

        MenuItem traDao = thucDon.goi("tra-dao", TuyChon.DA, TuyChon.TRAN_CHAU);
        MenuItem banh = thucDon.goi("banh-mi-que");
        System.out.println(traDao.getClass().getSimpleName() + ": " + traDao.moTa() + " = " + traDao.donGia());
        System.out.println(banh.getClass().getSimpleName() + ": " + banh.moTa() + " = " + banh.donGia());

        try {
            thucDon.goi("tra-sua");
        } catch (IllegalArgumentException e) {
            System.out.println("Lỗi: " + e.getMessage());
        }
        try {
            thucDon.goi("banh-mi-que", TuyChon.DA);
        } catch (IllegalArgumentException e) {
            System.out.println("Lỗi: " + e.getMessage());
        }
    }
}
