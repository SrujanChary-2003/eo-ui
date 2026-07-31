/**
 * Resolve media URLs for display.
 * Cloudinary URLs are returned as-is; legacy relative paths still work in local/dev.
 */
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:3000";

export function mediaUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
