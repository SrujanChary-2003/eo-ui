import apiClient, { setAccessToken } from "../client";

export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function login(payload) {
  const { data } = await apiClient.post("/auth/login", payload);
  if (data.data?.accessToken) {
    setAccessToken(data.data.accessToken);
  }
  return data;
}

export async function verifyEmail(payload) {
  const { data } = await apiClient.post("/auth/verify-email", payload);
  return data;
}

export async function resendVerification(email) {
  const { data } = await apiClient.post("/auth/resend-verification", { email });
  return data;
}

export async function refreshToken() {
  const { data } = await apiClient.post("/auth/refresh");
  if (data.data?.accessToken) {
    setAccessToken(data.data.accessToken);
  }
  return data;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
