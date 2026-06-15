import { NextResponse } from "next/server";
import { verifyPassword, signJWT, hashPassword } from "@/lib/auth/crypto";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logger } from "@/lib/logger";

const USERS_TABLE = getTableName("users");

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    const allowed = await checkRateLimit(ip, 5, 300); // 5 attempts per 5 mins
    if (!allowed) {
      logger.warn("login_rate_limit_exceeded", { ip });
      return NextResponse.json({ success: false, message: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    let user;
    try {
      const result = await dynamoDb.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { Email: email }
      }));
      user = result.Item;
    } catch (dbErr) {
      logger.warn("dynamodb_query_failed", { email, reason: "table_might_not_exist", error: String(dbErr) });
      user = null;
    }

    if (!user) {
      // Auto-seed admin user if none exists and matches env vars
      const adminEmail = process.env.ADMIN_USERNAME || "admin@example.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "password";
      
      const finalAdminEmail = adminEmail;
      const finalAdminPassword = adminPassword;
      
      if (email === finalAdminEmail && password === finalAdminPassword) {
        const hashedPassword = await hashPassword(finalAdminPassword);
        try {
          await dynamoDb.send(new PutCommand({
            TableName: USERS_TABLE,
            Item: {
              Email: finalAdminEmail,
              PasswordHash: hashedPassword,
              IsVerified: true,
              Role: "admin",
              CreatedAt: new Date().toISOString()
            }
          }));
        } catch (e) {
          logger.warn("dynamodb_put_failed", { email: finalAdminEmail, error: String(e) });
        }
        
        logger.info("login_success", { email: finalAdminEmail, ip, role: "admin_seed" });
        return await issueTokenResponse(finalAdminEmail);
      }
      
      logger.warn("login_failure", { email, ip, reason: "invalid_credentials" });
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.PasswordHash);
    if (!isValid) {
      logger.warn("login_failure", { email, ip, reason: "invalid_credentials" });
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    logger.info("login_success", { email, ip });
    return await issueTokenResponse(email);
  } catch (error) {
    logger.error("login_error", { error: String(error) });
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

async function issueTokenResponse(email: string) {
  const token = await signJWT({ email, role: "admin" }, "2h");
  
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60, // 2 hours
  });
  
  response.cookies.delete("admin_token");
  return response;
}
