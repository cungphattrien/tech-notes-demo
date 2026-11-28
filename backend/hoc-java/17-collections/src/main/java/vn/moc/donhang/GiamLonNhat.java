package vn.moc.donhang;

import java.util.List;

// Nhiều quy tắc cùng lúc, khách được mức có lợi nhất (không cộng dồn).
// Bản thân nó cũng là một QuyTacGiamGia, nên Order không biết mình đang dùng một hay nhiều quy tắc.
public class GiamLonNhat implements QuyTacGiamGia {

    private final List<QuyTacGiamGia> cacQuyTac;

    public GiamLonNhat(QuyTacGiamGia... cacQuyTac) {
        this.cacQuyTac = List.of(cacQuyTac);
    }

    @Override
    public long giam(Order don) {
        long lonNhat = 0;
        for (QuyTacGiamGia q : cacQuyTac) {
            lonNhat = Math.max(lonNhat, q.giam(don));
        }
        return lonNhat;
    }
}
