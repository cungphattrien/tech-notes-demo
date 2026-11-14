// Quy tắc đăng ký bản tin dùng chung cho form và Server Action. Toàn hàm thuần nên test được.
// Cùng ý với src/lib/newsletter.ts của blog Tech Notes (bản rút gọn, bỏ phần xuất CSV và thống kê).
// Database áp lại đúng quy tắc email này trong hàm subscribe().

export const MAX_EMAIL_LENGTH = 254;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Người điền form mất vài giây, robot mất vài mili giây: nhanh hơn mức này thì bỏ qua. */
export const MIN_FILL_MS = 1500;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Email sai ở đâu, dưới dạng mã thông báo để form tra câu chữ theo ngôn ngữ người đọc. */
export function emailProblem(value: string): "emailMissing" | "emailInvalid" | null {
  const email = normalizeEmail(value);
  if (!email) return "emailMissing";
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL.test(email)) return "emailInvalid";
  return null;
}

/**
 * True nếu lượt gửi trông như của máy: ô ẩn "website" bị điền, hoặc form được gửi nhanh một cách khó tin.
 * Robot vẫn nhận câu trả lời bình thường nên chúng không biết mình bị lọc.
 */
export function looksAutomated({ honeypot, startedAt, now }: { honeypot: string; startedAt: string; now: number }): boolean {
  if (honeypot.trim()) return true;
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return false; // không có mốc giờ từ JavaScript thì không phạt người dùng
  const elapsed = now - started;
  return elapsed >= 0 && elapsed < MIN_FILL_MS;
}

/** Nơi đăng ký xảy ra (một đường dẫn trên site), lưu lại để biết trang nào kéo được người đăng ký. */
export function signupSource(value: string): string {
  return /^\/[\w\-/]*$/.test(value) ? value.slice(0, 120) : "";
}
