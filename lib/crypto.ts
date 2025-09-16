import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secret = process.env.CRYPTO_SECRET || "defaultsecretkeydefaultsecretkey"; // 32 chars

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decrypt(enc: string): string {
  const [ivHex, tagHex, encrypted] = enc.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secret),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
