package vn.moc.orderapi;

import org.springframework.boot.context.properties.ConfigurationProperties;

// Gom các thiết lập bắt đầu bằng "moc." trong application.yml thành một đối tượng có kiểu.
// "giam-gia" trong file yml tự khớp với giamGia ở đây (relaxed binding).
@ConfigurationProperties(prefix = "moc")
public record MocProperties(GiamGia giamGia) {

    public record GiamGia(long nguong, int phanTram) {
    }
}
