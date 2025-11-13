import { NextResponse } from "next/server";

import { auth } from "~/server/auth";
import { storeImages, storePdf } from "~/services/file-storage";

import type { NextRequest } from "next/server";
import type { ScoreType } from "~/services/file-storage";

/**
 * Handles score file uploads (PDF or images)
 * POST /api/uploads/score
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const musicBrainzId = formData.get("musicBrainzId") as string;
    const type = formData.get("type") as ScoreType;

    if (!musicBrainzId) {
      return NextResponse.json(
        { error: "musicBrainzId is required" },
        { status: 400 },
      );
    }

    if (type === "pdf") {
      // Handle PDF upload
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { error: "No PDF file provided" },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      await storePdf(buffer, session.user.id, musicBrainzId);

      return NextResponse.json({
        success: true,
        scoreType: "pdf",
        musicBrainzId,
      });
    } else if (type === "images") {
      // Handle multiple image uploads
      const files = formData.getAll("files") as File[];
      if (files.length === 0) {
        return NextResponse.json(
          { error: "No image files provided" },
          { status: 400 },
        );
      }

      const imageBuffers = await Promise.all(
        files.map(async (file) => ({
          buffer: Buffer.from(await file.arrayBuffer()),
          filename: file.name,
        })),
      );

      await storeImages(imageBuffers, session.user.id, musicBrainzId);

      return NextResponse.json({
        success: true,
        scoreType: "images",
        musicBrainzId,
        imageCount: files.length,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'pdf' or 'images'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
