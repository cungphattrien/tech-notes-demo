package vn.moc.orderapi.dto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.moc.orderapi.MenuItem;
import vn.moc.orderapi.Order;
import vn.moc.orderapi.OrderLine;

// MapStruct sinh DtoMapperImpl lúc biên dịch. Tên món giờ đi theo quan hệ dong.menuItem,
// không cần tra bảng tên món riêng như các bài trước nữa.
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface DtoMapper {

    MenuItemResponse toResponse(MenuItem mon);

    OrderResponse toResponse(Order don);

    @Mapping(target = "menuItemId", source = "menuItem.id")
    @Mapping(target = "name", source = "menuItem.name")
    @Mapping(target = "lineTotal", expression = "java(dong.thanhTien())")
    OrderLineResponse toLine(OrderLine dong);
}
