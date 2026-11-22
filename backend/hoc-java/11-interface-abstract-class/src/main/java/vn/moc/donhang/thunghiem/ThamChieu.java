package vn.moc.donhang.thunghiem;

import vn.moc.donhang.DoUong;
import vn.moc.donhang.MenuItem;
import vn.moc.donhang.Order;

// Biến kiểu class giữ tham chiếu tới object, không giữ bản thân object.
public class ThamChieu {

    public static void main(String[] args) {
        MenuItem caPheSua = new DoUong(1, "Cà phê sữa", 35_000, false);

        Order donCuaMai = new Order("Mai");
        Order bienKhac = donCuaMai;                 // không tạo object mới, chỉ chép tham chiếu
        bienKhac.themMon(caPheSua, 2);
        System.out.println("donCuaMai.tongTien() = " + donCuaMai.tongTien());

        Order donMoi = new Order("Mai");            // object thứ hai, cùng tên khách
        System.out.println("donCuaMai == bienKhac : " + (donCuaMai == bienKhac));
        System.out.println("donCuaMai == donMoi   : " + (donCuaMai == donMoi));

        System.out.println("In thẳng object       : " + donCuaMai);
    }
}
