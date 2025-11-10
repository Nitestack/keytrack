/**
 * Type of score stored in the filesystem
 * - pdf: Single PDF file
 * - images: Directory containing multiple image files
 */
export type FileType = "pdf" | "images";

/**
 * Content type mapping for all supported file formats
 */
export const SUPPORTED_IMAGE_CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
} as const;

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  ...new Set(Object.values(SUPPORTED_IMAGE_CONTENT_TYPES)),
];

/**
 * Supported image file extensions
 */
export const SUPPORTED_IMAGE_FORMATS = [
  ...new Set(Object.keys(SUPPORTED_IMAGE_CONTENT_TYPES)),
];
