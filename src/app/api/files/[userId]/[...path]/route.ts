import { NextResponse } from "next/server";

import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, extname, join, normalize } from "node:path";
import { Readable } from "node:stream";

import archiver from "archiver";

import { auth } from "~/lib/auth/server";
import { logger } from "~/lib/logger";
import { getContentType } from "~/services/file-storage";

import type { NextRequest } from "next/server";

/**
 * Serves score files (PDFs and images) from the filesystem
 * GET /api/files/{userId}/{musicBrainzId}.pdf
 * GET /api/files/{userId}/{musicBrainzId}/1.webp
 * GET /api/files/{userId}/{musicBrainzId}/download
 */
export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/files/[userId]/[...path]">,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, path } = await params;
    const { searchParams } = req.nextUrl;
    const customFilename = searchParams.get("filename");

    // Security: Ensure user can only access their own files
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only access your own files" },
        { status: 403 },
      );
    }

    const isDownload = path.at(-1) === "download";

    const uploadsDir = join(process.cwd(), "uploads", "scores");

    // Basic traversal protection for userId (though Next.js params are usually safe)
    const safeUserId = normalize(userId).replace(/^(\.\.(\/|\\|$))+/, "");

    const unresolvedFilePath = join(
      uploadsDir,
      safeUserId,
      ...(isDownload ? path.slice(0, -1) : path),
    );

    // Security: Ensure the file path is within uploads directory
    let normalizedPath = normalize(unresolvedFilePath);
    if (!normalizedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Handle download for images
    if (
      isDownload &&
      existsSync(normalizedPath) &&
      statSync(normalizedPath).isDirectory()
    ) {
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.directory(normalizedPath, false);
      archive.finalize().catch((err) => logger.error(err, "Archiver failed:"));

      let downloadName = customFilename ?? "score.zip";
      if (!downloadName.endsWith(".zip")) downloadName += ".zip";

      return new NextResponse(Readable.toWeb(archive) as BodyInit, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadName)}"`,
        },
      });
    }

    // Check if file exists
    if (!existsSync(normalizedPath)) {
      if (isDownload) {
        const pdfPath = normalizedPath + ".pdf";
        if (existsSync(pdfPath)) {
          normalizedPath = normalize(pdfPath);
        } else {
          return NextResponse.json(
            { error: "File not found" },
            { status: 404 },
          );
        }
      } else {
        // Strict matching for View/Fetch
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    }

    const fileBuffer = await readFile(normalizedPath);
    const ext = extname(normalizedPath).toLowerCase();
    const contentType = getContentType(ext);

    let responseFilename = basename(normalizedPath);
    if (isDownload && customFilename) {
      responseFilename = customFilename;
      if (!responseFilename.toLowerCase().endsWith(ext)) {
        responseFilename += ext;
      }
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(responseFilename)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    logger.error(error, "File serving error:");
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 },
    );
  }
}
