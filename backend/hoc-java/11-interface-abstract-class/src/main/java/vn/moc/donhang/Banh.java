package vn.moc.donhang;

// Bánh không có phụ thu, nhưng vẫn phải nói rõ điều đó vì phuThu() là abstract.
public class Banh extends MenuItem {

    public Banh(long id, String name, long price) {
        super(id, name, price);
    }

    @Override
    protected long phuThu() {
        return 0;
    }
}
