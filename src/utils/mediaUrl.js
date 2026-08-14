/**
 * Resolve media URLs for display.
 * Cloudinary URLs are returned as-is; legacy relative paths still work in local/dev.
 */
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:3000";

export function mediaUrl(path) {
  if (path == null || path === "") return "";
  const value = String(path);
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}
