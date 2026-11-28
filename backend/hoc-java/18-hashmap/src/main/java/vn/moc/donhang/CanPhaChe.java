package vn.moc.donhang;

// Một interface nhỏ cho đúng một nhu cầu của quầy pha chế: món này cần bao nhiêu phút.
// Voucher và combo không cần cài nó, nên không phải viết method vô nghĩa.
public interface CanPhaChe {

    int phutPhaChe();
}
