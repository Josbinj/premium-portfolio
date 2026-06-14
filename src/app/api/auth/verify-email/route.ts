import { NextResponse } from "next/server";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const USERS_TABLE = getTableName("users");

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) return NextResponse.json({ success: false }, { status: 400 });

    const { Item: user } = await dynamoDb.send(new GetCommand({ TableName: USERS_TABLE, Key: { Email: email } }));
    
    if (!user || user.VerificationToken !== token) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });
    }

    if (new Date(user.VerificationTokenExpires) < new Date()) {
      return NextResponse.json({ success: false, message: "Token has expired" }, { status: 400 });
    }

    const updatedUser = { ...user, IsVerified: true };
    delete updatedUser.VerificationToken;
    delete updatedUser.VerificationTokenExpires;

    await dynamoDb.send(new PutCommand({ TableName: USERS_TABLE, Item: updatedUser }));

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
