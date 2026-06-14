import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url);
  
  // Clear the cookie
  response.cookies.delete("admin_token");
  
  return response;
}
