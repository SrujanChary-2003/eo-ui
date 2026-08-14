export function getApiErrorMessage(err, fallback = "Something went wrong") {
  const data = err?.response?.data;
  if (data?.errorCode === "ACCOUNT_LOCKED") {
    const retryAfter = Number(data?.data?.retryAfterSeconds);
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      const minutes = Math.max(1, Math.ceil(retryAfter / 60));
      const when = minutes === 1 ? "1 minute" : `${minutes} minutes`;
      return `Too many login attempts. Please try again after ${when}.`;
    }
    return data?.message || "Too many login attempts. Please try again after 5 minutes.";
  }
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e?.message).filter(Boolean).join(". ");
  }
  return data?.message || err?.message || fallback;
}

export function getFieldErrors(err) {
  const errors = err?.response?.data?.errors || [];
  const map = {};
  for (const item of errors) {
    const field = String(item.field || "").replace(/^body\./, "");
    if (field && item.message) {
      map[field] = item.message;
    }
  }
  return map;
}

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must include uppercase, lowercase, number, and special character";
  }
  return "";
}
