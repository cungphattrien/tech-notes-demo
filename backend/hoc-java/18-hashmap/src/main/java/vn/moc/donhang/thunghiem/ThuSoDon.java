package vn.moc.donhang.thunghiem;

import vn.moc.donhang.Order;
import vn.moc.donhang.SoDonTrongNgay;
import vn.moc.donhang.ThucDon;
import vn.moc.donhang.TuyChon;

// Một buổi sáng của quán Mộc qua SoDonTrongNgay: nhận đơn, hủy, pha chế, tra cứu và thống kê.
public class ThuSoDon {

    public static void main(String[] args) {
        ThucDon thucDon = ThucDon.cuaQuanMoc();
        SoDonTrongNgay so = new SoDonTrongNgay();

        Order lan = new Order("Lan");
        lan.themMon(thucDon.goi("tra-dao", TuyChon.DA), 2);
        Order mai = new Order("Mai");
        mai.themMon(thucDon.goi("ca-phe-sua"), 1);
        Order hung = new Order("Hùng");
        hung.themMon(thucDon.goi("tra-dao", TuyChon.DA), 1);
        hung.themMon(thucDon.goi("banh-mi-que"), 2);
        Order bao = new Order("Bảo");                       // mở đơn rồi không gọi món
        Order lanLan2 = new Order("lan ");
        lanLan2.themMon(thucDon.goi("ca-phe-sua"), 3);

        for (Order don : new Order[] {lan, mai, hung, bao, lanLan2}) {
            System.out.println("Nhận đơn mã " + so.nhan(don) + " của " + don.getCustomerName());
        }

        so.huy(2);
        System.out.println("Hủy mã 2. Tìm mã 3: " + so.tim(3).getCustomerName() + ", tìm mã 2: " + so.tim(2));
        System.out.println("Pha tiếp: mã " + so.phaTiep() + ", rồi mã " + so.phaTiep() + "; còn chờ " + so.soDonChoPha());
        System.out.println("Đơn của Lan: " + so.donCua("LAN").size());
        System.out.println("Khách trong ngày: " + so.khachTrongNgay());
        System.out.println("Bỏ đơn rỗng: " + so.boDonRong() + ", còn " + so.soDon() + " đơn, chờ pha " + so.soDonChoPha());
        System.out.println("Số lượng theo món: " + so.soLuongTheoMon());
        System.out.println("Bán chạy nhất: " + so.banChayNhat(2));
    }
}
