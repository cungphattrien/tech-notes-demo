import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { kiemCi } from "./kiem-ci.ts";

const scripts = { test: "vitest run", typecheck: "tsc --noEmit" };
const co = () => true;
const doc = (f: string) => readFileSync(f, "utf8");

describe("kiemCi", () => {
  it("workflow của tập này không có lỗi", () => {
    expect(kiemCi(doc(".github/workflows/ci.yml"), scripts, co)).toEqual([]);
  });
  it("workflow lỗi bị báo đủ 5 vấn đề", () => {
    const loi = kiemCi(doc("vi-du-loi/ci-loi.yml"), scripts, (f) => f === ".node-version");
    expect(loi).toHaveLength(5);
    expect(loi.join("\n")).toMatch(/permissions/);
    expect(loi.join("\n")).toMatch(/concurrency/);
    expect(loi.join("\n")).toMatch(/\.nvmrc/);
    expect(loi.join("\n")).toMatch(/npm ci/);
    expect(loi.join("\n")).toMatch(/"lint"/);
  });
  it("npm test không có script test thì bị báo", () => {
    const yml = "permissions: {}\nconcurrency: x\njobs:\n  a:\n    steps:\n      - run: npm test\n";
    expect(kiemCi(yml, {}, co)).toHaveLength(1);
  });
  it("lệnh nhiều dòng trong một bước cũng được kiểm", () => {
    const yml = "permissions: {}\nconcurrency: x\njobs:\n  a:\n    steps:\n      - run: |\n          npm ci\n          npm run build\n";
    expect(kiemCi(yml, scripts, co).join()).toMatch(/"build"/);
  });
});
