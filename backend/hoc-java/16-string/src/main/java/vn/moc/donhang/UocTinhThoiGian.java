package vn.moc.donhang;

import java.util.List;

// Ước tính thời gian chờ ở quầy: các món được pha lần lượt, nên cộng phút của từng món.
// Chỉ nhận thứ CanPhaChe: trình biên dịch không cho truyền voucher vào đây.
public class UocTinhThoiGian {

    public static int phutCho(List<? extends CanPhaChe> mon) {
        int tong = 0;
        for (CanPhaChe m : mon) {
            tong += m.phutPhaChe();
        }
        return tong;
    }
}
