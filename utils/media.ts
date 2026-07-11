/**
 * Converts a Google Drive share/view link to a direct embeddable image URL.
 *
 * Supported input formats:
 *   - https://drive.google.com/file/d/FILE_ID/view?usp=...
 *   - https://drive.google.com/open?id=FILE_ID
 *   - https://drive.google.com/uc?export=view&id=FILE_ID
 *   - Already converted lh3.googleusercontent.com/d/FILE_ID
 *
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 */
export function convertGoogleDriveUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // Convert old lh3.googleusercontent.com links to the uc endpoint
  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([^/?#]+)/);
  if (lh3Match) return `https://drive.google.com/uc?id=${lh3Match[1]}`;

  // /file/d/ID/ pattern (share/view links)
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) return `https://drive.google.com/uc?id=${fileMatch[1]}`;

  // ?id=ID or &id=ID (open / uc links)
  const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
  if (idMatch && trimmed.includes("drive.google.com"))
    return `https://drive.google.com/uc?id=${idMatch[1]}`;

  return trimmed;
}

export function isGoogleDriveLink(url: string): boolean {
  return url.trim().includes("drive.google.com");
}

/**
 * Extracts the folder ID from a Google Drive folder URL.
 * Supports:
 * - https://drive.google.com/drive/folders/ID?usp=sharing
 * - https://drive.google.com/drive/u/0/folders/ID
 */
export function extractDriveFolderId(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(/\/folders\/([^/?#]+)/);
  return match ? match[1] : null;
}

export function isGoogleDriveFolderLink(url: string): boolean {
  return !!extractDriveFolderId(url);
}

/** Auto-generate URL-safe slug from a title string */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
