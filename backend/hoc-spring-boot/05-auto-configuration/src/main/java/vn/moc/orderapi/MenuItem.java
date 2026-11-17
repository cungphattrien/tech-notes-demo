package vn.moc.orderapi;

// Một món trong thực đơn. record là cách ngắn gọn để khai báo một lớp chỉ chứa dữ liệu.
// price tính bằng đồng (số nguyên), đúng như backend/DOMAIN.md.
public record MenuItem(long id, String name, long price) {
}
