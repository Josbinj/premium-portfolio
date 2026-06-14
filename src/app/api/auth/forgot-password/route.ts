import { NextResponse } from "next/server";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { generateToken } from "@/lib/auth/crypto";
import { sendEmail } from "@/lib/email/sender";
import { checkRateLimit } from "@/lib/auth/rate-limit";

const USERS_TABLE = getTableName("users");

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(ip, 3, 300); // 3 attempts per 5 mins
    if (!allowed) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

    const { Item: user } = await dynamoDb.send(new GetCommand({ TableName: USERS_TABLE, Key: { Email: email } }));
    if (!user) {
      // Don't leak whether user exists or not
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = generateToken();
    const tokenExpires = new Date(Date.now() + 15 * 60000).toISOString(); // 15 mins

    await dynamoDb.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        ...user,
        ResetToken: resetToken,
        ResetTokenExpires: tokenExpires
      }
    }));

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendEmail(email, "Password Reset Request", `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>. This link expires in 15 minutes.`);

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
