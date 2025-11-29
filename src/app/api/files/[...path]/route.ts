import { NextResponse } from "next/server";

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, extname, join, normalize } from "node:path";

import { auth } from "~/lib/auth/server";
import { getContentType } from "~/services/file-storage";

import type { NextRequest } from "next/server";

/**
 * Serves score files (PDFs and images) from the filesystem
 * GET /api/files/{userId}/{musicBrainzId}.pdf
 * GET /api/files/{userId}/{musicBrainzId}/1.webp
 */
export async function GET(
  { headers }: NextRequest,
  { params }: RouteContext<"/api/files/[...path]">,
) {
  const session = await auth.api.getSession({
    headers: headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path } = await params;

    // Reconstruct the file path from the URL segments
    const filePath = join(process.cwd(), "uploads", "scores", ...path);

    // Security: Ensure the file path is within uploads directory
    const uploadsDir = join(process.cwd(), "uploads", "scores");
    const normalizedPath = normalize(filePath);

    if (!normalizedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Security: Ensure user can only access their own files
    const requestedUserId = path[0]!;
    if (requestedUserId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only access your own files" },
        { status: 403 },
      );
    }

    // Check if file exists
    if (!existsSync(normalizedPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(normalizedPath);
    const ext = extname(normalizedPath).toLowerCase();

    // Get content type from centralized config
    const contentType = getContentType(ext);

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${basename(normalizedPath)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File serving error:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 },
    );
  }
}
