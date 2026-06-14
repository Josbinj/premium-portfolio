import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretString = process.env.JWT_SECRET;
if (!secretString && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = new TextEncoder().encode(secretString || "default_super_secret_key_change_in_production");

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
