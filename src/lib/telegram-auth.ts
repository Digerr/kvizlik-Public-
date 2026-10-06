import { createHmac, timingSafeEqual } from "node:crypto";
export function validateTelegramInitData(
  initData: unknown,
  botToken: string | undefined,
  now = Date.now(),
): boolean {
  if (typeof initData !== "string" || initData.length > 10000 || !botToken)
    return false;
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (
      !hash ||
      !/^[a-f0-9]{64}$/.test(hash) ||
      new Set(params.keys()).size !== Array.from(params.keys()).length
    )
      return false;
    const auth = Number(params.get("auth_date"));
    const age = now / 1000 - auth;
    if (!Number.isInteger(auth) || age < -30 || age > 86400) return false;
    params.delete("hash");
    const check = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
    const expected = createHmac("sha256", secret).update(check).digest();
    return timingSafeEqual(expected, Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
