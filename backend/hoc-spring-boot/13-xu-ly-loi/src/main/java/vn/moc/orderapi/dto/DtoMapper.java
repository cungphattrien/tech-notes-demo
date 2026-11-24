package vn.moc.orderapi.dto;

import java.util.Map;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.moc.orderapi.MenuItem;
import vn.moc.orderapi.Order;
import vn.moc.orderapi.OrderLine;

// MapStruct đọc interface này lúc biên dịch và sinh class DtoMapperImpl (một bean Spring).
// Trường được ghép theo TÊN, không theo vị trí. ERROR: trường nào của DTO chưa được gán là lỗi biên dịch.
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface DtoMapper {

    MenuItemResponse toResponse(MenuItem mon);

    // id, customerName, status, createdAt, total lấy theo tên getter; lines dùng toLine bên dưới.
    OrderResponse toResponse(Order don, @Context Map<Long, String> tenMon);

    // name và lineTotal không có sẵn trong OrderLine nên phải nói rõ lấy từ đâu.
    @Mapping(target = "name", expression = "java(tenMon.get(dong.menuItemId()))")
    @Mapping(target = "lineTotal", expression = "java(dong.quantity() * dong.unitPrice())")
    OrderLineResponse toLine(OrderLine dong, @Context Map<Long, String> tenMon);
}
