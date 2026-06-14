import { NextResponse } from "next/server";
import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/auth/rate-limit";

const PORTFOLIO_TABLE = getTableName("data");

export async function GET(request: Request, context: { params: Promise<{ sectionId: string }> }) {
  const params = await context.params;
  const ownerEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_USERNAME || "admin@example.com";

  try {
    const { Item } = await dynamoDb.send(new GetCommand({
      TableName: PORTFOLIO_TABLE,
      Key: { OwnerEmail: ownerEmail, SectionID: params.sectionId }
    }));

    if (!Item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: Item.Data });
  } catch (error) {
    logger.error("api_error", { endpoint: `/api/portfolio/${params.sectionId} (GET)`, error: String(error) });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ sectionId: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const allowed = await checkRateLimit(ip, 20, 60); // 20 requests per 60 seconds
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const params = await context.params;
  const body = await request.json();
  
  try {
    // IDOR Check & Prevention: The user's verified email from the JWT strictly dictates the partition key.
    // They cannot possibly modify data belonging to another user.
    await dynamoDb.send(new PutCommand({
      TableName: PORTFOLIO_TABLE,
      Item: {
        OwnerEmail: session.email,
        SectionID: params.sectionId,
        Data: body,
        UpdatedAt: new Date().toISOString()
      }
    }));

    return NextResponse.json({ message: "Updated successfully", data: body });
  } catch (error) {
    logger.error("api_error", { endpoint: `/api/portfolio/${params.sectionId} (PUT)`, error: String(error) });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
