package vn.moc.orderapi.dto;

import vn.moc.orderapi.MenuItem;

// Hình dạng JSON của một món mà API trả ra. Đổi entity không tự làm đổi cái này.
public record MenuItemResponse(long id, String name, long price, String description) {

    public static MenuItemResponse from(MenuItem mon) {
        return new MenuItemResponse(mon.getId(), mon.getName(), mon.getPrice(), mon.getDescription());
    }
}
