// Bot Telegram của app sổ chi tiêu, bản có phân loại bằng AI. Thứ tự trong handler là chủ ý:
// ghi khoản chi TRƯỚC, hỏi AI SAU, và câu trả lời cho người dùng luôn được gửi dù AI thế nào.
import { Bot, type BotConfig, type Context, webhookCallback } from "grammy";

import { docKhoanChi, vnd } from "./doc-khoan-chi.ts";
import { DANH_MUC, type DanhMuc, type PhanLoai } from "./phan-loai.ts";

export type Khoan = { note: string; amount: number; danhMuc: DanhMuc | null };

const HUONG_DAN = 'Mình chưa hiểu. Nhắn kiểu "cà phê 35k" để ghi một khoản chi, hoặc /loai để xem tổng theo nhóm.';

export function tongTheoNhom(so: Khoan[]): string {
  if (so.length === 0) return "Chưa có khoản chi nào.";
  const dong = [...DANH_MUC, null].flatMap((nhom) => {
    const trongNhom = so.filter((k) => k.danhMuc === nhom);
    return trongNhom.length ? [`${nhom ?? "chưa phân loại"}: ${vnd(trongNhom.reduce((t, k) => t + k.amount, 0))}`] : [];
  });
  return dong.join("\n");
}

export function taoBot(token: string, phanLoai: PhanLoai, config?: BotConfig<Context>) {
  const bot = new Bot(token, config);
  const soTheoNguoi = new Map<number, Khoan[]>(); // mỗi người một cuốn sổ, như các tập trước
  const soCua = (id: number) => soTheoNguoi.get(id) ?? soTheoNguoi.set(id, []).get(id)!;

  bot.on("message:text", async (ctx) => {
    const tin = ctx.message.text.trim();
    const so = soCua(ctx.from.id);
    if (tin.toLowerCase() === "/loai") return void (await ctx.reply(tongTheoNhom(so)));
    const doc = docKhoanChi(tin);
    if (!doc) return void (await ctx.reply(HUONG_DAN));

    const khoan: Khoan = { ...doc, danhMuc: null };
    so.push(khoan); // 1. ghi trước: AI hỏng thì khoản chi vẫn còn
    const ketQua = await phanLoai.phanLoai(doc.note); // 2. hỏi AI, có hạn chót
    khoan.danhMuc = ketQua.danhMuc; // 3. null nếu AI lỗi, quá giờ hoặc trả lời sai dạng
    await ctx.reply(`Đã ghi: ${doc.note}, ${vnd(doc.amount)} (${ketQua.danhMuc ?? "chưa phân loại"})`);
  });

  bot.catch((err) => console.error(`Lỗi khi xử lý update ${err.ctx.update.update_id}:`, err.error));
  return bot;
}

/** Handler webhook kiểu Request/Response. Telegram gửi secret_token (đặt lúc setWebhook) trong header X-Telegram-Bot-Api-Secret-Token; sai hoặc thiếu thì grammY từ chối. */
export function taoWebhook(bot: Bot, secretToken: string) {
  return webhookCallback(bot, "std/http", { secretToken });
}
