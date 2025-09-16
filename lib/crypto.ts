import crypto from "crypto";

const algorithm = "aes-256-gcm";

// Build a 32-byte key from CRYPTO_SECRET. Accepts hex (64 chars), base64, or utf8.
function getKey(): Buffer {
  let raw = process.env.CRYPTO_SECRET;
  if (!raw) {
    throw new Error("Missing CRYPTO_SECRET in .env.local");
  }

  // Normalize: trim whitespace and strip surrounding quotes if present
  raw = raw.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");

  // 1) Hex input (even length). Prefer exact 32-byte result if possible.
  if (/^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0) {
    const hexBuf = Buffer.from(raw, "hex");
    if (hexBuf.length === 32) return hexBuf;
    // Fallback: derive 32-byte key from provided hex using SHA-256
    return crypto.createHash("sha256").update(hexBuf).digest();
  }

  // 2) Try base64 decode
  try {
    const b64Buf = Buffer.from(raw, "base64");
    if (b64Buf.length > 0) {
      if (b64Buf.length === 32) return b64Buf;
      return crypto.createHash("sha256").update(b64Buf).digest();
    }
  } catch {
    // ignore, fall through to utf8 handling
  }

  // 3) UTF-8 string: use as-is if exactly 32 bytes, else derive with SHA-256
  const utf8Buf = Buffer.from(raw, "utf8");
  if (utf8Buf.length === 32) return utf8Buf;
  return crypto.createHash("sha256").update(utf8Buf).digest();
}

const key = getKey();

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decrypt(enc: string): string {
  const [ivHex, tagHex, encrypted] = enc.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
