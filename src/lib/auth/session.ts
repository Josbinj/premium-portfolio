import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretString = process.env.JWT_SECRET || "default_super_secret_key_change_in_production";
const JWT_SECRET = new TextEncoder().encode(secretString);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { email: string; role: string; exp: number; iat: number };
  } catch (error) {
    return null;
  }
}
