import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  // Authentication Check: Prevent unauthenticated users from uploading files
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const allowed = await checkRateLimit(ip, 10, 300); // 10 uploads per 5 minutes
  if (!allowed) {
    return NextResponse.json({ error: "Too many upload attempts. Please try again later." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = formData.get("type") === "ats" ? "resume-ats.pdf" : "resume.pdf";
    
    // To support multi-tenancy seamlessly, we namespace the uploaded file locally.
    // In a fully robust AWS deployment, this should write to an S3 bucket with a prefix (e.g. `s3://bucket/resumes/${session.email}/resume.pdf`).
    const safeEmailPrefix = session.email.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeEmailPrefix}_${type}`;
    const filePath = path.join(process.cwd(), "public", filename);
    
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error) {
    logger.error("api_error", { endpoint: "/api/upload-resume", error: String(error) });
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
