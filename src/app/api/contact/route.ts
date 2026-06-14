import { NextResponse } from "next/server";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getSession } from "@/lib/auth/session";
import { randomUUID } from "crypto";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logger } from "@/lib/logger";

const MESSAGES_TABLE = getTableName("contact-messages");

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // IDOR Check: Only query messages where the OwnerEmail matches the authenticated session's email
    const { Items } = await dynamoDb.send(new QueryCommand({
      TableName: MESSAGES_TABLE,
      IndexName: "OwnerEmailIndex",
      KeyConditionExpression: "OwnerEmail = :email",
      ExpressionAttributeValues: {
        ":email": session.email
      }
    }));

    return NextResponse.json(Items || []);
  } catch (error) {
    logger.error("api_error", { endpoint: "/api/contact (GET)", error: String(error) });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(ip, 5, 300); // 5 messages per 5 minutes to prevent spam
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const targetOwner = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_USERNAME || "admin@example.com";
    
    const newMessage = {
      ...body,
      MessageID: randomUUID(),
      OwnerEmail: targetOwner,
      createdAt: new Date().toISOString()
    };
    
    await dynamoDb.send(new PutCommand({
      TableName: MESSAGES_TABLE,
      Item: newMessage
    }));

    return NextResponse.json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    logger.error("api_error", { endpoint: "/api/contact (POST)", error: String(error) });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
