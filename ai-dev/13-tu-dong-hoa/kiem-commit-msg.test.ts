import assert from "node:assert/strict";
import { test } from "node:test";
import { kiemTieuDe } from "./kiem-commit-msg.ts";

test("dòng đầu đúng dạng thì không có lỗi", () => {
  assert.deepEqual(kiemTieuDe("fix(bot): sửa tổng tháng khi xóa khoản chi"), []);
  assert.deepEqual(kiemTieuDe("docs: cập nhật README"), []);
});

test("những dòng đầu mơ hồ bị báo là không nói gì", () => {
  for (const mo of ["fix", "ok", "xong", "WIP", "update", "..."]) assert.match(kiemTieuDe(mo)[0]!, /không nói gì/, mo);
});

test("thiếu kiểu hoặc thiếu mô tả thì báo sai dạng", () => {
  assert.match(kiemTieuDe("sửa lỗi tổng tháng")[0]!, /kiểu\(phạm vi\)/);
  assert.match(kiemTieuDe("fix:")[0]!, /kiểu\(phạm vi\)/);
});

test("dòng đầu dài hơn 72 ký tự hoặc kết thúc bằng dấu chấm bị báo", () => {
  assert.equal(kiemTieuDe("feat(bot): " + "a".repeat(70)).length, 1);
  assert.equal(kiemTieuDe("fix(bot): sửa lỗi.").length, 1);
});

test("commit Merge và Revert do Git tự sinh thì bỏ qua", () => {
  assert.deepEqual(kiemTieuDe("Merge branch 'main' into feat/x"), []);
  assert.deepEqual(kiemTieuDe('Revert "feat(bot): thêm gì đó"'), []);
});
