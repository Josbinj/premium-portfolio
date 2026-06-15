import { NextResponse } from "next/server";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { hashPassword } from "@/lib/auth/crypto";
import { checkRateLimit } from "@/lib/auth/rate-limit";

const USERS_TABLE = getTableName("users");

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(ip, 5, 300);
    if (!allowed) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { email, token, newPassword } = await request.json();
    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const { Item: user } = await dynamoDb.send(new GetCommand({ TableName: USERS_TABLE, Key: { Email: email } }));
    
    if (!user || user.ResetToken !== token) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    if (new Date(user.ResetTokenExpires) < new Date()) {
      return NextResponse.json({ success: false, message: "Token has expired" }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(newPassword);

    // Update user
    const updatedUser: Record<string, any> = { ...user, PasswordHash: newPasswordHash };
    delete updatedUser.ResetToken;
    delete updatedUser.ResetTokenExpires;

    await dynamoDb.send(new PutCommand({ TableName: USERS_TABLE, Item: updatedUser }));

    return NextResponse.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
