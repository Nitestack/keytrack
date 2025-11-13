import path from "path";

import fs from "fs-extra";
import sharp from "sharp";

import {
  SUPPORTED_IMAGE_CONTENT_TYPES,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_IMAGE_MIME_TYPES,
} from "~/services/file-types";

/**
 * Base directory for storing score files
 * In Docker: /app/uploads/scores
 * In development: ./uploads/scores
 */
const SCORES_DIR = path.join(process.cwd(), "uploads", "scores");

/**
 * Type of score stored in the filesystem
 * - pdf: Single PDF file
 * - images: Directory containing multiple image files
 */
export type ScoreType = "pdf" | "images";

/**
 * Gets the content type for a file extension
 * @param ext - File extension (with or without leading dot)
 * @returns Content type string or 'application/octet-stream' if unknown
 *
 * @example
 * ```ts
 * getContentType('.pdf') // 'application/pdf'
 * getContentType('jpg') // 'image/jpeg'
 * getContentType('.unknown') // 'application/octet-stream'
 * ```
 */
export function getContentType(ext: string): string {
  const normalizedExt = ext.startsWith(".") ? ext : `.${ext}`;
  if (normalizedExt.toLowerCase() === ".pdf") return "application/pdf";
  return (
    SUPPORTED_IMAGE_CONTENT_TYPES[normalizedExt.toLowerCase()] ??
    "application/octet-stream"
  );
}

/**
 * Gets the base directory for a user's scores
 */
function getUserScoreDir(userId: string): string {
  return path.join(SCORES_DIR, userId);
}

/**
 * Gets the path for a PDF score
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID
 */
export function getPdfPath(userId: string, musicBrainzId: string): string {
  return path.join(getUserScoreDir(userId), `${musicBrainzId}.pdf`);
}

/**
 * Gets the directory for image scores
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID
 */
export function getImagesDir(userId: string, musicBrainzId: string): string {
  return path.join(getUserScoreDir(userId), musicBrainzId);
}

/**
 * Validates if a file has a supported image format
 * @param filename - The filename to validate
 */
export function isSupportedImageFormat(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_IMAGE_FORMATS.includes(ext);
}

/**
 * Validates if a MIME type is a supported image format
 * @param mimeType - The MIME type to validate
 */
export function isSupportedImageMimeType(mimeType: string): boolean {
  return SUPPORTED_IMAGE_MIME_TYPES.includes(mimeType);
}

/**
 * Gets all image paths for a score (sorted by page number)
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID
 */
export async function getImagePaths(
  userId: string,
  musicBrainzId: string,
): Promise<string[]> {
  const imagesDir = getImagesDir(userId, musicBrainzId);

  if (!fs.existsSync(imagesDir)) {
    return [];
  }

  const files = await fs.readdir(imagesDir);

  // Sort numerically (1.webp, 2.webp, ..., 10.webp, etc.)
  return files
    .filter((f) => f.endsWith(".webp"))
    .sort((a, b) => {
      const numA = parseInt(a.split(".")[0]!);
      const numB = parseInt(b.split(".")[0]!);
      return numA - numB;
    })
    .map((f) => path.join(imagesDir, f));
}

/**
 * Gets the public URL(s) for a score
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID
 * @param scoreType - Type of score ('pdf' or 'images')
 */
export async function getScoreUrls(
  userId: string,
  musicBrainzId: string,
  scoreType: ScoreType,
): Promise<string[]> {
  if (scoreType === "pdf") {
    return [`/api/files/${userId}/${musicBrainzId}.pdf`];
  } else {
    try {
      const imagePaths = await getImagePaths(userId, musicBrainzId);
      return imagePaths.map((p) => {
        const relativePath = p.replace(SCORES_DIR, "");
        return `/api/files${relativePath.replace(/\\/g, "/")}`;
      });
    } catch (err) {
      console.error("Error getting image paths:", err);
      return [];
    }
  }
}

/**
 * Stores a PDF file buffer to the filesystem
 *
 * File structure: /uploads/scores/{userId}/{musicBrainzId}.pdf
 *
 * @param buffer - The PDF file as a Buffer
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID (used as filename)
 *
 * @example
 * ```ts
 * const pdfBuffer = Buffer.from(await response.arrayBuffer());
 * await storePdf(pdfBuffer, "user123", "dad62c26-f0f3-3d1d-a491-62078052c449");
 * ```
 */
export async function storePdf(
  buffer: Buffer,
  userId: string,
  musicBrainzId: string,
): Promise<void> {
  const pdfPath = getPdfPath(userId, musicBrainzId);
  await fs.outputFile(pdfPath, buffer);
}

/**
 * Downloads a PDF from a URL and stores it to the filesystem
 *
 * This function handles both IMSLP URLs and custom PDF URLs.
 * The PDF is downloaded and saved as {musicBrainzId}.pdf
 *
 * @param url - The URL of the PDF to download (IMSLP or custom)
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID (used as filename)
 *
 * @example
 * ```ts
 * await downloadAndStorePdf(
 *   "https://imslp.org/files/imglnks/usimg/...",
 *   "user123",
 *   "dad62c26-f0f3-3d1d-a491-62078052c449"
 * );
 * ```
 */
export async function downloadAndStorePdf(
  url: string,
  userId: string,
  musicBrainzId: string,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await storePdf(buffer, userId, musicBrainzId);
}

/**
 * Downloads multiple images from URLs and stores them to the filesystem
 *
 * Images are converted to lossless WebP and numbered sequentially.
 * File structure: /uploads/scores/{userId}/{musicBrainzId}/1.webp, 2.webp, ...
 *
 * @param urls - Array of image URLs to download
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID (used as directory name)
 *
 * @example
 * ```ts
 * await downloadAndStoreImages(
 *   ["https://example.com/page1.jpg", "https://example.com/page2.png"],
 *   "user123",
 *   "dad62c26-f0f3-3d1d-a491-62078052c449"
 * );
 * ```
 */
export async function downloadAndStoreImages(
  urls: string[],
  userId: string,
  musicBrainzId: string,
): Promise<void> {
  if (urls.length === 0) {
    throw new Error("At least one image URL is required");
  }

  const imagesDir = getImagesDir(userId, musicBrainzId);
  await fs.ensureDir(imagesDir);

  const createdFiles: string[] = [];

  try {
    // Download and process each image
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]!;

      // Download the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to download image from ${url}: ${response.statusText}`,
        );
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const imagePath = path.join(imagesDir, `${i + 1}.webp`);

      // Convert to lossless WebP for perfect quality on all devices
      await sharp(buffer)
        .webp({
          lossless: true,
        })
        .toFile(imagePath);

      createdFiles.push(imagePath);
    }
  } catch (error) {
    // Cleanup on failure
    for (const filePath of createdFiles) {
      if (fs.existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    }
    throw error;
  }
}

/**
 * Stores multiple image files as WebP format to the filesystem
 *
 * Images are converted to lossless WebP and numbered sequentially.
 * Supports: JPG, JPEG, PNG, WebP, TIFF, TIF formats
 * File structure: /uploads/scores/{userId}/{musicBrainzId}/1.webp, 2.webp, ...
 *
 * @param buffers - Array of image buffers with their original filenames
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID (used as directory name)
 *
 * @example
 * ```ts
 * const images = [
 *   { buffer: Buffer.from(...), filename: "page1.jpg" },
 *   { buffer: Buffer.from(...), filename: "page2.tiff" }
 * ];
 * await storeImages(images, "user123", "dad62c26-f0f3-3d1d-a491-62078052c449");
 * // Creates: 1.webp, 2.webp in the score directory
 * ```
 */
export async function storeImages(
  buffers: Array<{ buffer: Buffer; filename: string }>,
  userId: string,
  musicBrainzId: string,
): Promise<void> {
  if (buffers.length === 0) {
    throw new Error("At least one image is required");
  }

  const imagesDir = getImagesDir(userId, musicBrainzId);
  await fs.ensureDir(imagesDir);

  const createdFiles: string[] = [];

  try {
    // Process each image
    for (let i = 0; i < buffers.length; i++) {
      const { buffer, filename } = buffers[i]!;

      // Validate file format
      if (!isSupportedImageFormat(filename)) {
        throw new Error(
          `Unsupported image format: ${filename}. Supported formats: ${SUPPORTED_IMAGE_FORMATS.join(", ")}`,
        );
      }

      const imagePath = path.join(imagesDir, `${i + 1}.webp`);

      // Convert to lossless WebP for perfect quality on all devices
      await sharp(buffer)
        .webp({
          lossless: true, // Perfect quality on all devices
        })
        .toFile(imagePath);

      createdFiles.push(imagePath);
    }
  } catch (error) {
    // Cleanup on failure
    for (const filePath of createdFiles) {
      if (fs.existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    }
    throw error;
  }
}

/**
 * Deletes all files associated with a score from the filesystem
 *
 * For PDF scores: Deletes the single PDF file
 * For image scores: Deletes the entire directory containing all images
 *
 * @param userId - The user ID who owns this score
 * @param musicBrainzId - The MusicBrainz work ID
 * @param scoreType - Type of score to delete ('pdf' or 'images')
 * @returns Promise that resolves when files are deleted
 *
 * @example
 * ```ts
 * // Delete a PDF score
 * await deleteScore("user123", "dad62c26-f0f3-3d1d-a491-62078052c449", "pdf");
 *
 * // Delete an image score (deletes entire directory)
 * await deleteScore("user123", "dad62c26-f0f3-3d1d-a491-62078052c449", "images");
 * ```
 */
export async function deleteScore(
  userId: string,
  musicBrainzId: string,
  scoreType: ScoreType,
): Promise<void> {
  try {
    if (scoreType === "pdf") {
      const pdfPath = getPdfPath(userId, musicBrainzId);
      if (fs.existsSync(pdfPath)) {
        await fs.unlink(pdfPath);
      }
    } else {
      const imagesDir = getImagesDir(userId, musicBrainzId);
      if (fs.existsSync(imagesDir)) {
        await fs.remove(imagesDir);
      }
    }
  } catch (error) {
    console.error("Failed to delete score files:", error);
    // Don't throw - we still want to delete from DB even if file deletion fails
  }
}
