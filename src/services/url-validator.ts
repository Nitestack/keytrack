import "server-only";

/**
 * Validates if a URL is a valid PDF URL
 * Checks both URL format and Content-Type header
 */
export async function validatePdfUrl(url: string): Promise<{
  valid: boolean;
  error?: string;
  contentType?: string;
  fileSize?: number;
}> {
  try {
    // Basic URL validation
    const urlObject = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObject.protocol)) {
      return {
        valid: false,
        error: "Only HTTP and HTTPS URLs are allowed",
      };
    }

    // Make a HEAD request to check content type without downloading
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeyTrack/1.0)",
      },
    });

    if (!response.ok) {
      return {
        valid: false,
        error: `URL returned status ${response.status}: ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Validate content type
    if (
      !contentType?.includes("application/pdf") && // Some servers don't set correct content-type, check URL extension as fallback
      !url.toLowerCase().endsWith(".pdf")
    ) {
      return {
        valid: false,
        error: `URL does not point to a PDF file (Content-Type: ${contentType})`,
      };
    }

    // Check file size if available (50MB limit)
    const MAX_PDF_SIZE = 50 * 1024 * 1024;
    if (contentLength) {
      const size = Number.parseInt(contentLength);
      if (size > MAX_PDF_SIZE) {
        return {
          valid: false,
          error: `PDF file too large: ${(size / 1024 / 1024).toFixed(2)}MB (max: 50MB)`,
        };
      }
    }

    return {
      valid: true,
      contentType: contentType ?? undefined,
      fileSize: contentLength ? Number.parseInt(contentLength) : undefined,
    };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes("Invalid URL")) {
      return {
        valid: false,
        error: "Invalid URL format",
      };
    }

    return {
      valid: false,
      error: err instanceof Error ? err.message : "Failed to validate URL",
    };
  }
}

/**
 * Validates if a URL points to a valid image
 */
export async function validateImageUrl(url: string): Promise<{
  valid: boolean;
  error?: string;
  contentType?: string;
  fileSize?: number;
}> {
  try {
    const urlObject = new URL(url);

    if (!["http:", "https:"].includes(urlObject.protocol)) {
      return {
        valid: false,
        error: "Only HTTP and HTTPS URLs are allowed",
      };
    }

    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeyTrack/1.0)",
      },
    });

    if (!response.ok) {
      return {
        valid: false,
        error: `URL returned status ${response.status}: ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Validate it's an image
    if (!contentType?.startsWith("image/")) {
      return {
        valid: false,
        error: `URL does not point to an image (Content-Type: ${contentType})`,
      };
    }

    // Check file size (10MB limit per image)
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    if (contentLength) {
      const size = Number.parseInt(contentLength);
      if (size > MAX_IMAGE_SIZE) {
        return {
          valid: false,
          error: `Image too large: ${(size / 1024 / 1024).toFixed(2)}MB (max: 10MB)`,
        };
      }
    }

    return {
      valid: true,
      contentType: contentType || undefined,
      fileSize: contentLength ? Number.parseInt(contentLength) : undefined,
    };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes("Invalid URL")) {
      return {
        valid: false,
        error: "Invalid URL format",
      };
    }

    return {
      valid: false,
      error: err instanceof Error ? err.message : "Failed to validate URL",
    };
  }
}
