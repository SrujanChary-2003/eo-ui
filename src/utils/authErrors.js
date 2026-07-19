export function getApiErrorMessage(err, fallback = "Something went wrong") {
  const data = err?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).filter(Boolean).join(". ");
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
