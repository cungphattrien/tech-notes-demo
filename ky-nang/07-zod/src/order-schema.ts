import { z } from "zod";

import { parsePrice } from "./orders.ts";

// Giá có thể là số (đơn từ web) hoặc chuỗi "35.000" (máy cũ). Dùng lại parsePrice của tập 2, và biến lỗi của nó
// thành lỗi của Zod để thông báo gắn đúng vào ô "price".
const priceSchema = z.union([z.number("Giá phải là số hoặc chuỗi"), z.string("Giá phải là số hoặc chuỗi")]).transform((raw, ctx) => {
  try {
    return parsePrice(raw);
  } catch (error) {
    ctx.issues.push({ code: "custom", message: (error as Error).message, input: raw });
    return z.NEVER;
  }
});

// Thông báo tiếng Việt cho hai lỗi mà Zod tự phát hiện ở mức đối tượng: trường lạ và sai kiểu. Lỗi khác dùng thông báo mặc định.
const objectError = (issue: { code: string; keys?: string[] }) => {
  if (issue.code === "unrecognized_keys") return `Không nhận trường: ${issue.keys?.join(", ")}`;
  if (issue.code === "invalid_type") return "Phải là một đối tượng JSON";
  return undefined;
};

const customerSchema = z.strictObject({
  name: z.string("Tên khách phải là chữ").trim().min(1, "Tên khách không được để trống").max(80, "Tên khách tối đa 80 ký tự"),
  phone: z.string("Số điện thoại phải là chữ").regex(/^0\d{9}$/, "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0"),
}, { error: objectError });

const itemSchema = z.strictObject({
  name: z.string("Tên món phải là chữ").trim().min(1, "Tên món không được để trống"),
  price: priceSchema,
  quantity: z.number("Số lượng phải là số").int("Số lượng phải là số nguyên").min(1, "Số lượng tối thiểu là 1").max(50, "Số lượng tối đa là 50"),
}, { error: objectError });

// Đơn do website gửi lên. strictObject từ chối trường lạ: website không được tự đặt id, source hay createdAt.
export const newOrderSchema = z.strictObject({
  customer: customerSchema,
  items: z.array(itemSchema, "Danh sách món phải là một mảng").min(1, "Đơn phải có ít nhất một món").max(20, "Một đơn có tối đa 20 món"),
}, { error: objectError });

// Kiểu TypeScript suy ra từ schema: không phải viết hai lần.
export type NewOrder = z.infer<typeof newOrderSchema>;

// Danh sách lỗi cho người gọi API: mỗi lỗi một dòng, nói rõ trường nào và sai gì.
export function listIssues(error: z.ZodError): { truong: string; loi: string }[] {
  return error.issues.map((issue) => ({ truong: issue.path.join(".") || "(cả đơn)", loi: issue.message }));
}
