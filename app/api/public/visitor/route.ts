import { NextResponse } from "next/server";
import { analyticsService } from "@/services/analytics";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referer, browser, os, device, country, city } = body;
    
    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    
    await analyticsService.logVisit({
      path,
      referer,
      browser,
      os,
      device,
      country,
      city,
      userAgent,
      ipAddress,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging visitor:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
