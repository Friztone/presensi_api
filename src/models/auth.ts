import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = "rahasia_super_aman"; // ganti dengan .env di produksi

export function generateToken(payload: any): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "6h" });
}

export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
