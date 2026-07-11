import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json({ error: "folderId query parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Configuration Error: Google Drive API Key missing" }, { status: 500 });
    }

    // Google Drive v3 API to list files in a folder
    // Filter to only include images
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const driveApiUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&fields=files(id,name)&pageSize=100`; // Assuming max 100 images per folder for simplicity

    const response = await fetch(driveApiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch from Google Drive API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ files: data.files || [] });
  } catch (error: any) {
    console.error("Error fetching Drive folder:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
