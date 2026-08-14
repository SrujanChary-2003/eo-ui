export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatLabel(value) {
  return String(value || "").replaceAll("_", " ");
}

export function formatDate(value) {
  if (!value) return "Date TBA";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date TBA" : date.toLocaleString();
}

export function resourceId(item, ...fallbacks) {
  if (item == null) {
    return fallbacks.find((value) => typeof value === "string" && value) || "";
  }
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }
  const nested = item.id || item._id;
  if (nested && typeof nested !== "object") return String(nested);
  return fallbacks.find((value) => value && typeof value !== "object") || "";
}
