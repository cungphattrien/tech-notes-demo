public class DonDauTien {
    public static void main(String[] args) {
        String khach = "Lan";                 // chữ
        String mon = "Cà phê sữa";
        int soLuong = 2;                      // số nguyên
        long giaMon = 35000;                  // giá bằng đồng
        boolean thanhToanRoi = false;         // đúng/sai

        long tongTien = soLuong * giaMon;     // int nhân long cho ra long

        System.out.println("Khách: " + khach);
        System.out.println("Món: " + mon + " x " + soLuong);
        System.out.println("Tổng tiền: " + tongTien + " đồng");
        System.out.println("Đã thanh toán: " + thanhToanRoi);

        var ghiChu = "ít đá";                 // var: để Java tự suy ra kiểu (ở đây là String)
        System.out.println("Ghi chú: " + ghiChu);
    }
}
