import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

// Simple in-memory download counter (resets on server restart)
// For production, use a database or analytics service
let downloadCount = 0;

export async function POST(request: NextRequest) {
  downloadCount++;

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  console.log("[Resume API] Download tracked:", {
    count: downloadCount,
    ip: ip.substring(0, 45),
    userAgent: userAgent.substring(0, 100),
    time: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: "Download tracked",
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    downloads: downloadCount,
  });
}
